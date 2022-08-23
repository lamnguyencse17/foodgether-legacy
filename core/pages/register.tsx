import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  useToast,
} from '@chakra-ui/react'
import { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useFormik } from 'formik'
import { toFormikValidationSchema } from 'zod-formik-adapter'
import { loginSchema } from '../libs/auth'

const Register: NextPage = () => {
  const toast = useToast()
  const router = useRouter()
  const {
    handleSubmit,
    handleBlur,
    values,
    touched,
    errors,
    handleChange,
    isSubmitting,
  } = useFormik({
    initialValues: {
      name: '',
      phoneNumber: '',
      pin: '',
    },
    onSubmit: async (values) => {
      const response = await fetch('/api/user/register', {
        method: 'POST',
        body: JSON.stringify(values),
        headers: {
          'Content-Type': 'application/json',
          accept: 'application/json',
        },
      })
      if (!response.ok) {
        const { message } = await response.json()
        toast({
          title: message,
          duration: 5000,
          isClosable: true,
          status: 'error',
        })
        return
      }
      await router.push('/login')
    },
    validationSchema: toFormikValidationSchema(loginSchema),
  })
  return (
    <div>
      <Head>
        <title>FOODGETHER REGISTER</title>
        <meta name="description" content="FOODGETHER REGISTER" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <form onSubmit={handleSubmit}>
        <FormControl
          isInvalid={!!errors.name || !!errors.phoneNumber || !!errors.pin}
        >
          <Box mb="6">
            <FormLabel htmlFor="name">Your Name</FormLabel>
            <Input
              id="name"
              placeholder="Your own name"
              type="name"
              name="name"
              required={true}
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.name && !!touched.name}
              errorBorderColor="red.300"
            />
            <FormErrorMessage>{touched.name && errors.name}</FormErrorMessage>
          </Box>
          <Box mb="6">
            <FormLabel htmlFor="phoneNumber">Phone Number</FormLabel>
            <Input
              id="phoneNumber"
              placeholder="Phone Number"
              type="phoneNumber"
              name="phoneNumber"
              required={true}
              value={values.phoneNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.phoneNumber && !!touched.phoneNumber}
              errorBorderColor="red.300"
            />
            <FormErrorMessage>
              {touched.phoneNumber && errors.phoneNumber}
            </FormErrorMessage>
          </Box>
          <Box mb="6">
            <FormLabel htmlFor="pin">PIN</FormLabel>
            <Input
              id="pin"
              type="pin"
              placeholder="PIN"
              name="pin"
              required={true}
              value={values.pin}
              onChange={handleChange}
              onBlur={handleBlur}
              isInvalid={!!errors.pin && !!touched.pin}
              errorBorderColor="red.300"
            />
            <FormErrorMessage>{touched.pin && errors.pin}</FormErrorMessage>
          </Box>
          <Box marginX="auto" width="fit-content">
            <Button
              type="submit"
              isLoading={isSubmitting}
              loadingText="Submitting"
              colorScheme="twitter"
              size="md"
              width="10rem"
            >
              Sign up
            </Button>
          </Box>
        </FormControl>
      </form>
    </div>
  )
}

export default Register
