import { PrismaClient } from '@prisma/client'
import RedisStore from 'connect-redis'
import { Redis } from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL || '')
export const redisSessionStore = new RedisStore({ client: redis })
export const prisma = new PrismaClient()
