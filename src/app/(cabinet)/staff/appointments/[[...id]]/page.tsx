"use client"

import { appointmentService } from "@/services/appointment";
import { Box, Button, Divider, FormControlLabel, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Link as UILink } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation, useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import CancelDialog from "../../../customers/appointments/CancelDialog";
import { getUserId } from "@/services/auth-token";
import { useParams } from "next/navigation";

const currentDate = dayjs().hour(0).minute(0);

type filtersType = {
  startDate: dayjs.Dayjs | null,
  endDate: dayjs.Dayjs | null,
  isCompleted: boolean,
}

export default function Appointments() {
  const { id } = useParams<{ id: string[] }>();
  const [staffId, setStaffId] = useState<string | null>();
  const [appointmentId, setAppointmentId] = useState<string | null>(null);
  const [filters, setFilters] = useState<filtersType>({ 
    startDate: currentDate,
    endDate: null,
    isCompleted: false,
  });

  const { refetch, data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['appointments'],
		queryFn: () => appointmentService.getByStaff({
      staffId: staffId as string,
      startDate: filters.startDate?.toISOString(),
      endDate: filters.endDate?.toISOString(),
      isCompleted: filters.isCompleted,
    }),
    enabled: !!staffId,
  })

  const { mutate, isPending, isError: isErrorMutation } = useMutation({
		mutationFn: (data: { id: string, status: boolean }) => appointmentService.changeStatus(data.id, { isCompleted: data.status }),
    onSuccess: () => refetch(),
	})

  useEffect(() => {
    const setId = async () => {
      if(id) {
        setStaffId(id[0]);
        return;
      }
      const currentId = await getUserId();
      setStaffId(currentId);
    }
    setId();
  }, []);

  useEffect(() => {
    if (staffId) {
      refetch();
    }
  }, [filters.startDate, filters.endDate, filters.isCompleted, refetch, staffId]);

  const closeDialog = () => setAppointmentId(null);

  return (
    <Box margin={2} width="100%">
      <Typography variant="h4" component="h1">Appointments:</Typography>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        marginY={2}
      >
        <DatePicker
          label="StartDate"
          value={filters.startDate}
          onChange={value => setFilters(prevState => ({ ...prevState, startDate: value }))}
          sx={{ 
            width: '100%',
            marginTop: '8px',
            marginBottom: '4px'
          }}
         />
         <Divider sx={{ width: '20px' }} />
         <DatePicker
          label="EndDate"
          value={filters.endDate}
          onChange={value => setFilters(prevState => ({ ...prevState, endDate: value }))}
          sx={{ 
            width: '100%',
            marginTop: '8px',
            marginBottom: '4px'
          }}
         />
         <FormControlLabel control={
          <Switch 
            checked={!filters.isCompleted}
            onChange={(event) => setFilters(prevState => ({ ...prevState, isCompleted: !event.target.checked }))}
          />
         } label="show only scheduled" />
      </Box>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="appointments table">
          <TableHead>
            <TableRow>
              <TableCell>Date and Time</TableCell>
              <TableCell align="right">Name Surname</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isSuccess && data.map((row) => (
              <TableRow
                key={row.id}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {dayjs(row.dateTime).format('DD.MM.YYYY HH:mm')}
                </TableCell>
                <TableCell align="right">
                  <UILink 
                    component={Link}
                    href={`/customer/${row.customer.id}`}
                  >
                    {`${row.customer.name} ${row.customer.surname}`}
                  </UILink>
                </TableCell>
                <TableCell align="right">
                  <Button
                    variant="contained"
                    color={row.isCompleted ? "error" : "success"}
                    onClick={() => mutate({ id: row.id , status: !row.isCompleted})}
                    sx={{ width: "220px" }}
                  >
                    {row.isCompleted ? "Mark as unCompleted" : "Mark as completed"}
                  </Button>
                </TableCell>
                <TableCell align="right">
                  <Button 
                    variant="outlined"
                    color="error"
                    disabled={row.isCompleted}
                    onClick={() => setAppointmentId(row.id)}
                  >
                    Cancel
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {appointmentId && 
      <CancelDialog
        id={appointmentId}
        isOpen={!!appointmentId} 
        closeDialog={closeDialog}
        refetchMyAppointments={refetch}
      />}
    </Box>
  )
}