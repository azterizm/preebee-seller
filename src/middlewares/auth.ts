import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import crypto from 'crypto'
import { prisma } from '../config/db'
import { oauth2Client } from '../config/auth'

export function userMustBeAuthenticated(
  req: FastifyRequest,
  res: FastifyReply,
  done: () => void,
) {
  const user = req.user
  if (!user) return res.redirect('/login')
  done()
}

export async function userMustNotBeBlocked(
  req: FastifyRequest,
  res: FastifyReply,
  done: () => void,
) {
  const user = req.user
  if (!user) return res.redirect('/login')
  const instance = await prisma.seller.findUnique({
    where: {
      id: user.id,
    },
    select: { status: true },
  })
  if (instance?.status === 'Blocked') {
    logoutUser(req)
    return res.redirect('/login')
  }
  done()
}

export async function authenticationSetupMiddleware(app: FastifyInstance) {
  app.decorateRequest('user', null)
  app.addHook('preHandler', async (req, _) => {
    const userId = req.session.get('user_id')
    const user = typeof userId !== 'string' ? null : await prisma.seller.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, profile: { select: { imageURL: true } }
      }
    }).catch(_ => null)

    if (user) {
      req.user = {
        ...user as any,
        profile: user.profile?.imageURL || ''
      }
    }
  })
}

export function logoutUser(req: FastifyRequest) {
  req.session.set('user_id', null)
}



export async function initGoogleAuthUrl(req: FastifyRequest) {
  const state = crypto.randomBytes(32).toString('hex');
  req.session.set('state', state)
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'online',
    scope: ['email', 'profile'],
    include_granted_scopes: true,
    state
  })
  return authUrl
}



