import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Stack,
} from '@chakra-ui/react'
import { Prisma } from '@prisma/client'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/future/image'
import { ParsedUrlQuery } from 'querystring'
import {
  getIdPathForRestaurant,
  getRestaurantFromId,
} from '../../libs/db/restaurant'
import useSWR from 'swr'

export const getStaticPaths: GetStaticPaths = async () => {
  const menuIds = await getIdPathForRestaurant()
  return {
    paths: menuIds.map((id) => ({ params: { id } })),
    fallback: true,
  }
}

interface SingleRestaurantContext extends ParsedUrlQuery {
  id: string
}

export const getStaticProps: GetStaticProps = async (context) => {
  const { id } = context.params as SingleRestaurantContext
  try {
    const restaurant = await getRestaurantFromId(id)
    return {
      props: {
        restaurant,
      },
    }
  } catch (err) {
    console.log(err)
    return {
      props: {
        restaurant: null,
      },
    }
  }
}

type RestaurantProps = {
  restaurant: Awaited<Prisma.PromiseReturnType<typeof getRestaurantFromId>>
}

const fetcher = async (url: string, shopeeUrl: string | null) => {
  console.log('Processing shopee url: ', shopeeUrl)
  if (!shopeeUrl) {
    return null
  }
  return fetch(url, {
    method: 'POST',
    body: JSON.stringify({
      url: shopeeUrl,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json())
}

const Restaurant: NextPage<RestaurantProps> = ({
  restaurant: cachedRestaurant,
}) => {
  const { data, error } = useSWR(
    [
      'https://foodgether-scraper.herokuapp.com/restaurants',
      cachedRestaurant?.url,
    ],
    fetcher
  )
  const fetchedRestaurant = data?.restaurant
  const restaurant = fetchedRestaurant ? fetchedRestaurant : cachedRestaurant
  if (!restaurant) {
    return <div>Don&apos;t have id yet</div>
  }
  const title = `Foodgether for ${restaurant.name}`
  const restaurantCover = restaurant.photos[restaurant.photos.length - 1]
  const restaurantCoverAlt = `foodgether ${restaurant.name} cover photo`
  return (
    <Box height="100%">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Foodgether restaurant page" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box p="2" height="100%">
        <Flex direction="column" height="100%" gap="2">
          {!fetchedRestaurant && (
            <Flex
              backgroundColor="orange.200"
              direction="row"
              gap="2"
              height="10"
              alignItems="center"
              px="2"
            >
              <Spinner />
              You are viewing a cached version of this restaurant
            </Flex>
          )}
          <Grid templateColumns="repeat(3, 1fr)" h="fit-content">
            <GridItem colSpan={[3, null, 1]}>
              <Image
                src={restaurantCover.value}
                height={restaurantCover.height}
                width={restaurantCover.width}
                alt={restaurantCoverAlt}
              />
            </GridItem>
            <GridItem colSpan={[3, null, 2]}>
              <Stack>
                <Heading>{restaurant.name}</Heading>
              </Stack>
            </GridItem>
          </Grid>
        </Flex>
      </Box>
    </Box>
  )
}

export default Restaurant
