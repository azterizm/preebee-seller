import Header from '../components/dashboard/Header'
import Dropdown from '../components/Dropdown'
import RenderSvg from '../components/RenderSvg'
import { BaseHtml } from '../components/root'
import { ordersSortByKeys } from '../constants/api'
export interface OrdersProps {}

export default function Orders(_: OrdersProps) {
  return (
    <BaseHtml
      title='Orders | Preebee Seller Dashboard'
      includeDisableElementExtension
    >
      <body
        x-data="{sortBy: 'recent',search:''}"
        x-init="
        $watch([ 'sortBy', 'search' ],()=>{
          htmx.trigger('#list','inputChange')
        })
        "
      >
        <Header active='orders' />

        <div class='my-4'>
          <div class='flex items-center justify-between gap-4'>
            <Dropdown
              jsVarName='sortBy'
              title='Sort by'
              options={[
                'Recently added',
                'Quantity',
                'Price',
              ].map((r) => <span>{r}</span>)}
              keys={[...ordersSortByKeys]}
            />

            <div class='relative flex items-center mt-2 ml-2 rounded-lg'>
              <span class='absolute'>
                <RenderSvg
                  src='/icons/magnifying-glass.svg'
                  alt='magnifying glass'
                  class='translate-x-2'
                />
              </span>

              <input
                type='text'
                placeholder='Search...'
                class='block w-full py-2.5 text-gray-700 placeholder-muted bg-button border border-gray-200 rounded-lg pl-11 pr-5 rtl:pr-11 rtl:pl-5 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40'
                {...{
                  'x-model.debounce.500ms': 'search',
                }}
              />
            </div>
          </div>

          <div class='my-8 max-w-lg mx-auto'>
            <p>
              Note: Please change delivery status of an order only after
              you&apos;ve shipped the order to the customer. This action is
              irreversible. Bad delivery status may lead to account suspension.
            </p>
          </div>

          <div
            hx-post={`/orders/query`}
            hx-target='this'
            hx-swap='innerHTML'
            hx-trigger='load, inputChange'
            hx-indicator='.loader'
            hx-include='#inputs'
            id='list'
            class='overflow-x-auto'
          />

          <span class='loader htmx-indicator'></span>

          <div id='inputs'>
            <input
              type='hidden'
              name='sortBy'
              x-model='sortBy'
              value='recent'
            />
            <input type='hidden' name='search' x-model='search' value='' />
          </div>
        </div>
      </body>
    </BaseHtml>
  )
}
