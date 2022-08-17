import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  Spinner,
  Stack,
  Text,
  List,
  ListItem,
  Link as ChakraLink,
  Divider,
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
import useSWR from 'swr/immutable'
import { Fetcher } from 'swr'
import Link from 'next/link'

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

type GetRestaurantResult = Awaited<
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
    return <div>Don&apos;t have id yet</div>
  }
  const title = `Foodgether for ${restaurant.name}`
  const restaurantCover = restaurant.photos[restaurant.photos.length - 1]
  const restaurantCoverAlt = `foodgether ${restaurant.name} cover photo`
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
          <Text fontSize="2xl" paddingLeft="5" color="orange.600">
            Menu
          </Text>
          <Grid templateColumns="repeat(4, 1fr)" h="fit-content" gap={10}>
            <GridItem
              colSpan={1}
              backgroundColor="orange.100"
              border="1px"
              borderColor="orange.200"
              height="fit-content"
            >
              <Stack>
                {menu.dishTypes?.map((dishType) => (
                  <Box id={`${dishType.id}-header`} key={dishType.id}>
                    <Text fontSize="lg" paddingLeft="1">
                      <Link href={`#${dishType.id}`}>
                        <ChakraLink>{dishType.name}</ChakraLink>
                      </Link>
                    </Text>
                  </Box>
                ))}
              </Stack>
            </GridItem>
            <GridItem
              colSpan={3}
              backgroundColor="orange.100"
              border="1px"
              borderColor="orange.200"
            >
              {menu.dishTypes?.map((dishType) => (
                <Stack
                  id={dishType.id.toString()}
                  marginBottom="8"
                  key={dishType.id}
                >
                  <Text
                    fontSize="2xl"
                    paddingLeft="1"
                    fontWeight="bold"
                    color="orange.600"
                  >
                    {dishType.name}
                  </Text>
                  <List spacing={3}>
                    {dishType.dishes.map((dish) => {
                      const dishPhoto = dish.photos[dish.photos.length - 1]
                      return (
                        <ListItem id={dish.id.toString()} key={dish.id}>
                          <Grid
                            templateColumns="repeat(6, 1fr)"
                            h="fit-content"
                            gap={2}
                            padding={5}
                          >
                            <GridItem colSpan={[5, null, 1]}>
                              <Image
                                src={dishPhoto.value}
                                width={dishPhoto.width}
                                height={dishPhoto.height}
                                alt={dish.name}
                              />
                            </GridItem>
                            <GridItem colSpan={[5, null, 4]}>
                              <Text fontSize="lg" fontWeight="semibold">
                                {dish.name}
                              </Text>
                              <Text fontSize="md">{dish.description}</Text>
                            </GridItem>
                            <GridItem colSpan={[5, null, 1]}>
                              <Text fontSize="lg" fontWeight="semibold">
                                {dish.discountPrice
                                  ? dish.discountPrice.text
                                  : dish.price.text}
                              </Text>
                            </GridItem>
                          </Grid>
                          <Divider borderColor="orange.200" />
                        </ListItem>
                      )
                    })}
                  </List>
                </Stack>
              ))}
            </GridItem>
          </Grid>
        </Flex>
      </Box>
    </Box>
  )
}

export default Restaurant
