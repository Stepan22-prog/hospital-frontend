"use client"

import { Alert, Box, Typography } from '@mui/material'
import { LoadingButton } from '@mui/lab';
import { SubmitHandler, useForm } from 'react-hook-form'
import FormInput from '@/components/Inputs/FormInput';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/auth';
import { ISingIn } from '@/types/auth.type';
import Select from '@/components/Select';
import { useRouter } from 'next/navigation';
import Link from '@/components/Link';
import { AxiosError } from 'axios';

export default function SignIn() {
  const {
    control,
    handleSubmit,
  } = useForm<ISingIn>()

  const { push } = useRouter()

  const { mutate, isPending, error, isError } = useMutation({
		mutationKey: ['signIn'],
		mutationFn: (data: ISingIn) => authService.signIn(data),
    onSuccess: (response) => push(`/${response.data.role === 'Customer' ? 'staff' : 'staff/profile'}`),
	})
  const onSubmit: SubmitHandler<ISingIn> = (data) => mutate(data)

  const getErrorMessage = (statusCode: number | undefined) => {
    switch (statusCode) {
      case 404:
        return "User with such email not found";

      case 401:
        return "Wrong email or password";
    
      default:
        return "Error. Try again";
    }
  }

  return (
    <Box 
      width="50%" 
      maxWidth="400px"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Typography 
        align='center'
        component='h1' 
        variant='h5' 
        mb={1}
      >Sign In</Typography>
      {isError && <Alert severity="error">{getErrorMessage((error as AxiosError).response?.status)}</Alert>}
      <FormInput 
        label='Email'
        control={control}
        errorText='Incorrect email'
        pattern={/^[^\s@]+@[^\s@]+\.[^\s@]+$/}
      />
      <FormInput 
        label='Password'
        control={control}
        errorText='Incorrect password'
        pattern={/^.{8,24}$/}
        type='password'
      />
      <Select 
        label='Role'
        control={control}
        defaultValue='Customer'
        options={['Customer', 'Staff']}
      />
      <LoadingButton 
        loading={isPending}
        variant="contained" 
        fullWidth 
        type="submit"
        loadingPosition="start"
      >
        Submit
      </LoadingButton>
      <Link href='/auth/signup' fullwidth>Register</Link>
    </Box>
  )
}
