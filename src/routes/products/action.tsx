import { FastifyInstance, FastifyPluginOptions } from 'fastify'
import path from 'path'
import safeAwait from 'safe-await'

import uniqid from 'uniqid'
import { z } from 'zod'
import {
  countActiveCollectionRequestBySellerId,
  createCollectionRequest,
} from '../../models/collectionRequest'
import {
  createProduct,
  deleteProductById,
  getProductById,
  updateProductById,
} from '../../models/product'
import ManageProduct from '../../pages/products/ManageProduct'
import { zodFileArray } from '../../types/zod'
import { generateProductId, parseZodError } from '../../utils/api'
import { compressImageToWebp } from '../../utils/image'

export default function (
  app: FastifyInstance,
  _ops: FastifyPluginOptions,
  done: (err?: Error | undefined) => void,
) {
  app.post('/add', async (req, res) => {
    const user = req.user
    const body = await addProductSchema.safeParseAsync(req.body)
    if (!body.success) {
      return res
        .type('text/html')
        .send(<ManageProduct error={parseZodError(body.error)} />)
    }

    const images = await compressBodyImages(
      body.data.images,
    )
    const mainImages = await compressBodyImages(body.data.main_image)

    const [err] = await safeAwait(
      createProduct({
        title: body.data.title,
        category: body.data.selected,
        price: body.data.price,
        stockAcquired: body.data.quantity,
        stockSpecified: 0,
        sellerId: user?.id!,
        description: body.data.description,
        subCategory: body.data.selectedSub,
        images,
        mainImage: mainImages[0],
        id: generateProductId(body.data.title),
        ingredients: {
          create: Array.isArray(body.data.ingredients)
            ? body.data.ingredients.map((r) => ({ name: r }))
            : body.data.ingredients
            ? [{ name: body.data.ingredients }]
            : [],
        },
        suitableFor: {
          create: Array.isArray(body.data.suitable_for_name)
            ? body.data.suitable_for_name
              .filter((r, i) =>
                Boolean(r) &&
                body.data.suitable_for_value &&
                typeof body.data.suitable_for_value[i] !== 'undefined'
              )
              .map((r, i) => ({
                key: r,
                value:
                  !body.data.suitable_for_value || !body.data.suitable_for_name
                    ? ''
                    : body.data.suitable_for_value[i],
              }))
            : body.data.suitable_for_name
            ? !body.data.suitable_for_value ||
                Array.isArray(body.data.suitable_for_value)
              ? []
              : [{
                key: body.data.suitable_for_name as string,
                value: body.data.suitable_for_value as string,
              }]
            : [],
        },
        status: 'Available',
      }),
    )
    if (err) {
      console.error('err:', err)
      return res
        .type('text/html')
        .send(
          <ManageProduct error='Something went wrong. Please try again later.' />,
        )
    }
    res.redirect('/products')
  })

  app.post('/edit', async (req, res) => {
    const user = req.user
    const body = await editProductSchema.safeParseAsync(req.body)
    if (!body.success) {
      return res
        .type('text/html')
        .send(<ManageProduct error={parseZodError(body.error)} />)
    }
    const product = await getProductById(body.data.product_id, user?.id!)
    if (!product || product && product.status === 'Restocking') {
      return res.status(300).send(<ManageProduct error='Product not found' />)
    }
    if (body.data.delete) {
      await deleteProductById(body.data.product_id, user?.id!)
      return res.redirect('/products')
    }

    const images = await compressBodyImages(body.data.images || [])

    const mainImages = !body.data.main_image
      ? undefined
      : await compressBodyImages(body.data.main_image)

    await updateProductById(body.data.product_id, user?.id!, {
      title: body.data.title,
      price: body.data.price,
      category: body.data.selected,
      subCategory: body.data.selectedSub,
      description: body.data.description,
      stockAcquired: body.data.quantity,
      stockSpecified: 0,
      ingredients: {
        deleteMany: {},
        create: Array.isArray(body.data.ingredients)
          ? body.data.ingredients.map((r) => ({ name: r }))
          : body.data.ingredients
          ? [{ name: body.data.ingredients }]
          : [],
      },
      suitableFor: {
        deleteMany: {},
        create: Array.isArray(body.data.suitable_for_name)
          ? body.data.suitable_for_name
            .filter((r, i) =>
              Boolean(r) &&
              body.data.suitable_for_value &&
              typeof body.data.suitable_for_value[i] !== 'undefined'
            )
            .map((r, i) => ({
              key: r,
              value:
                !body.data.suitable_for_value || !body.data.suitable_for_name
                  ? ''
                  : body.data.suitable_for_value[i],
            }))
          : body.data.suitable_for_name
          ? !body.data.suitable_for_value ||
              Array.isArray(body.data.suitable_for_value)
            ? []
            : [{
              key: body.data.suitable_for_name as string,
              value: body.data.suitable_for_value as string,
            }]
          : [],
      },
    }, {
      mainImage: !mainImages?.length ? undefined : mainImages[0],
      newImages: images,
      deletedImagesId: typeof body.data.images_deleted === 'undefined'
        ? []
        : Array.isArray(body.data.images_deleted)
        ? body.data.images_deleted
        : [body.data.images_deleted],
    })

    res.redirect('/products')
  })

  app.post('/call_rider', async (req, res) => {
    const user = req.user!
    const body = req.body as any

    const activeRequest = await countActiveCollectionRequestBySellerId(user.id)
    if (activeRequest > 0) return res.redirect('/products')

    const itemsIdStr = body.items_id
    if (!itemsIdStr) {
      return res.redirect(
        '/products/call_rider?error=' +
          encodeURIComponent('Please select atleast one item.'),
      )
    }
    const itemsId: string[] = itemsIdStr.split(',')

    await Promise.all(itemsId.map((r, i) => {
      const stockSpecifiedStr = body[`item[${i}]`] as string
      const stockSpecified = Number(stockSpecifiedStr)
      if (isNaN(stockSpecified)) return Promise.resolve()
      return updateProductById(r, user.id, {
        stockSpecified,
        status: stockSpecified > 0 ? 'Restocking' : undefined,
      }, {})
    }))

    const [err] = await safeAwait(createCollectionRequest({
      sellerId: user.id,
      status: 'Pending',
      products: { connect: itemsId.map((r) => ({ id: r })) },
    }))

    if (err) {
      return res.redirect(
        '/products/call_rider?error=' +
          encodeURIComponent('Something went wrong. Please try again later.'),
      )
    }

    res.redirect('/products')
  })

  app.post<{
    Body: {
      product_id: string
      quantity: number
    }
  }>('/update_stocks', {
    schema: {
      body: {
        type: 'object',
        required: ['product_id', 'quantity'],
        properties: {
          product_id: { type: 'string' },
          quantity: { type: 'number', minimum: 0 },
        },
      },
    },
  }, async (req, res) => {
    const user = req.user!

    const activeRequest = await countActiveCollectionRequestBySellerId(user.id)
    if (activeRequest > 0) return res.redirect('/products')

    const body = req.body
    await updateProductById(body.product_id, user.id, {
      stockAcquired: body.quantity,
    })
    res.redirect('/products')
  })

  done()
}

export const addProductSchema = z.object({
  title: z.string().min(5, { message: 'Please enter a longer title name.' }),
  price: z
    .string()
    .transform((r) => Number(r.replace(/,/g, '')))
    .refine((r) => r >= 100),
  quantity: z.coerce.number().min(1, { message: 'You must enter a quantity.' }),
  description: z.optional(z.string()),
  selected: z.string(),
  selectedSub: z.string(),
  images: zodFileArray.min(3, { message: 'Please upload atleast 3 images.' }),
  ingredients: z.optional(z.union([z.array(z.string()), z.string()])),
  suitable_for_name: z.optional(z.union([z.array(z.string()), z.string()])),
  suitable_for_value: z.optional(z.union([z.array(z.string()), z.string()])),
  main_image: zodFileArray.min(1),
})

const editProductSchema = addProductSchema.omit({
  images: true,
  main_image: true,
}).extend({
  product_id: z.string(),
  images_deleted: z.optional(z.union([z.string(), z.array(z.string())])),
  images: z.optional(zodFileArray),
  main_image: z.optional(zodFileArray),
  delete: z.optional(z.string()),
})

export async function compressBodyImages(
  images: z.infer<typeof addProductSchema>['images'],
) {
  let imagesPath = await Promise.all(
    images.map((image) =>
      !image.filename ? null : compressImageToWebp({
        input: image.data,
        dest: path.resolve('uploads', uniqid('product_', '.webp')),
        width: 350,
        height: 350,
        quality: 80,
      })
    ),
  ) as Buffer[]

  return imagesPath.filter(Boolean)
}
