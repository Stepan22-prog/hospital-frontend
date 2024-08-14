"use client"
import { useState } from "react";
import Loader from "@/components/Loader"
import { notificationsService } from "@/services/notifications"
import { INotification } from "@/types/notifications.type"
import { Box, Button, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableRow, Typography } from "@mui/material"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import InfoIcon from '@mui/icons-material/Info';
import WarningIcon from '@mui/icons-material/Warning';
import ReportIcon from '@mui/icons-material/Report';
import ReadMoreDialog from "./ReadMoreDialog";

export default function Notifications() {
  const [onlyUnread, setOnlyUnread] = useState<boolean>(true);
  const [selectedNotification, setSelectedNotification] = useState<INotification | null>(null);
  const queryClient = useQueryClient();

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['notifications', onlyUnread],
		queryFn: () => notificationsService.getAllByUserId(onlyUnread),
  })

  const { mutate: mutateMessageStatus } = useMutation({
		mutationFn: (messageId: string) => notificationsService.markAsRead(messageId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
	})

  function defineIcon(type: INotification['type']) {
    switch (type) {
      case 'Warning':
        return <WarningIcon color="warning" />
      case 'Error':
        return <ReportIcon color="error" />
      default:
        return <InfoIcon color="primary" />
    }
  }

  const handleReadMoreDialogClose = () => setSelectedNotification(null);
  const handleDialogMarkAsRead = () => {
    if(isSuccess && selectedNotification) {
      mutateMessageStatus(selectedNotification._id);
    }
    setSelectedNotification(null);
  }

  return (
    <Box margin={2} width="100%">
      <Typography variant="h5" component="h1">Notifications:</Typography>
      <FormControlLabel control={
          <Switch 
            checked={onlyUnread}
            onChange={() => setOnlyUnread(prevState => !prevState)}
          />
      } label="show only unread" />
      {isSuccess && data.length !== 0 &&
      <TableContainer>
        <Table sx={{ minWidth: 650, borderCollapse: 'separate', borderSpacing: '0 8px' }} aria-label="notifications table">
          <TableBody>
            {isSuccess && data.map((row) => (
              <TableRow
                component={Paper}
                key={row._id}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 }, 
                  background: row.isRead ? '#adabab5c': 'white',
                }}
              >
                <TableCell component="th" scope="row">
                  {defineIcon(row.type)}
                </TableCell>
                <TableCell component="th" scope="row">
                  {row.senderName}
                </TableCell>
                <TableCell 
                  sx={{ '&:hover': { cursor: 'pointer' } }}
                  onClick={() => setSelectedNotification(row)}
                >
                  {row.message.length > 25 ? `${row.message.substring(0, 23)}...` : row.message}
                </TableCell>
                <TableCell>{row.isRead ? 'Read' : 'Unread'}</TableCell>
                <TableCell component="th" scope="row">{dayjs(row.date).format('DD.MM.YYYY HH:mm')}</TableCell>
                <TableCell align="right">
                  <Button 
                    variant="outlined"
                    disabled={row.isRead}
                    onClick={() => mutateMessageStatus(row._id)}
                  >Mark as read</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>}
      <ReadMoreDialog 
        data={selectedNotification}
        handleClose={handleReadMoreDialogClose}
        markAsRead={handleDialogMarkAsRead}
      />
      {isSuccess && data?.length === 0 && 
        <Typography 
          textAlign="center" 
          component="h3" 
          variant="h6"
        >{"You don't have any notifications."}</Typography>
      }
      {isError && 
        <Typography 
          textAlign="center"
          component="h3" 
          variant="h5"
          color="error"
          mt={4}
        >Error. Try again</Typography>
      }
      <Loader isLoading={isFetching} />
    </Box>
  )
}