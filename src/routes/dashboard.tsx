import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import Table from '../components/dashboard/Table'
import { prisma } from '../config/db'
import Stat from '../components/dashboard/Stat'
import { formatCurrency } from '../utils/ui'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get<{
    Querystring: {
      sortBy?: '0' | '1' | '2' | '3'
    }
  }>('/sales_table', {
    schema: {
      response: { 200: { type: 'string' } },
    },
  }, async (req, res) => {
    const sortByStr = req.query.sortBy || '0'
    const sortBy = [
      'week',
      'month',
      'year',
      'all_time',
    ][parseInt(sortByStr)]
    const user = req.user!
    const currentDate = new Date()
    const toDates = [
      undefined,
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate() - currentDate.getDay(),
      ),
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
      ),
      new Date(
        currentDate.getFullYear(),
        0,
        1,
      ),
    ]

    const products = await prisma.productOrdered.findMany({
      where: {
        product: {
          sellerId: user.id,
        },
        packageStatus: 'Done',
        order: { paymentStatus: 'Done' },
        createdAt: sortBy === 'all_time' ? undefined : {
          gte: toDates[parseInt(sortByStr)],
        },
      },
      select: {
        product: true,
        order: true,
        quantity: true,
        packageStatus: true,
        id: true,
        amount: true,
        commissionTaken: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.send(
      <>
        <div class='my-2 flex items-center gap-4 w-full'>
          <Stat
            //percentage={67.34}
            title='Earnings'
            value={formatCurrency(
              products.reduce((acc, curr) => acc + curr.amount, 0),
            )}
            //trend='up'
          />
          <Stat
            //percentage={67.34}
            title='Sales'
            value={products.reduce((acc, curr) => acc + curr.quantity, 0)}
            //trend='up'
          />
          <Stat
           // percentage={67.34}
            title='Customers'
            value={products.map((r) => r.order.userId).filter((v, i, a) =>
              a.indexOf(v) === i
            ).length}
          //  trend='down'
          />
        </div>
        <Table data={products} />
      </>,
    )
  })

  done()
}
