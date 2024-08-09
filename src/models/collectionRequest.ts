import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

export async function createCollectionRequest(
  data: Prisma.CollectionRequestUncheckedCreateInput,
) {
  return prisma.collectionRequest.create({
    data,
  })
}

export async function countActiveCollectionRequestBySellerId(sellerId: string) {
  return prisma.collectionRequest.count({
    where: {
      sellerId,
      status: {
        in: ['Coming', 'Pending'],
      },
    },
  })
}

export async function getActiveCollectionRequestBySellerId(sellerId: string) {
  return prisma.collectionRequest.findFirst({
    where: {
      sellerId,
      status: {
        in: ['Coming', 'Pending'],
      },
    },
  })
}

export async function getAllCollectionRequestBySellerId(sellerId: string) {
  return prisma.collectionRequest.findMany({
    where: {
      sellerId,
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
      reason: true,
      rider: {
        select: {
          name: true,
          phone: true,
        },
      },
      products: {
        select: {
          mainImage: true,
          id: true,
          title: true,
          stockSpecified: true,
        },
      },
      productsCollected: {
        select: {
          productId: true,
          id: true,
          quantity: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
}
