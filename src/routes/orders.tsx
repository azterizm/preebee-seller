import { PackageStatus } from '@prisma/client'
import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import OrdersTable from '../components/orders/Table'
import { prisma, redis } from '../config/db'
import { commissionRate } from '../constants/api'
import { getProductsOrdered } from '../models/product'
import Orders from '../pages/Orders'
import { OrdersSortBy } from '../types/api'
import { handleStringNumber } from '../utils/data'
import { combineObjects } from '../utils/ui'

export default function (
  app: FastifyInstance,
  __: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  app.get(
    '/',
    { schema: { response: { 200: { type: 'string' } } } },
    async (req, res) => {
      const user = req.user!
      await redis.del(`to_process:${user.id}`)
      return res.type('text/html').send(<Orders />)
    },
  )

  app.post<{ Body: { cursor?: number; search: string; sortBy: OrdersSortBy } }>(
    '/query',
    {
      schema: {
        body: {
          type: 'object',
          properties: {
            search: { type: 'string' },
            cursor: { type: 'number' },
            sortBy: { type: 'string' },
          },
          required: ['search', 'sortBy'],
        },
        response: { 200: { type: 'string' } },
      },
    },
    async (req, res) => {
      const user = req.user!
      const { sortBy, search } = req.body
      const orders = await getProductsOrdered(user.id, search, sortBy)

      if (!orders.length) {
        return res.type('text/html').send(
          <div class='text-center text-md font-medium mt-16'>
            No orders found. Try marketing your products through social media.
          </div>,
        )
      }

      return <OrdersTable orders={orders} />
    },
  )

  app.get('/count', {
    schema: {
      response: {
        200: {
          type: 'string',
        },
      },
    },
  }, async (req) => {
    const user = req.user
    const emptyResponse = <div class='hidden' />
    if (!user) return emptyResponse
    const orderLength = handleStringNumber(
      await redis.get(`to_process:${user.id}`) || '0',
    )
    if (orderLength <= 0) return emptyResponse
    return (
      <span class='absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full'>
        {orderLength}
      </span>
    )
  })

  app.post<{
    Body: {
      delivery_action: string
      reason?: string
    }
  }>('/delivery_action', {
    schema: {
      response: { 200: { type: 'string' } },
      body: {
        type: 'object',
        properties: {
          delivery_action: { type: 'string' },
          reason: { type: 'string' },
        },
        required: ['delivery_action'],
      },
    },
  }, async (req, res) => {
    const user = req.user!
    const [action, productOrderId] = req.body.delivery_action.split(':')

    const product = await prisma.productOrdered.update({
      where: { id: productOrderId, product: { sellerId: user.id } },
      data: {
        packageStatus: action as PackageStatus,
        reason: req.body.reason,
      },
      select: {
        packageStatus: true,
        amount: true,
        quantity: true,
      },
    })

    if (product.packageStatus === PackageStatus.Done) {
      const userInstance = await prisma.seller.findUnique({
        where: { id: user.id },
        select: { earnings: true },
      })
      let earnings = userInstance?.earnings || 0
      const comission = product.amount * commissionRate
      earnings += product.amount
      earnings -= comission
      await Promise.all([
        prisma.seller.update({
          where: { id: user.id },
          data: {
            earnings,
          },
        }),
        prisma.productOrdered.update({
          where: { id: productOrderId },
          data: {
            commissionTaken: comission,
          },
        }),
        redis.del(`seller:${user.id}:earnings`),
      ])
    }

    return res.type('text/html').send(
      <select
        name='package_status'
        id={`package_status_${productOrderId}`}
        class='select bg-secondary'
        data-value={action}
        disabled={action === PackageStatus.Done ||
          action === PackageStatus.Failed}
        x-on:change={`action = $event.target.value; actionOnItemId = '${productOrderId}'; $nextTick(() => $refs.delivery_action.showModal());`}
      >
        {Object.keys(PackageStatus).map((s) => (
          <option
            value={s}
            {...combineObjects(
              [
                action === s ? 'selected' : '',
              ],
            )}
          >
            {s}
          </option>
        ))}
      </select>,
    )
  })

  done()
}
