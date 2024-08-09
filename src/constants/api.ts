import _ from 'lodash'

export const minimumWithdrawAmount = 1000
export const commissionRate = 0.015
export const pageNames = ['home', 'products', 'orders', 'withdraw'] as const
export const categories = ['makeup', 'skin_care', 'hair_care'] as const
export const categoriesLabel = _.zipObject(
  categories,
  [
    'Makeup',
    'Skin care',
    'Hair care',
  ] as const,
)
export const makeupCategories = [
  'Foundation & Primer',
  'Concealer & Color Correctors',
  'Blush & Bronzer',
  'Eyeshadow & Eyeliner',
  'Mascara & Lashes',
  'Lipstick & Lip Gloss',
  'Makeup Brushes & Tools',
  'Setting Spray & Fixatives',
  'Makeup Kits & Palettes',
  'Makeup Removers',
] as const
export const skinCareCategories = [
  'Cleansers & Face Wash',
  'Moisturizers & Creams',
  'Serums & Treatments',
  'Sunscreen & SPF',
  'Face Masks & Peels',
  'Eye Creams & Treatments',
  'Toners & Essences',
  'Acne & Blemish Treatments',
  'Anti-Aging & Wrinkle Creams',
  'Lip Care & Balms',
] as const
export const hairCareCategories = [
  'Shampoo & Conditioner',
  'Hair Masks & Treatments',
  'Hair Styling Products',
  'Hair Oils & Serums',
  'Hair Color & Dye',
  'Hair Brushes & Combs',
  'Hair Accessories',
  'Scalp Treatments',
  'Hair Growth & Repair',
  'Hair Tools & Appliances',
] as const
export enum productStatusEnum {
  Empty_Stock = 'Empty stock. Call rider to pickup new stock.',
  Rider_Visiting = 'Rider is approaching to pick new stock.',
  Available = 'Available to buy.',
}

export const productsSortByKeys = [
  'recent',
  'review',
  'stocks_acquired',
  'price',
] as const

export const ordersSortByKeys = [
  'recent',
  'quantity',
  'price',
] as const
