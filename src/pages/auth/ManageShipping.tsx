import { ShippingCosts } from '@prisma/client'
import GoBack from '../../components/GoBack'
import PageHeader from '../../components/PageHeading'
import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import Input from '../../components/Input'
import cities from '../../constants/cities'

export default function Shipping(props: {
  data: ShippingCosts[]
}) {
  return (
    <BaseHtml
      title='Manage Shipping | Preebee Seller Dashboard'
      includeDisableElementExtension
    >
      <body
        x-data={`{editMode: false}`}
      >
        <Header active='account' />
        <GoBack to='/products' class='mt-8' />
        <PageHeader title='Manage Shipping' titleClass='!text-center' />
        <div class='flex flex-col items-start justify-start space-y-4 w-full h-full'>
          <p class='max-w-lg mx-auto block'>
            Only the following areas are available for customers to purchase
            from your shop. You can add or remove areas as you wish. <br />
            <br />Note that regardless of the <b>quantity of items</b>{' '}
            purchased, the{' '}
            <b>
              shipping cost you provide
            </b>{' '}
            will remain the same (ex. for 5 items, one Rs. 100 shipping fee). The shipping
            amount will be added to your account.
          </p>
          <button
            x-on:click='$refs.area_modal.showModal()'
            class='btn inline-block ml-auto flex items-center gap-2'
          >
            <img src='/icons/plus.svg' width={20} />
            <span>Add new area</span>
          </button>
          <div class='overflow-x-auto w-full'>
            <table class='table'>
              <thead>
                <th>Province</th>
                <th>City</th>
                <th>Cost</th>
                <th></th>
              </thead>
              <tbody>
                {props.data.map((r, i) => (
                  <tr id={'row_' + i}>
                    <td>{r.province}</td>
                    <td>{r.city}</td>
                    <td>{r.cost}</td>
                    <td>
                      <button
                        hx-ext='disable-element'
                        hx-disable-element='self'
                        hx-delete={`/account/remove_shipping/${r.id}`}
                        hx-trigger='click'
                        hx-swap='none'
                        {...{
                          'hx-on:htmx:after-request':
                            `document.querySelector("tr#row_${i}")?.remove()`,
                        }}
                        type='button'
                        class='btn btn-primary'
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <dialog x-ref='area_modal' id='area_modal' class='modal'>
          <form
            hx-post='/account/add_new_shipping'
            hx-swap='afterbegin'
            hx-target='tbody'
            class='modal-box'
            hx-ext='disable-element'
            hx-disable-element='.area_submit'
            {...{
              'hx-on:htmx:after-request':
                'document.getElementById("area_modal").close();this.reset();',
            }}
          >
            <h3 class='font-bold text-lg'>Add new area</h3>

            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>Province</span>
              </label>
              <input
                type='text'
                placeholder='Sindh'
                class='input input-bordered bg-white'
                name='province'
              />
            </div>

            <div class='form-control'>
              <label class='label'>
                <span class='label-text'>City</span>
              </label>

              <div class='relative'>
                <input
                  type='text'
                  list='cities_list'
                  id='city'
                  class='w-full rounded-lg py-[0.75rem] border-gray-300 pe-10 text-gray-700 sm:text-sm [&::-webkit-calendar-picker-indicator]:opacity-0'
                  placeholder='Please select'
                  name='city'
                />

                <span class='absolute inset-y-0 end-0 flex w-8 items-center'>
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke-width='1.5'
                    stroke='currentColor'
                    class='h-5 w-5 text-gray-500'
                  >
                    <path
                      stroke-linecap='round'
                      stroke-linejoin='round'
                      d='M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9'
                    />
                  </svg>
                </span>

                <datalist
                  {...{
                    name: 'city',
                    id: 'cities_list',
                  }}
                >
                  {cities.map((c) => <option value={c} />)}
                </datalist>
              </div>
            </div>

            <div class='form-control mt-2'>
              <Input
                labelClass='!translate-x-2'
                required
                name='cost'
                type='price'
                min='50'
                max='50000'
                unitClass='!bg-yellow-200'
              />
            </div>
            <div class='modal-action'>
              <button
                type='button'
                x-on:click='$refs.area_modal.close()'
                class='btn area_submit'
              >
                Close
              </button>
              <button class='btn btn-primary area_submit'>
                Submit
              </button>
            </div>
          </form>
        </dialog>
      </body>
    </BaseHtml>
  )
}
