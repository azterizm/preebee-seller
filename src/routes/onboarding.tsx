import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'
import { prisma } from '../config/db'
import Onboarding from '../pages/onboarding/AddDocuments'
import AddShipping from '../pages/onboarding/AddShipping'
import { zodFileArray } from '../types/zod'

export default function(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get('/', async (req, res) => {
    const user = req.user

    if (!user) return res.redirect('/')
    const instance = await prisma.seller.findUnique({
      where: {
        id: user.id,
      },
      include: { adminMessages: true },
    })

    if (instance?.status !== 'Onboard') return res.redirect('/')

    const hasDocs = await prisma.nationalIdentityCard.findFirst({
      where: {
        sellerId: user.id,
      },
    })

    const hasShippingSetup = await prisma.shippingCosts.findFirst({
      where: {
        sellerId: user.id,
      },
    })

    if (!hasDocs) {
      return res.type('text/html').send(
        <Onboarding
          error={instance?.adminMessages[0]?.message}
        />,
      )
    }

    if (!hasShippingSetup) {
      return res.type('text/html').send(
        <AddShipping />,
      )
    }

    await prisma.seller.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'Verify',
      },
    })

    return res.redirect('/')
  })

  app.post('/submit_shipping', async (req, res) => {
    const user = req.user

    if (!user) return res.redirect('/')
    await prisma.seller.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'Verify',
      },
    })

    return res.redirect('/')
  })

  app.post('/add_documents', {
    schema: { response: { 200: { type: 'string' } } },
  }, async (req, res) => {
    const user = req.user
    if (!user) return res.redirect('/')
    const instance = await prisma.seller.findUnique({
      where: {
        id: user.id,
      },
    })
    const input = addDocSchema.safeParse(req.body)

    if (instance?.status !== 'Onboard') return res.redirect('/')

    if (!input.success) {
      return res.type('text/html').send(
        <Onboarding
          error={input.error.errors.map((e) => e.message).join(', ')}
        />,
      )
    }

    await prisma.nationalIdentityCard.create({
      data: {
        front: input.data.front[0].data,
        back: input.data.back[0].data,
        sellerId: user.id,
      },
    })

    await prisma.seller.update({
      where: {
        id: user.id,
      },
      data: {
        status: 'Verify',
      },
    })

    return res.type('text/html').send(
      <AddShipping />,
    )
  })
  done()
}

export const addDocSchema = z.object({
  front: zodFileArray.min(1).max(1),
  back: zodFileArray.min(1).max(1),
  agree_rules: z.string(),
})
