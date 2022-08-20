import { PrismaClient } from '@prisma/client'

import { mockDeep, DeepMockProxy } from 'jest-mock-extended'
import { MOCK_PRISMA } from '../config'

export type Context = {
  prisma: PrismaClient
}

export type MockContext = {
  prisma: DeepMockProxy<PrismaClient>
}

export const createPrismaContext = (): Context | MockContext => {
  if (MOCK_PRISMA) {
    return {
      prisma: mockDeep<PrismaClient>(),
    }
  }
  return {
    prisma: new PrismaClient(),
  }
}
