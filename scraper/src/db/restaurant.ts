import { Restaurant } from "../scraper";
import prisma from "./prisma";
import dayjs from "dayjs";

export const upsertRestaurant = async (restaurant: Restaurant) => {
  const parsedRestaurant = {
    restaurantId: restaurant.restaurant_id,
    deliveryId: restaurant.delivery_id,
    name: restaurant.name,
    url: restaurant.url,
    address: restaurant.address,
    position: {
      latitude: restaurant.position.latitude,
      longitude: restaurant.position.longitude,
    },
    priceRange: {
      minPrice: restaurant.price_range.min_price,
      maxPrice: restaurant.price_range.max_price,
    },
    isQualityMerchant: restaurant.is_quality_merchant,
    photos: restaurant.photos,
    updatedAt: new Date(),
  };
  return prisma.restaurant.upsert({
    where: {
      restaurantId: restaurant.restaurant_id,
    },
    update: { ...parsedRestaurant, createdAt: new Date() },
    create: parsedRestaurant,
  });
};

export const getRestaurantFromId = async (id: string) => {
  const restaurant = await prisma.restaurant.findUnique({
    where: {
      id,
    },
    include: {
      menu: true,
    },
  });
  if (!restaurant) {
    return null;
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
  };
};
