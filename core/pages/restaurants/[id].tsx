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
import { useEffect, useState } from 'react'

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

const Restaurant: NextPage<RestaurantProps> = ({
  restaurant: cachedRestaurant,
}) => {
  const [fetchedRestaurant, setRestaurant] = useState(cachedRestaurant)
  const [isHydrated, setHydrated] = useState(false)
  useEffect(() => {
    fetch('https://foodgether-scraper.herokuapp.com/restaurants', {
      method: 'POST',
      body: JSON.stringify({
        url: 'https://shopeefood.vn/ho-chi-minh/rules-of-tea-tra-sua-de-vuong-nguyen-van-cu',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(async (result) => {
        setHydrated(true)
        console.log(await result.json())
      })
      .catch((err) => console.log(err))
  }, [])
  console.log(fetchedRestaurant === cachedRestaurant)
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
          {!isHydrated && (
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
