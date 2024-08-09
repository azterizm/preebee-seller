import { WithdrawRequest } from '@prisma/client'
interface Props {
  requests: WithdrawRequest[]
}
export default function ({ requests }: Props) {
  return (
    <table class='table'>
      <thead>
        <th>Status</th>
        <th>Payment Method</th>
        <th>Created At</th>
        <th>Reason</th>
        <th></th>
      </thead>
      <tbody>
        {requests.map((r) => (
          <tr>
            <td>{r.status}</td>
            <td>
              {r.paymentMethod === 'BankAccount'
                ? 'Bank Transfer'
                : r.paymentMethod}
            </td>
            <td>{new Date(r.createdAt).toLocaleDateString()}</td>
            <td>{r.reason}</td>
            <td>
              {r.status === 'Pending'
                ? (
                  <form
                    hx-delete={`/withdraw/delete/${r.id}`}
                    hx-ext='disable-element'
                    hx-disable-element='#cancel_request'
                    hx-swap='none'
                    {...{
                      'hx-on:htmx:after-request':
                        'htmx.trigger("#form", "withdrawal_requests_changed");htmx.trigger("#list", "withdrawal_requests_changed");',
                    }}
                  >
                    <button id='cancel_request' class='btn btn-error'>
                      Cancel
                    </button>
                  </form>
                )
                : null}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
