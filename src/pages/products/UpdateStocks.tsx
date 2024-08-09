import GoBack from '../../components/GoBack'
import PageHeader from '../../components/PageHeading'
import QuantityInput from '../../components/QuantityInput'
import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import { getProductById } from '../../models/product'
import { DBResult } from '../../types/api'

interface Props {
  product: NonNullable<DBResult<typeof getProductById>>
}
export default function UpdateStocks(props: Props) {
  return (
    <BaseHtml title='Update Stocks | Preebee Seller Dashboard'>
      <body>
        <Header active='products' />
        <GoBack to='/products' class='mt-8' />
        <PageHeader titleClass='!text-center' title='Update your stocks' />
        <div class='grid md:grid-cols-2'>
          <div class='flex items-center justify-center flex-col'>
            <img
              src={`/products/main_image/${props.product.id}`}
              alt={props.product.title}
              class='w-full max-w-md rounded-lg object-center object-contain'
            />
            <div class='my-8'>
              <p class='text-xl font-bold'>{props.product.title}</p>
            </div>
          </div>
          <div class='flex items-center justify-center flex-col'>
            <div class='flex items-center gap-4'>
              <div
                class='tooltip'
                data-tip='Stocks specified by you'
              >
                <div class='stat'>
                  <div class='stat-title'>Available</div>
                  <div class='stat-value'>{props.product.stockAcquired}</div>
                </div>
              </div>
            </div>
            <form method='post' action='/products/update_stocks'>
              <div class='form-control'>
                <label class='label'>
                  <span class='label-text'>
                    Change the number of stocks
                  </span>
                </label>

                <QuantityInput
                  value={props.product.stockAcquired}
                  class='flex-reverse justify-center'
                />

                <button class='btn btn-primary mt-4'>
                  Update Stocks
                </button>
              </div>
              <input type='hidden' name='product_id' value={props.product.id} />
            </form>
          </div>
        </div>
      </body>
    </BaseHtml>
  )
}
