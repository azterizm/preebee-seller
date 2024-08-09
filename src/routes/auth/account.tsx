import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import _ from 'lodash'
import { getSellerById, updateSellerById } from '../../models/seller'
import Profile from '../../pages/auth/Profile'
import { Seller } from '@prisma/client'
import { prisma } from '../../config/db'
import ManageShipping from '../../pages/auth/ManageShipping'
import uniqid from 'uniqid'

export default function (
  app: FastifyInstance,
  _: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get('/', {
    schema: { response: { 200: { type: 'string' } } },
  }, async (req, res) => {
    const seller = await getSellerById(req.user?.id!, {
      email: true,
      phone: true,
      address: true,
      createdAt: true,
      social: {
        select: {
          link: true,
          platform: true,
        },
      },
    }) as Seller & { social: { platform: string; link: string }[] }

    return res.type('text/html').send(
      <Profile
        user={{
          ...req.user!,
          ...seller,
          social: !seller.social?.length
            ? [{
              platform: 'Facebook',
              link: '',
            }, {
              platform: 'Twitter',
              link: '',
            }, {
              platform: 'Instagram',
              link: '',
            }, {
              platform: 'TikTok',
              link: '',
            }, {
              platform: 'YouTube',
              link: '',
            }]
            : seller.social,
        } as any}
      />,
    )
  })

  app.post<{
    Body: {
      name: string
      phone: string
      address: string
      facebook: string
      twitter: string
      instagram: string
      tiktok: string
      youtube: string
    }
  }>('/', {
    schema: {
      response: { 200: { type: 'string' } },
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
          facebook: { type: 'string' },
          twitter: { type: 'string' },
          instagram: { type: 'string' },
          tiktok: { type: 'string' },
          youtube: { type: 'string' },
        },
        required: ['name', 'phone', 'address'],
      },
    },
  }, async (req, res) => {
    const user = req.user!
    const social = _.omit(req.body, ['name', 'phone', 'address'])
    await updateSellerById(user.id, {
      name: req.body.name,
      phone: req.body.phone,
      address: req.body.address,
      social: {
        deleteMany: {},
        create: Object.keys(social).map((r) => ({
          platform: _.capitalize(r),
          link: social[r as keyof typeof social],
        })),
      },
    })
    return res.redirect('/account')
  })
  app.get('/manage_shipping', {
    schema: { response: { 200: { type: 'string' } } },
  }, async (req, res) => {
    const shippingCosts = await prisma.shippingCosts.findMany({
      where: {
        sellerId: req.user?.id!,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return res.type('text/html').send(
      <ManageShipping data={shippingCosts} />,
    )
  })
  app.post<{
    Body: {
      city: string
      province: string
      cost: string
    }
  }>('/add_new_shipping', {
    schema: {
      body: {
        type: 'object',
        properties: {
          city: { type: 'string' },
          province: { type: 'string' },
          cost: { type: 'string' },
        },
        required: ['city', 'province', 'cost'],
      },
      response: { 200: { type: 'string' } },
    },
  }, async (req, res) => {
    const { city, province, cost } = req.body
    const user = req.user!
    const result = await prisma.shippingCosts.create({
      data: {
        city,
        province,
        cost: Number(cost.replace(/,/g, '')),
        sellerId: user.id,
      },
    })
    const id = uniqid()

    return res.type('text/html').send(
      <tr id={'row_' + id}>
        <td>{result.province}</td>
        <td>{result.city}</td>
        <td>{result.cost}</td>
        <td>
          <button
            hx-ext='disable-element'
            hx-disable-element='self'
            hx-delete={`/account/remove_shipping/${result.id}`}
            hx-trigger='click'
            hx-swap='none'
            {...{
              'hx-on:htmx:after-request':
                `document.querySelector("tr#row_${id}")?.remove()`,
            }}
            type='button'
            class='btn btn-primary'
          >
            Remove
          </button>
        </td>
      </tr>,
    )
  })

  app.delete<{
    Params: {
      id: string
    }
  }>('/remove_shipping/:id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          id: { type: 'string' },
        },
        required: ['id'],
      },
      response: { 200: { type: 'string' } },
    },
  }, async (req, res) => {
    const id = req.params.id
    await prisma.shippingCosts.delete({
      where: {
        id,
      },
    })

    return res.type('text/html').send(' ')
  })

  app.get('/status', async (req, res) => {
    const user = req.user!
    const instance = await prisma.seller.findUnique({
      where: {
        id: user.id,
      },
      select: {
        status: true,
      },
    })
    if (!instance || instance.status === 'Onboard') {
      return res.type('text/html').send(
        <a href='/onboarding' class='badge badge-error badge-lg'>
          Please complete your profile from this page.
        </a>,
      )
    }
    if (instance.status === 'Verify') {
      return res.type('text/html').send(
        <div
          class='tooltip tooltip-bottom cursor-default'
          data-tip='Preebee team is verifying your personal documents. After verification, your products will be shown in the marketplace.'
        >
          <div class='badge badge-error badge-lg'>
            Account is being verified
          </div>
        </div>,
      )
    }
    if (instance.status === 'Blocked') {
      return res.type('text/html').send(
        <div
          class='tooltip tooltip-bottom cursor-default'
          data-tip='Your account has been blocked by Preebee team. Please contact support for more information.'
        >
          <div class='badge badge-error badge-lg'>Account is blocked</div>
        </div>,
      )
    }

    return res.type('text/html').send(
      <div
        class='tooltip tooltip-bottom cursor-default'
        data-tip='Your account is active and your products are being shown in the marketplace.'
      >
        <div class='badge badge-success badge-lg'>Account is active</div>
      </div>,
    )
  })

  done()
}
