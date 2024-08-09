import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import { z } from 'zod'
import Table from '../components/withdraw/Table'
import { prisma } from '../config/db'
import Withdraw from '../pages/withdraw/Withdraw'
import { minimumWithdrawAmount } from '../constants/api'
import { formatCurrency } from '../utils/ui'
import Form from '../components/withdraw/Form'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error) => void,
) {
  app.get(
    '/',
    { schema: { response: { 200: { type: 'string' } } } },
    async (req, res) => {
      const user = req.user!
      const userInstance = await prisma.seller.findUnique({
        where: { id: user.id },
        select: { earnings: true },
      })
      if (!userInstance) return res.redirect('/auth/login')
      return res.type('text/html').send(
        <Withdraw
          balance={userInstance.earnings}
        />,
      )
    },
  )
  app.get('/history', {
    schema: {
      response: { 200: { type: 'string' } },
    },
  }, async (req, res) => {
    const requests = await prisma.withdrawRequest.findMany({
      where: {
        sellerId: req.user!.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.type('text/html').send(
      <Table requests={requests} />,
    )
  })

  //dont ask same info again
  app.post('/add', {
    schema: {
      response: { 200: { type: 'string' } },
    },
  }, async (req, res) => {
    const body = req.body as any
    const method = Number(body?.method)
    const user = req.user!
    const userInstance = await prisma.seller.findUnique({
      where: { id: user.id },
      include: {
        jazzCash: true,
        easyPaisa: true,
        bankAccount: true,
      },
    })
    if (isNaN(method)) return res.send('Invalid method')
    if (method === Method.EasyPaisa) {
      const input = body?.easypaisa || userInstance?.easyPaisa?.number
      if (!input) return res.send('Invalid input')
      await prisma.easyPaisa.upsert({
        where: { sellerId: user.id },
        update: { number: input },
        create: { number: input, sellerId: user.id },
      })
    }
    if (method === Method.JazzCash) {
      const input = body?.jazzcash || userInstance?.jazzCash?.number
      if (!input) return res.send('Invalid input')
      await prisma.jazzCash.upsert({
        where: { sellerId: user.id },
        update: { number: input },
        create: { number: input, sellerId: user.id },
      })
    }
    if (method === Method.BankTransfer) {
      const input = await bankSchema.safeParseAsync(body)
      if (!input.success && !userInstance?.bankAccount) {
        return res.send('Invalid input')
      }
      if (input.success) {
        await prisma.bankAccount.upsert({
          where: { sellerId: user.id },
          update: {
            bankName: input.data.bank_name,
            number: input.data.bank_account,
            name: input.data.name,
            email: input.data.email,
            phone: input.data.phone,
            numberType: input.data.input_type === 'iban'
              ? 'IBAN'
              : 'AccountNumber',
          },
          create: {
            bankName: input.data.bank_name,
            number: input.data.bank_account,
            name: input.data.name,
            email: input.data.email,
            phone: input.data.phone,
            numberType: input.data.input_type === 'iban'
              ? 'IBAN'
              : 'AccountNumber',
            sellerId: user.id,
          },
        })
      }
    }

    await prisma.withdrawRequest.create({
      data: {
        sellerId: user.id,
        paymentMethod: [
          'JazzCash',
          'EasyPaisa',
          'BankAccount',
        ][method] as any,
      },
    })

    return res.type('text/html').send(
      <p class='my-8 max-w-sm'>
        Your request has been successfully submitted. Please wait for your
        request to be reviewed. Status of your request can be seen from the
        table below.
      </p>,
    )
  })

  app.delete<{
    Params: { id: string }
  }>('/delete/:id', async (req, res) => {
    await prisma.withdrawRequest.delete({
      where: {
        id: req.params.id,
        sellerId: req.user!.id,
      },
    })
    return res.send('ok')
  })

  app.get('/form', async (req, res) => {
    const user = req.user!
    const userInstance = await prisma.seller.findUnique({
      where: { id: user.id },
      select: {
        earnings: true,
        jazzCash: true,
        bankAccount: true,
        easyPaisa: true,
      },
    })
    if (!userInstance) return res.redirect('/auth/login')
    const hasActiveRequest = await prisma.withdrawRequest.findFirst({
      where: {
        sellerId: user.id,
        status: 'Pending',
      },
    })

    return userInstance.earnings < minimumWithdrawAmount
      ? (
        <p class='my-8'>
          Minimum {formatCurrency(minimumWithdrawAmount)}{' '}
          is required to make a withdrawal.
        </p>
      )
      : hasActiveRequest
      ? (
        <p class='my-8'>
          You can only make one withdrawal request at a time.
        </p>
      )
      : <Form data={userInstance} />
  })
  app.delete<{
    Params: { val: string }
  }>('/method/:val', async (req, res) => {
    const enumValue = Number(req.params.val)
    const value = ['JazzCash', 'EasyPaisa', 'BankAccount'][enumValue]
    if (isNaN(enumValue) || !value) return res.send('Invalid method')
    await (prisma as any)[
      value === 'JazzCash'
        ? 'jazzCash'
        : value === 'EasyPaisa'
        ? 'easyPaisa'
        : 'bankAccount'
    ].delete({
      where: {
        sellerId: req.user!.id,
      },
    })

    return res.send('ok')
  })
  done()
}

export const bankSchema = z.object({
  bank_account: z.string(),
  input_type: z.string(),
  bank_name: z.string(),
  name: z.string(),
  email: z.string(),
  phone: z.string(),
})

enum Method {
  JazzCash,
  EasyPaisa,
  BankTransfer,
}
