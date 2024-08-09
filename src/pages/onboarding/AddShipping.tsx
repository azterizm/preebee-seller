import Input from '../../components/Input'
import { Logo } from '../../components/Logo'
import cities from '../../constants/cities'
import { BaseHtml } from '../../components/root'

export default function AddShipping() {
  return (
    <BaseHtml>
      <body
        x-data={`{editMode: false}`}
      >
        <div>
          <div class='flex items-center justify-between mb-8'>
            <Logo />
            <h1 class='text-3xl font-bold'>Shipping</h1>
            <a href='/logout' class='btn btn-error'>Logout</a>
          </div>

          <div class='container mx-auto prose'>
            <p>
              Please provide the shipping cost for the following areas. Only the
              following areas are available for customers to purchase from your
              shop. You can add or remove areas as you wish later from your
              profile page. <br />
              <br />Note that regardless of the <b>quantity of items</b>{' '}
              purchased, the{' '}
              <b>
                shipping cost you provide
              </b>{' '}
              will remain the same (ex. for 5 items, one Rs. 100 shipping fee
              where Rs. 100 is the shipping cost you provide). and shipping
              amount you specify will be added to your account.
            </p>
          </div>

          <div class='flex items-center justify-between my-8'>
            <button
              x-on:click='document.getElementById("area_modal").showModal()'
              class='btn btn-secondary flex items-center gap-2'
            >
              <span>Add new area</span>
              <img src='/icons/plus.svg' width={20} />
            </button>
            <form action='/onboarding/submit_shipping' method='post'>
              <button type='submit' class='btn btn-success'>Done</button>
            </form>
          </div>
          <div class='overflow-x-auto w-full'>
            <table class='table'>
              <thead>
                <th>Province</th>
                <th>City</th>
                <th>Cost</th>
                <th></th>
              </thead>
              <tbody>
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
                x-on:click='document.getElementById("area_modal").close()'
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

        <span class='loader htmx-indicator'></span>
      </body>
    </BaseHtml>
  )
}
