"use client"

import { Box, LinearProgress, Typography } from "@mui/material";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import StaffTable from "./StaffTable";
import ActionBar from "./ActionBar";
import ExportExcel from "@/components/ExportExcel";
import { FilterStaffType, IStaffShort } from "@/types/staff.type";
import { staffService } from "@/services/staff";
import { useState } from "react";
import { removeEmptyFields } from "@/helpers/removeEmptyFields";

type StaffProps = {
  isAdmin: boolean;
}

export default function Staff({ isAdmin }: StaffProps) {
  const [staffFilter, setStaffFilter] = useState<FilterStaffType>({});
  const {
    control,
    handleSubmit,
    getValues,
  } = useForm<FilterStaffType>();

  const { data, isFetching, isError, isSuccess } = useQuery({
    queryKey: ['staff', staffFilter],
		queryFn: () =>  staffService.getAll(staffFilter),
    placeholderData: keepPreviousData,
  })
  
  const onSubmit = () => setStaffFilter(removeEmptyFields(getValues()));

  const mapData = (data: IStaffShort[]) => {
    return data.map(item => ({
      ...item,
      specialization: item.specialization?.title,
    }));
  }

  return (
    <Box width="100%" marginRight={1}>
      <Box display="flex" mt={2}>
        <Typography 
          component="h1" 
          variant="h5" 
          flex="auto"
        >{isAdmin ? "Staff:" : "Doctors:"}</Typography>
        {isAdmin && isSuccess && <ExportExcel data={mapData(data)} fileName="staff" />}
      </Box>
      <ActionBar
        isAdmin={isAdmin}
        handleSubmit={handleSubmit}
        onSubmit={onSubmit}
        control={control}
        isFetching={isFetching}
      />
      {isFetching && <LinearProgress sx={{ my: 1 }} />}
      {isSuccess && data?.length !== 0 &&      
        <StaffTable data={data} isAdmin={isAdmin} />
      }
      {isSuccess && data?.length === 0 && 
        <Typography 
          textAlign="center"
          component="h3" 
          variant="h5"
          mt={4}
        >Doctors not found</Typography>
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
    </Box>
  )
}