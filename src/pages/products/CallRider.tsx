import GoBack from '../../components/GoBack'
import RenderSvg from '../../components/RenderSvg'
import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import { getAllUnstockedProductsByUserId } from '../../models/product'
import { DBResult } from '../../types/api'
import { formatCurrency } from '../../utils/ui'

export interface ProductsProps {
  data: DBResult<typeof getAllUnstockedProductsByUserId>
  address: string
}

export default function CallRider(props: ProductsProps) {
  const list = props.data.map((r) => r.stockSpecified).join(',')
  return (
    <BaseHtml title='Call Rider | Preebee Seller Dashboard'>
      <body>
        <form
          x-data={`{stock:[${list}], max:[${list}], items_amount:['${
            props.data.map((r) => r.price).join('\',\'')
          }'], error: new URLSearchParams(window.location.search).get('error')}`}
          method='post'
          action='/products/call_rider'
        >
          <Header active='products' />
          <GoBack to='/products' class='mt-8' />
          <div class='my-8 max-w-lg mx-auto'>
            <p
              class='text-center mb-8 text-error'
              x-text="'Error: ' + error"
              x-show='error'
            >
              Error:
            </p>
            <h1 class='text-3xl font-bold text-left'>Call Rider</h1>
            <p class='mt-2'>
              Transfer your items into{' '}
              <span class='font-medium text-primary'>Preebee</span>{' '}
              warehouse. Our Rider will visit your given address to pick up the
              following items. Once your items are available to us, customers
              can easily order them.
            </p>
          </div>

          <div class='overflow-x-auto'>
            <table class='table'>
              <thead>
                <tr>
                  <th></th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>To pickup</th>
                </tr>
              </thead>
              <tbody>
                {props.data.map((r, i) => (
                  <tr x-data='{}'>
                    <td>{i + 1}</td>
                    <td safe>{r.title}</td>
                    <td safe>{formatCurrency(r.price || 0)}</td>
                    <td class='flex items-center gap-4'>
                      <span x-text={`stock[${i}]`}></span>{' '}
                      <div class='flex items-center gap-2'>
                        <button
                          type='button'
                          x-on:click={`stock[${i}]=stock[${i}]>=max[${i}]||stock[${i}]==max[${i}]?stock[${i}]:stock[${i}]+1`}
                          class='btn btn-primary'
                        >
                          +
                        </button>
                        <button
                          type='button'
                          x-on:click={`stock[${i}]=stock[${i}]<=0?0:stock[${i}]-1`}
                          class='btn btn-primary'
                        >
                          -
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                <tr>
                  <td></td>
                  <td></td>
                  <td>
                    <span x-text='"Rs. " + stock.reduce((a,b,i)=>a+b*items_amount[i],0)' />
                  </td>
                  <td>
                    <span class='font-semibold'>Total items:{' '}</span>
                    <span x-text='stock.reduce((a,b)=>a+b,0)' />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class='my-8 max-w-md'>
            <div class='flex items-center gap-4'>
              <div>
                <p class='text-xl font-bold'>Your address</p>
                <p safe>{props.address}</p>
              </div>
              <a href='/account?edit=1' class='btn btn-secondary mt-4'>
                Edit profile
              </a>
            </div>
            <div class='join text-warning flex items-center gap-2 mt-4'>
              <RenderSvg src='/icons/warning.svg' class='fill-warning' />
              <span>
                Rider will visit this address to collect items shown in the list
                above.
              </span>
            </div>
            <button type='submit' class='mt-8 btn btn-primary block'>
              Continue
            </button>
            <p
              class='mt-4 text-error'
              x-text="'Error from previous submission: ' + error"
              x-show='error'
            >
              Error:
            </p>
            <template x-for='(item, index) in stock'>
              <input
                type='hidden'
                x-bind:name="'item[' +index+']'"
                x-bind:value='item'
              />
            </template>
            <input
              type='hidden'
              name='items_id'
              value={props.data.map((r) => r.id).join(',')}
            />
          </div>
        </form>
      </body>
    </BaseHtml>
  )
}
