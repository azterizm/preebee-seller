import fastifyCookie from '@fastify/cookie'
import fastifyFormBody from '@fastify/formbody'
import fastifyMultipart from '@fastify/multipart'
import fastifyStatic from '@fastify/static'
import fastifySession from '@mgcrea/fastify-session'
import dotenv from 'dotenv'
import { FastifyInstance } from 'fastify'
import path from 'path'
dotenv.config()

export default function initRegisters(app: FastifyInstance) {
  const sessionSecret = process.env.SESSION_SECRET
  if (!sessionSecret) throw new Error('SESSION_SECRET must be set')
  app
    .register(fastifyStatic, {
      root: path.resolve('public'),
      maxAge: process.env.NODE_ENV === 'development' ? 0 : 3e5,
    })
    .register(fastifyFormBody)
    .register(fastifyCookie)
    .register(fastifySession, {
      cookieName: 'session-seller-eyes',
      secret: sessionSecret,
      cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2.592e8,
        httpOnly: true
      },
      saveUninitialized: false,
    })
    .register(fastifyMultipart, {
      limits: {
        fileSize: 2e7,
        files: 8,
      },
      attachFieldsToBody: true,
      addToBody: true,
    })
}
