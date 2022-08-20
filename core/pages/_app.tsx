import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Box, ChakraProvider, Flex } from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { userContext, userContextInitialValue } from '../libs/context/user'
import useAuth from '../libs/data/auth'
import Header from '../libs/components/header'

function MyApp({ Component, pageProps }: AppProps) {
  const [user, setUser] = useState(userContextInitialValue)
  const { authResponse, loading, loggedOut } = useAuth()
  useEffect(() => {
    if (loading) {
      setUser((user) => ({ ...user, isLoading: true }))
      return
    }
    if (loggedOut) {
      setUser({ ...userContextInitialValue })
      return
    }
    if (authResponse) {
      setUser((user) => ({ ...user, ...authResponse, isLoading: false }))
    }
  }, [authResponse, loading, loggedOut])

  return (
    <ChakraProvider>
      <userContext.Provider value={{ user, setUser }}>
        <Flex marginX="12" height="100%" direction="column">
          <Header />
          <Box flex="1">
            <Component {...pageProps} />
          </Box>
        </Flex>
      </userContext.Provider>
    </ChakraProvider>
  )
}

export default MyApp
