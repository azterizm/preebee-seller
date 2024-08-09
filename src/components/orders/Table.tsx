import { PackageStatus } from '@prisma/client'
import { getProductsOrdered } from '../../models/product'
import { DBResult } from '../../types/api'
import { combineObjects, formatCurrency } from '../../utils/ui'

export default function OrdersTable(props: {
  orders: DBResult<typeof getProductsOrdered>
}) {
  return (
    <div
      class='overflow-x-auto mt-4'
      x-data='{
      action: null,
      actionOnItemId: null,
      }'
    >
      <table class='table'>
        <thead>
          <tr>
            <th>Image</th>
            <th>Title</th>
            <th>Quantity</th>
            <th>Total Amount</th>
            <th>Customer</th>
            <th>Ordered on</th>
            <th>Delivery Status</th>
          </tr>
        </thead>
        <tbody>
          {props.orders.map((order) => (
            <tr>
              <td>
                <img
                  class='w-20 rounded-lg'
                  src={`/products/main_image/${order.product.id}`}
                />
              </td>
              <td class='whitespace-nowrap'>
                <a
                  class='hover:underline'
                  href={`/products/${order.product.id}`}
                >
                  {order.product.title}
                </a>
              </td>
              <td>{order.quantity}</td>
              <td class='whitespace-nowrap'>
                {formatCurrency(order.amount)}
              </td>
              <td>
                <p>{order.order.user?.name}</p>
                <p>{order.order.user?.email}</p>
                <p>{order.order.user?.phone}</p>
                <p class='capitalize'>
                  {order.order.user?.province} {order.order.user?.city}
                </p>
                <p>{order.order.user?.address}</p>
              </td>
              <td>
                {new Date(order.order.createdAt).toLocaleDateString()}
              </td>
              <td>
                <select
                  name='package_status'
                  id={`package_status_${order.id}`}
                  class='select bg-secondary'
                  data-value={order.packageStatus}
                  disabled={order.packageStatus === PackageStatus.Done ||
                    order.packageStatus === PackageStatus.Failed}
                  x-on:change={`action = $event.target.value; actionOnItemId = '${order.id}'; $nextTick(() => $refs.delivery_action.showModal());`}
                >
                  {Object.keys(PackageStatus).map((s) => (
                    <option
                      value={s}
                      {...combineObjects(
                        [
                          order.packageStatus === s ? 'selected' : '',
                        ],
                      )}
                    >
                      {s}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <dialog x-ref='delivery_action' id='delivery_action_modal' class='modal'>
        <div class='modal-box'>
          <p class='py-4'>
            Are you sure you want to change the delivery status of this order to
            {' '}
            <span class='font-bold' x-text='action' />?
          </p>
          <div class='form-control' x-show='action == "Failed"' x-cloak>
            <label for='reason' class='label'>
              <span class='label-text'>Reason</span>
            </label>
            <textarea
              form='delivery_action_form'
              name='reason'
              id='reason'
              rows='4'
              class='textarea w-full bg-white'
            />
          </div>
          <form
            id='delivery_action_form'
            hx-post='/orders/delivery_action'
            class='modal-action'
            x-bind:hx-target='`#package_status_${actionOnItemId}`'
            hx-swap='outerHTML'
            hx-indicator='.loader'
            hx-ext='disable-element'
            hx-disable-element='.delivery_action_btn'
            {...{
              'hx-on:htmx:after-request':
                'document.getElementById("delivery_action_modal").close();htmx.trigger("#balance", "balance_changed");',
            }}
          >
            <div class='join space-x-4'>
              <button
                type='button'
                x-on:click='$refs.delivery_action.close(); action = null; document.getElementById("package_status_" + actionOnItemId).value = document.getElementById("package_status_" + actionOnItemId).getAttribute(`data-value`); actionOnItemId = null;'
                class='btn delivery_action_btn'
              >
                No
              </button>
              <button
                type='submit'
                name='delivery_action'
                x-bind:value='action+":"+actionOnItemId'
                class='btn btn-primary delivery_action_btn'
              >
                Yes
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  )
}
