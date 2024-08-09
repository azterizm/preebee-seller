import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

export async function createProduct(
  data:
    & Prisma.ProductUncheckedCreateInput
    & { images: Buffer[]; mainImage: Buffer },
) {
  return prisma.product.create({
    data: {
      ...data,
      images: { create: data.images.map((image) => ({ data: image })) },
      sellerId: data.sellerId,
    },
  })
}

export function getAllProductsByUserId(
  options: {
    sellerId: string
    moreWhere?: Prisma.ProductWhereInput
    skip?: number
    take?: number
    orderBy?: Prisma.ProductOrderByWithRelationInput
  },
) {
  return prisma.product.findMany({
    where: { sellerId: options.sellerId, ...options.moreWhere },
    orderBy: options.orderBy ||
      { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      price: true,
      stockAcquired: true,
      createdAt: true,
    },
    skip: options.skip,
    take: options.take,
  })
}

export function countAllProductsByUserId(
  sellerId: string,
  moreWhere?: Prisma.ProductWhereInput,
) {
  return prisma.product.count({ where: { sellerId, ...moreWhere } })
}

export function getAllUnstockedProductsByUserId(sellerId: string) {
  return prisma.product.findMany({
    where: { sellerId, stockSpecified: { gt: 0 } },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      price: true,
      stockSpecified: true,
    },
  })
}

export function deleteProductById(id: string, sellerId: string) {
  return prisma.product.deleteMany({
    where: {
      id,
      sellerId,
    },
  })
}

export function updateProductById(
  id: string,
  sellerId: string,
  data: Prisma.ProductUncheckedUpdateInput,
  images?: {
    deletedImagesId?: string[]
    newImages?: Buffer[]
    mainImage?: Buffer
  },
) {
  return prisma.product.update({
    where: {
      id,
      sellerId,
    },
    data: {
      ...data,
      images: {
        delete: images?.deletedImagesId?.filter(Boolean).map((r) => ({
          id: r,
        })),
        create: images?.newImages?.filter(Boolean).map((image) => ({
          data: image,
        })),
      },
      mainImage: images?.mainImage,
    },
  })
}

export function deleteProductImageById(
  id: string,
  productId: string,
  sellerId: string,
) {
  return prisma.productImage.delete({
    where: { id, product: { id: productId, sellerId } },
  })
}

export function getProductImageById(id: string, productId: string) {
  return prisma.productImage.findFirst({
    where: { id, productId },
    select: { data: true },
  })
}

export function getProductMainImageById(id: string, sellerId: string) {
  return prisma.product.findFirst({
    where: { id, sellerId },
    select: { mainImage: true },
  })
}

export function getProductById(
  id: string,
  sellerId: string,
  select?: Prisma.ProductSelect,
) {
  return prisma.product.findFirst({ where: { id, sellerId }, select })
}

export function getProductInfoById(id: string, sellerId: string) {
  return prisma.product.findFirst({
    where: { id, sellerId },
    select: {
      id: true,
      title: true,
      stockAcquired: true,
      createdAt: true,
      price: true,
    },
  })
}

export function countProductById(id: string, sellerId: string) {
  return prisma.product.count({ where: { id, sellerId } })
}

export function getProductImagesIdById(id: string) {
  return prisma.product.findFirst({
    where: { id },
    select: { images: { select: { id: true } } },
  })
}

export function getRecentProductsOrdered(
  userId: string,
  orderBy: Prisma.ProductOrderedOrderByWithRelationInput = {
    createdAt: 'desc',
  },
) {
  return prisma.productOrdered.findMany({
    where: {
      product: {
        sellerId: userId,
      },
      packageStatus: 'Done',
      order: { paymentStatus: 'Done' },
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
    orderBy,
  })
}

export function getProductsOrdered(
  userId: string,
  search: string,
  sortBy: string,
) {
  return prisma.productOrdered.findMany({
    where: {
      product: {
        sellerId: userId,
        title: {
          contains: search,
        },
      },
    },
    select: {
      product: {
        select: {
          id: true,
          title: true,
          price: true,
        },
      },
      order: {
        select: {
          id: true,
          createdAt: true,
          user: {
            select: {
              name: true,
              email: true,
              address: true,
              phone: true,
              province: true,
              city: true,
            },
            where: { blocked: false },
          },
          reason: true,
        },
      },
      quantity: true,
      packageStatus: true,
      id: true,
      amount: true,
    },
    orderBy: sortBy === 'price'
      ? { product: { price: 'asc' } }
      : sortBy === 'recent'
      ? { createdAt: 'desc' }
      : sortBy === 'quantity'
      ? { quantity: 'desc' }
      : { createdAt: 'desc' },
  })
}
