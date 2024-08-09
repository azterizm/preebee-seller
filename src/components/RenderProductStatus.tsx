import { ProductStatus } from '@prisma/client'
import { cn } from '../utils/ui'
import RenderSvg from './RenderSvg'

interface Props {
  status: ProductStatus
}
export default function RenderProductStatus(props: Props) {
  return (
    <div
      class='flex items-center flex-col justify-center text-center tooltip'
      data-tip={[
        'No stock available. Please add stocks and call rider for pickup.',
        'Rider is coming to pickup your product.',
        'Product is available for sale.',
      ][Object.keys(ProductStatus).indexOf(props.status)]}
    >
      <RenderSvg
        src={`/icons/${
          [
            'warning',
            'bike',
            'check',
          ][Object.keys(ProductStatus).indexOf(props.status)]
        }.svg`}
        class={cn(
          ['fill-red-600', 'fill-blue-600', 'fill-green-600'][
            Object.keys(ProductStatus).indexOf(props.status)
          ],
        )}
        alt={props.status}
      />
      <span class='mx-4 block whitespace-nowrap'>
        {[
          'Empty Stock',
          'Rider is coming to pickup',
          'Available',
        ][Object.keys(ProductStatus).indexOf(props.status)]}
      </span>
    </div>
  )
}
