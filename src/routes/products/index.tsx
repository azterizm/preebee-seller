import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import Table from '../../components/products/Table'
import { redis } from '../../config/db'
import {
    countActiveCollectionRequestBySellerId,
    getAllCollectionRequestBySellerId
} from '../../models/collectionRequest'
import {
    getAllProductsByUserId,
    getAllUnstockedProductsByUserId,
    getProductById,
    getProductImagesIdById,
    getProductInfoById
} from '../../models/product'
import { getSellerById } from '../../models/seller'
import CallRider from '../../pages/products/CallRider'
import CollectionRequests from '../../pages/products/CollectionRequests'
import Information from '../../pages/products/Information'
import ManageProduct from '../../pages/products/ManageProduct'
import Products from '../../pages/products/Products'
import UpdateStocks from '../../pages/products/UpdateStocks'
import { TableOptions, tableOptionsSchema } from '../../types/api'
import action from './action'
import resources from './resource'

export default function (
  app: FastifyInstance,
  _ops: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.get(
    '/',
    { schema: { response: { 200: { type: 'string' } } } },
    async (_, res) => {
      return res.type('text/html').send(
        <Products />,
      )
    },
  )

  app.post<{
    Body: TableOptions
  }>('/products_list', {
    schema: {
      body: tableOptionsSchema,
      response: { 200: { type: 'string' } },
    },
  }, async (req, res) => {
    const sortBy = req.body.sortBy
    const products = await getAllProductsByUserId({
      sellerId: req.user?.id!,
      moreWhere: {
        title: { contains: req.body.search },
      },
      orderBy: sortBy === 'recent'
        ? { createdAt: 'desc' }
        : sortBy === 'stocks_acquired'
        ? { stockAcquired: 'desc' }
        : sortBy === 'price'
        ? { price: 'asc' }
        : sortBy === 'review'
        ? { averageReview: 'desc' }
        : { createdAt: 'desc' },
    })
    if (!products.length) {
      return res.type('text/html').send(
        <div class='text-center text-md font-medium mt-16'>
          You have not added any product. Add one!
        </div>,
      )
    }
    return res.type('text/html').send(
      <Table products={products} />,
    )
  })

  app.get(
    '/add',
    { schema: { response: { 200: { type: 'string' } } } },
    async (_, res) => {
      return res.type('text/html').send(<ManageProduct />)
    },
  )

  app.get(
    '/edit/:id',
    {
      schema: {
        response: { 200: { type: 'string' } },
        params: {
          type: 'object',
          properties: { id: { type: 'string' } },
          required: ['id'],
        },
      },
    },
    async (req, res) => {
      const user = req.user
      const id = (req as any).params.id
      const product = await getProductById(id, user?.id!, {
        ingredients: true,
        suitableFor: true,
        id: true,
        title: true,
        description: true,
        price: true,
        stockAcquired: true,
        category: true,
        subCategory: true,
      })
      const images = await getProductImagesIdById(id)
      if (!product) return res.status(404)
      return res
        .type('text/html')
        .send(
          <ManageProduct
            imagesId={images?.images.map((r) => r.id)}
            data={product as any}
          />,
        )
    },
  )

  app.get('/call_rider', {
    schema: {
      response: { 200: { type: 'string' } },
    },
  }, async (req, res) => {
    const user = req.user!
    const products = await getAllUnstockedProductsByUserId(req.user?.id!)
    const userInstance = await getSellerById(req.user?.id!)

    if (!products.length) {
      return res.redirect('/products')
    }

    if (!userInstance?.address || !userInstance?.phone) {
      return res.redirect('/complete_profile')
    }

    const activeRequest = await countActiveCollectionRequestBySellerId(user.id)

    if (activeRequest > 0) return res.redirect('/products')

    return res
      .type('text/html')
      .send(
        <CallRider
          data={products}
          address={userInstance.address}
        />,
      )
  })

  app.get<{
    Params: { id: string }
  }>('/update_stocks/:id', {
    schema: {
      response: { 200: { type: 'string' } },
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  }, async (req, res) => {
    const id = req.params.id
    const user = req.user!

    const activeRequest = await countActiveCollectionRequestBySellerId(user.id)
    if (activeRequest > 0) return res.redirect('/products')

    const product = await getProductById(id, user.id, {
      id: true,
      title: true,
      stockSpecified: true,
      stockAcquired: true,
    })
    if (!product) return res.status(404)
    return res.type('text/html').send(
      <UpdateStocks
        product={product}
      />,
    )
  })

  app.get<{
    Params: { id: string }
  }>('/info/:id', {
    schema: {
      response: { 200: { type: 'string' } },
      params: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
      },
    },
  }, async (req, res) => {
    const user = req.user!
    const id = req.params.id

    const product = await getProductInfoById(id, user.id)
    if (!product) return res.status(404)
    return res.type('text/html').send(
      <Information product={product} />,
    )
  })

  app.get('/collection_requests', async (req, res) => {
    const user = req.user!
    const collectionRequests = await getAllCollectionRequestBySellerId(user.id)
    await redis.srem(`alerts:${user.id}`, 'collection_request')
    return res.type('text/html').send(
      <CollectionRequests data={collectionRequests} />,
    )
  })

  app.register(action)
  app.register(resources)

  done()
}
