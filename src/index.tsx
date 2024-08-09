import '@kitajs/html/register'
import dotenv from 'dotenv'
import fastify from 'fastify'
import { prisma } from './config/db'
import { logger } from './config/logger'
import initRegisters from './middlewares/init'
import routes from './routes'
import { authenticationSetupMiddleware } from './middlewares/auth'
dotenv.config()

const app = fastify({ logger: false })
const port = Number(process.env.PORT || 5000)

initRegisters(app)
authenticationSetupMiddleware(app)
app.register(routes)

async function init() {
  try {
    await prisma.$connect()
    await app.listen({ port })
    logger.info('Running app on port: ' + port)
  } catch (err) {
    console.error(err)
    await prisma.$disconnect()
    app.log.error(err)
    process.exit(1)
  }
}

init()
