import { PrismaClient } from '@prisma/client'

import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createMockPrismaContext = (): MockContext => {
  return {
    prisma: mockDeep<PrismaClient>(),
  }
}
