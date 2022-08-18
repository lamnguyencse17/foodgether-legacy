import dayjs from 'dayjs'
import { Context } from './context'

export const getIdPathForRestaurant = async (ctx: Context) => {
  const restaurants = await ctx.prisma.restaurant.findMany({
    select: {
      id: true,
    },
  })
  return restaurants.map((restaurant) => restaurant.id)
}

export const getRestaurantFromId = async (ctx: Context, id: string) => {
  const restaurant = await ctx.prisma.restaurant.findUnique({
    where: {
      id,
    },
    include: {
      menu: true,
    },
  })
  if (!restaurant) {
    return null
  }
  return {
    ...restaurant,
    createdAt: dayjs(restaurant.createdAt).unix(),
    updatedAt: dayjs(restaurant.updatedAt).unix(),
    menu: {
      ...restaurant.menu,
      createdAt: dayjs(restaurant.menu?.createdAt).unix(),
      updatedAt: dayjs(restaurant.menu?.updatedAt).unix(),
    },
  }
}
