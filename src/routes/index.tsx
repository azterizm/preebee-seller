import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import alert from './alerts'
import auth from './auth'
import account from './auth/account'
import completeProfile from './auth/complete_profile'
import authPages from './auth/pages'
import home from './home'
import orders from './orders'
import products from './products'
import withdraw from './withdraw'
import { userMustBeAuthenticated } from '../middlewares/auth'
import balance from './balance'
import dashboard from './dashboard'
import onboarding from './onboarding'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.register(home)

  app.register(auth)
  app.register(authPages)

  app.register((app, _, done) => {
    app.addHook('preHandler', userMustBeAuthenticated)

    app.register(dashboard, { prefix: 'dashboard' })
    app.register(onboarding, { prefix: 'onboarding' })
    app.register(completeProfile, { prefix: 'complete_profile' })
    app.register(account, { prefix: 'account' })

    app.register(products, { prefix: 'products' })
    app.register(withdraw, { prefix: 'withdraw' })
    app.register(orders, { prefix: 'orders' })
    app.register(balance, { prefix: 'balance' })

    app.register(alert, { prefix: 'alert' })
    done()
  })

  done()
}
