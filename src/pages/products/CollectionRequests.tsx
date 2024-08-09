import { PackageStatus } from '@prisma/client'
import GoBack from '../../components/GoBack'
import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import { getAllCollectionRequestBySellerId } from '../../models/collectionRequest'
import { DBResult } from '../../types/api'
import { cn } from '../../utils/ui'

interface Props {
  data: DBResult<typeof getAllCollectionRequestBySellerId>
}
export default function CollectionRequests(props: Props) {
  return (
    <BaseHtml title='Collection Requests | Preebee Seller Dashboard'>
      <body>
        <Header active='products' />
        <GoBack to='/products' class='mt-8' />

        <div
          class='my-8 max-w-lg mx-auto'
          x-data="{error: new URLSearchParams(window.location.search).get('error')}"
        >
          <p
            class='text-center mb-8 text-error'
            x-text="'Error: ' + error"
            x-show='error'
          >
            Error:
          </p>
          <h1 class='text-3xl font-bold'>Collection Requests</h1>
          <p class='mt-2'>
            These are the collection requests of items you want to sell on
            Preebee. Our Rider visits your location to collect the items and
            keep them in our warehouse. When a customer orders your product, we
            deliver it to them.
          </p>
        </div>

        {!props.data.length
          ? (
            <p class='text-center text-muted mt-16 text-lg font-medium'>
              No data.
            </p>
          )
          : (
            <div class='overflow-x-auto my-8'>
              <table class='table'>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Status</th>
                    <th>Requested at</th>
                    <th>Rider</th>
                    <th>Products collected</th>
                  </tr>
                </thead>
                <tbody>
                  {props.data.map((r, i) => (
                    <tr>
                      <td>{i + 1}</td>
                      <td
                        class={cn(
                          'capitalize',
                          [
                            'text-green-600',
                            'text-muted',
                            'text-blue-600',
                            'text-red-600',
                          ][
                            Object.keys(PackageStatus).indexOf(r.status)
                          ],
                        )}
                      >
                        {r.status}
                        {r.status === 'Failed' && r.reason
                          ? (
                            <p class='text-sm text-muted normal-case'>
                              {r.reason}
                            </p>
                          )
                          : ''}
                      </td>
                      <td>{new Date(r.createdAt).toLocaleString()}</td>
                      <td>
                        {!r.rider ? 'Not assigned' : (
                          <div>
                            <p>{r.rider.name}</p>
                            <p>0{r.rider.phone}</p>
                          </div>
                        )}
                      </td>
                      <td class='flex items-center gap-4 flex-wrap'>
                        {r.products.map((p) => {
                          const productsCollected = r.productsCollected.find((
                            r,
                          ) => r.productId === p.id)
                          return (
                            <a
                              href={'/products/info/' + p.id}
                              class='bg-primary/20 p-4 rounded-lg text-center relative'
                            >
                              <img
                                src={'/products/main_image/' + p.id}
                                alt='product'
                                class='w-24 object-contain aspect-square rounded-lg m-4'
                              />
                              <p>{p.title}</p>
                              <div class='absolute -top-2 -right-2'>
                                <span class='text-lg font-medium text-primary'>
                                  x{productsCollected?.quantity ||
                                    p.stockSpecified}
                                </span>
                              </div>
                            </a>
                          )
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </body>
    </BaseHtml>
  )
}
