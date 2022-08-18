import {
  Flex,
  Grid,
  GridItem,
  Heading,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { GetRestaurantResult } from '../../../pages/restaurants/[id]'

type RestaurantInfoProps = {
  restaurant: NonNullable<GetRestaurantResult>
}

const RestaurantInfo = ({ restaurant }: RestaurantInfoProps) => {
  const restaurantCover = restaurant.photos[restaurant.photos.length - 1]
  const restaurantCoverAlt = `foodgether ${restaurant.name} cover photo`
  const { minPrice, maxPrice } = restaurant.priceRange
  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      h="fit-content"
      gap={5}
      marginBottom="5"
      backgroundColor="orange.100"
      padding="5"
    >
      <GridItem colSpan={[3, null, 1]}>
        <Image
          src={restaurantCover.value}
          height={restaurantCover.height}
          width={restaurantCover.width}
          alt={restaurantCoverAlt}
        />
      </GridItem>
      <GridItem colSpan={[3, null, 2]}>
        <Flex direction="column" gap={5}>
          <Link href={restaurant.url} passHref>
            <ChakraLink>
              <Heading color="orange.600">{restaurant.name}</Heading>
            </ChakraLink>
          </Link>
          <Flex direction="column">
            <Text fontSize="lg">{restaurant.address}</Text>
            <Text fontSize="md" color="gray.500">
              {minPrice} - {maxPrice}
            </Text>
          </Flex>
        </Flex>
      </GridItem>
    </Grid>
  )
}

export default RestaurantInfo
