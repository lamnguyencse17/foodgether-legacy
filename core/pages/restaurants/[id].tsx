import { Box, Flex, Spinner, Text } from '@chakra-ui/react'
import { Prisma } from '@prisma/client'
import { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import Head from 'next/head'
import { ParsedUrlQuery } from 'querystring'
import {
  getIdPathForRestaurant,
  getRestaurantFromId,
} from '../../libs/db/restaurant'
import useSWR from 'swr/immutable'
import { Fetcher } from 'swr'
import { createPrismaContext } from '../../libs/db/context'
import NotFound from '../../libs/components/restaurants/notFound'
import RestaurantInfo from '../../libs/components/restaurants/restaurantInfo'
import RestaurantDishList from '../../libs/components/restaurants/dishList'

export const getStaticPaths: GetStaticPaths = async () => {
  const prismaCtx = createPrismaContext()
  const menuIds = await getIdPathForRestaurant(prismaCtx)
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
    const prismaCtx = createPrismaContext()
    const restaurant = await getRestaurantFromId(prismaCtx, id)
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

export type GetRestaurantResult = Awaited<
  Prisma.PromiseReturnType<typeof getRestaurantFromId>
>

type RestaurantProps = {
  restaurant: GetRestaurantResult
}

const fetcher: Fetcher<
  { restaurant: GetRestaurantResult },
  [string, string | null]
> = async (url: string, shopeeUrl: string | null) => {
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
  const { data } = useSWR(
    [
      'https://foodgether-scraper.herokuapp.com/restaurants',
      cachedRestaurant?.url,
    ],
    fetcher
  )
  const fetchedRestaurant = data?.restaurant
  const restaurant = fetchedRestaurant ? fetchedRestaurant : cachedRestaurant
  if (!restaurant) {
    return <NotFound />
  }
  const title = `Foodgether for ${restaurant.name}`
  const menu = restaurant.menu
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
              backgroundColor="orange.100"
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
          <RestaurantInfo restaurant={restaurant} />
          <Text fontSize="2xl" paddingLeft="5" color="orange.600">
            Menu
          </Text>
          <RestaurantDishList restaurant={restaurant} />
        </Flex>
      </Box>
    </Box>
  )
}

export default Restaurant
