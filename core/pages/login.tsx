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
import { HiddenUserData, loginSchema } from '../libs/auth'
import { useContext } from 'react'
import { userContext } from '../libs/context/user'

const Login: NextPage = () => {
  const { user, setUser } = useContext(userContext)
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
      phoneNumber: '',
      pin: '',
    },
    onSubmit: async (values) => {
      if (setUser) {
        setUser({ ...user, isLoading: true })
      }
      const response = await fetch('/api/auth/login', {
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
      const userData = (await response.json()) as HiddenUserData
      if (setUser) {
        setUser({ ...userData, isLoading: false })
      }
      await router.push('/')
    },
    validationSchema: toFormikValidationSchema(loginSchema),
  })
  return (
    <div>
      <Head>
        <title>FOODGETHER LOGIN</title>
        <meta name="description" content="FOODGETHER LOGIN" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.phoneNumber || !!errors.pin}>
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
              Sign in
            </Button>
          </Box>
        </FormControl>
      </form>
    </div>
  )
}

export default Login
