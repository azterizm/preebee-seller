import { getAllProductsByUserId } from '../../models/product'
import { DBResult } from '../../types/api'
import { formatCurrency } from '../../utils/ui'
import Button from '../Button'
import RenderProductStatus from '../RenderProductStatus'
import RenderSvg from '../RenderSvg'
interface Props {
  products: DBResult<typeof getAllProductsByUserId>
}
export default function ({ products }: Props) {
  return (
    <table class='table'>
      <thead>
        {[
          'Image',
          'Title',
          'Price',
          'Status',
          'Stocks available',
          'Added at',
          'Actions',
        ].map((r, i) => (
          <th class={i === 0 ? 'px-8' : 'text-center'}>
            {r}
          </th>
        ))}
      </thead>
      <tbody>
        {products.map((r) => (
          <tr class='text-center'>
            <td>
              <img
                src={`/products/main_image/${r.id}`}
                alt='product'
                class='w-24 object-contain aspect-square rounded-lg m-4'
              />
            </td>
            <td class='text-left px-4 text-center'>{r.title}</td>
            <td>
              <span class='whitespace-nowrap'>
                {formatCurrency(r.price)}
              </span>
            </td>
            <td class='text-center'>
              <RenderProductStatus
                status={r.stockAcquired > 0 ? 'Available' : 'EmptyStock'}
              />
            </td>
            <td class='text-center'>{r.stockAcquired}</td>
            <td class='text-center'>
              {new Date(r.createdAt).toLocaleDateString()}
            </td>
            <td>
              <div class='flex items-center gap-2 mr-4 justify-center'>
                <Button
                  href={`/products/update_stocks/${r.id}`}
                  class='bg-green-600 text-green-200 relative py-0 whitespace-nowrap w-max'
                >
                  <RenderSvg
                    src='/icons/inventory.svg'
                    class='w-icon inline -translate-y-0.5 -translate-x-2 fill-green-200'
                    alt='stock'
                  />
                  <span>Update stocks</span>
                </Button>
                <Button
                  href={`/products/info/${r.id}`}
                  class='bg-info text-white whitespace-nowrap w-max'
                >
                  <RenderSvg
                    src='/icons/eye.svg'
                    class='w-icon inline -translate-y-0.5 -translate-x-2 fill-white'
                    alt='eye'
                  />
                  Information
                </Button>
                <Button
                  href={`/products/edit/${r.id}`}
                  class='py-0 whitespace-nowrap bg-tertiary'
                >
                  <RenderSvg
                    src='/icons/edit.svg'
                    class='w-icon inline -translate-y-0.5 -translate-x-2'
                    alt='edit'
                  />
                  Edit
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
