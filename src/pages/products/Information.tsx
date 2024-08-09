import GoBack from '../../components/GoBack'
import PageHeader from '../../components/PageHeading'
import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import { getProductInfoById } from '../../models/product'
import { DBResult } from '../../types/api'
import { getRelativeTime } from '../../utils/date'
import { formatCurrency } from '../../utils/ui'

interface Props {
  product: NonNullable<DBResult<typeof getProductInfoById>>
}
export default function Information(props: Props) {
  return (
    <BaseHtml title='Update Stocks | Preebee Seller Dashboard'>
      <body>
        <Header active='products' />
        <GoBack to='/products' class='mt-8' />
        <PageHeader
          title='Information about your product.'
          titleClass='text-center'
        />
        <div class='grid md:grid-cols-3'>
          <div class='col-span-2'>
          </div>
          <div class='col-span-1'>
            <img
              src={'/products/main_image/' + props.product.id}
              alt={props.product.title}
              class='w-full max-w-md'
            />
            <div class='my-4'>
              <p class='text-xl font-bold'>{props.product.title}</p>
              <p class='text-lg'>
                {formatCurrency(props.product.price)} per item
              </p>
              <p class='text-sm'>
                Selling from {getRelativeTime(props.product.createdAt)}
              </p>
              <p>
                {props.product.stockAcquired}{' '}
                {props.product.stockAcquired === 1 ? 'stock' : 'stocks'}{' '}
                available now
              </p>
            </div>
          </div>
        </div>
      </body>
    </BaseHtml>
  )
}
