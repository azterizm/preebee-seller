import { getRecentProductsOrdered } from '../../models/product'
import { DBResult } from '../../types/api'
import { formatCurrency } from '../../utils/ui'

export default function Table(
  props: { data: DBResult<typeof getRecentProductsOrdered> },
) {
  return (
    <div class='overflow-x-auto mt-4'>
      <table class='table'>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Quantity</th>
            <th>Ordered on</th>
          </tr>
        </thead>
        <tbody>
          {props.data.map((r) => (
            <tr>
              <td>
                <img
                  src={'/products/main_image/' + r.product.id}
                  class='w-12'
                />
              </td>
              <td>
                <a href={'/products/' + r.product.id}>{r.product.title}</a>
              </td>
              <td>
                <div
                  class='tooltip flex items-center w-max'
                  data-tip={'Website cost: ' +
                    formatCurrency(r.commissionTaken)}
                >
                  {formatCurrency(r.amount)}
                  <img src='/icons/info.svg' class='w-4 ml-2' />
                </div>
              </td>
              <td>
                {r.quantity}
              </td>
              <td>
                {new Date(r.createdAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
