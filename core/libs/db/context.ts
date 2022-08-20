import { PrismaClient } from '@prisma/client'

export type Context = {
  prisma: PrismaClient
}

export const createPrismaContext = (): Context => {
  return {
    prisma: new PrismaClient(),
  }
}
