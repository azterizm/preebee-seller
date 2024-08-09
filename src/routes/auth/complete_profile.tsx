import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'
import { parseZodError } from '../../utils/api'
import { updateSellerById } from '../../models/seller'
import CompleteProfile from '../../pages/auth/CompleteProfile'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get(
    '/',
    { schema: { response: { 200: { type: 'string' } } } },
    async (_, res) => {
      return res.type('text/html').send(<CompleteProfile />)
    },
  )

  app.post<{
    Querystring: { redirect?: string }
  }>('/', async (req, res) => {
    const body = await completeProfileSchema.safeParseAsync(req.body)
    if (!body.success) {
      return res.redirect(
        '/complete_profile?error=' + parseZodError(body.error),
      )
    }
    const user = req.user
    if (!user) return res.redirect('/login')
    await updateSellerById(user.id, {
      address: body.data.address,
      phone: body.data.phone,
    })

    const redirect = req.query?.redirect
    if (redirect) res.redirect(redirect)
    return res.redirect('/')
  })

  done()
}

const completeProfileSchema = z.object({
  address: z.string().min(5),
  phone: z.string().length(11).startsWith('03'),
})
