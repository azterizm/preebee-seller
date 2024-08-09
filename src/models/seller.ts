import { Prisma } from '@prisma/client'
import { prisma } from '../config/db'

export function createSeller(data: Prisma.SellerCreateInput) {
  return prisma.seller.create({
    data,
    select: {
      id: true,
      name: true,
      profile: { select: { imageURL: true } },
    },
  })
}

export function getSellerByIdForAuth(id: string) {
  return prisma.seller.findFirst({
    where: { providerId: id },
    select: {
      id: true,
      name: true,
      profile: { select: { imageURL: true } },
      status: true,
    },
  })
}

export function getSellerById(id: string, select?: Prisma.SellerSelect) {
  return prisma.seller.findFirst({
    where: { id },
    select,
  })
}

export function updateSellerById(id: string, data: Prisma.SellerUpdateInput) {
  return prisma.seller.update({ where: { id }, data })
}
