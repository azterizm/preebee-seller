import Button from '../../components/Button'
import Dropdown from '../../components/Dropdown'
import RenderSvg from '../../components/RenderSvg'
import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import { productsSortByKeys } from '../../constants/api'
import { combineObjects } from '../../utils/ui'

export interface ProductsProps {
  stock: {
    acquired: number
    specified: number
  }
  riderIsActive?: boolean
  lastRiderCall?: Date
}

export default function Products() {
  return (
    <BaseHtml title='Products | Preebee Seller Dashboard'>
      <body
        x-data="{sortBy: 'recent',search:''}"
        x-init="
        $watch([ 'sortBy', 'search' ],()=>{
          htmx.trigger('#products-list','inputChange')
        })
        "
      >
        <Header active='products' />

        <div class='flex items-center justify-center lg:justify-end gap-2 relative'>
          <Button
            href='/products/add'
            class='bg-secondary my-4 block w-max lg:static right-0 top-[3.5rem]'
          >
            <img
              class='w-icon inline -translate-y-0.5'
              alt='product'
              src='/icons/plus.svg'
            />
            Add new product
          </Button>
        </div>

        <div class='flex items-center w-full justify-between lg:mt-4 gap-4 flex-col sm:flex-row mb-4'>
          <Dropdown
            jsVarName='sortBy'
            title='Sort by'
            options={[
              'Recently Added',
              'Reviews',
              'Stocks acquired',
              'Price',
            ].map((r) => <span>{r}</span>)}
            keys={[...productsSortByKeys]}
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
              {...combineObjects([{
                'x-model.debounce.500ms': 'search',
                value: '',
              }])}
            />
          </div>
        </div>

        <div
          hx-post={`/products/products_list`}
          hx-target='this'
          hx-swap='innerHTML'
          hx-trigger='load,inputChange'
          hx-indicator='.loader'
          hx-include='#inputs'
          id='products-list'
          class='overflow-x-auto'
        />

        <span class='loader htmx-indicator'></span>

        <div id='inputs'>
          <input type='hidden' name='sortBy' x-model='sortBy' value='recent' />
          <input type='hidden' name='search' x-model='search' value='' />
        </div>
      </body>
    </BaseHtml>
  )
}

// const PreebeeProcessingActionButtons = (props:ProductsProps) => {
//   return (
//
//               <div class='flex items-center gap-2 mt-4'>
//                 <Button
//                   href='/products/collection_requests'
//                   class='bg-secondary block w-max space-x-2 relative'
//                 >
//                   <img
//                     class='w-icon inline mr-0.5'
//                     alt='product'
//                     src='/icons/inventory.svg'
//                   />
//                   <span>Collection Requests</span>
//                   <div
//                     hx-get='/alert/collection_request'
//                     hx-trigger='load'
//                     hx-swap='outerHTML'
//                   />
//                 </Button>
//                 <Button
//                   href='/products/call_rider'
//                   class='bg-secondary block w-max space-x-2'
//                   disabled={props.riderIsActive ||
//                     props.stock.specified <= 0}
//                 >
//                   <img
//                     class='w-icon inline mr-0.5'
//                     alt='product'
//                     src='/icons/bike.svg'
//                   />
//                   <span>Call rider</span>
//                 </Button>
//
//                 {props.lastRiderCall
//                   ? (
//                     <div class='md:flex items-center gap-1 hidden'>
//                       <RenderSvg
//                         src='/icons/warning.svg'
//                         width='20'
//                         height='20'
//                         alt='warning'
//                         class='fill-muted'
//                       />
//                       <span class='text-xs text-muted'>
//                         You requested rider{'  '}
//                         {relativeTime.from(props.lastRiderCall)}
//                       </span>
//                     </div>
//                   )
//                   : null}
//               </div>
//   )
// }
