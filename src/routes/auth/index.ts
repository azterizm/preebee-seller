import { FastifyInstance, FastifyPluginOptions, FastifyReply } from 'fastify'
import uniqid from 'uniqid'
import slugify from 'slugify'
import { initGoogleAuthUrl } from '../../middlewares/auth'
import { oauth2Client } from '../../config/auth'
import { google } from 'googleapis'
import { createSeller, getSellerByIdForAuth } from '../../models/seller'

export default function(
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get(
    '/auth/google',
    async (req, res) => {
      const url = await initGoogleAuthUrl(req)
      return res.redirect(url)
    }
  )
  app.get(
    '/auth/google/callback',
    async (req, res) => {
      const { state, code } = req.query as Record<string, string>
      if (!code) {
        return redirectToLoginWithError(res, "Could not login. Try again.")
      }
      if (!state || state !== req.session.get('state')) {
        return redirectToLoginWithError(res, "State mismatched.")
      }
      const { tokens } = await oauth2Client.getToken(code)
      if (!tokens.access_token) {
        return redirectToLoginWithError(res, "Could not login. Try again.")
      }
      oauth2Client.setCredentials(tokens)
      const oauth2 = google.oauth2({ auth: oauth2Client, version: 'v2' })

      const info = await oauth2.userinfo.get()
      const { name, email, picture, id } = info.data
      if (!name || !email || !picture || !id) {
        return redirectToLoginWithError(res, "Profile not complete. Please complete your Google account with all information then try again.")
      }
      req.session.set('state', null)
      let user = await getSellerByIdForAuth(id)
      if (user?.status === 'Blocked') return redirectToLoginWithError(res, "You have been blocked. Please contact the staff.")
      if (user) {
        req.session.set('user_id', user.id)
        return res.redirect('/')
      }

      user = await createSeller({
        providerId: id,
        name,
        providerName: 'google',
        email,
        profile: { create: { imageURL: picture } },
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        id: uniqid(slugify(name, { trim: true, lower: true })),
      }) as any

      req.session.set('user_id', user!.id)

      res.redirect('/')
    },
  )

  done()
}

function redirectToLoginWithError(res: FastifyReply, error: string) {
  return res.redirect('/login?error=' + encodeURIComponent(error))
}

