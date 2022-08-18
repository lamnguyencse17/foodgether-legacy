import { Flex, Heading, Text } from '@chakra-ui/react'
import { NextPage } from 'next'
import Image from 'next/image'
import NotFoundGif from '../../../public/notfound.gif'

import { GetRestaurantResult } from '../../../pages/restaurants/[id]'

type RestaurantInfoProps = {
  restaurant: NonNullable<GetRestaurantResult>
}

const NotFound: NextPage = () => {
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      height="100%"
    >
      <Heading color="orange.600">
        Uh oh... We are still looking for this restaurant
      </Heading>
      <Image src={NotFoundGif} width="200" height="200" alt="" />
      <Text color="orange.500">Come back later would be the best idea</Text>
    </Flex>
  )
}

export default NotFound
