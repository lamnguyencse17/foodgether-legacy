import { Flex, Heading } from '@chakra-ui/react'
import { NextPage } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useContext, useEffect } from 'react'
import useSWR from 'swr'
import { userContext, userContextInitialValue } from '../libs/context/user'
import NotFoundGif from '../public/notfound.gif'

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Something went wrong during logout process')
    }
    return res.json()
  })

const Logout: NextPage = () => {
  const { data, error } = useSWR('/api/auth/logout', fetcher)
  const { setUser } = useContext(userContext)
  const router = useRouter()
  useEffect(() => {
    if (!data && !error) {
      setUser((user) => ({ ...user, isLoading: true }))
      return
    }
    if (data || error) {
      router.prefetch('/')
      const transitionTimeout = setTimeout(() => {
        setUser({ ...userContextInitialValue })
        router.push('/')
        clearTimeout(transitionTimeout)
      }, 2000)
    }
  }, [data, error, router, setUser])
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Heading color="orange.600">We are doing the magic stuff...</Heading>
      <Image src={NotFoundGif} width="200" height="200" alt="" />
    </Flex>
  )
}

export default Logout
