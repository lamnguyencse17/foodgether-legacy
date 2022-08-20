import { Restaurant } from '@prisma/client'
import dayjs from 'dayjs'
import { createMockPrismaContext, MockContext } from '../mock'
import { getIdPathForRestaurant, getRestaurantFromId } from '../restaurant'
import { restaurantRecord, restaurantRecordIdOnly } from './sample'

describe('DB_RESTAURANT', () => {
  let mockCtx: MockContext
  beforeEach(() => {
    if (process.env.NODE_ENV !== 'test') {
      throw new Error('This test should be run in test environment')
    }
    mockCtx = createMockPrismaContext() as unknown as MockContext
  })
  it('GET_RESTAURANT_AS_EXPECTED', async () => {
    mockCtx.prisma.restaurant.findUnique.mockResolvedValueOnce(restaurantRecord)
    const processedRecord = await getRestaurantFromId(
      mockCtx,
      restaurantRecord.id
    )
    expect(processedRecord).toEqual({
      ...restaurantRecord,
      createdAt: dayjs(restaurantRecord.createdAt).unix(),
      updatedAt: dayjs(restaurantRecord.updatedAt).unix(),
      menu: {
        ...restaurantRecord.menu,
        createdAt: dayjs(restaurantRecord.menu.createdAt).unix(),
        updatedAt: dayjs(restaurantRecord.menu.updatedAt).unix(),
      },
    })
  })
  it('GET_RESTAURANT_NULL', async () => {
    const processedRecord = await getRestaurantFromId(
      mockCtx,
      restaurantRecord.id
    )
    expect(processedRecord).toEqual(null)
  })
  it('GET_RESTAURANT_ID_LIST', async () => {
    mockCtx.prisma.restaurant.findMany.mockResolvedValueOnce(
      restaurantRecordIdOnly as Restaurant[]
    )
    const processedRecords = await getIdPathForRestaurant(mockCtx)
    expect(processedRecords).toEqual(['1', '2', '3'])
  })
})
