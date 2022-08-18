import { PrismaClient } from '@prisma/client'

import { mockDeep, DeepMockProxy } from 'jest-mock-extended'

export type Context = {
  prisma: PrismaClient
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createPrismaContext = (): Context | MockContext => {
  if (process.env.NODE_ENV === 'test') {
    return {
      prisma: mockDeep<PrismaClient>(),
    }
  }
  return {
    prisma: new PrismaClient(),
  }
}
