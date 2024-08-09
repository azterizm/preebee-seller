import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import { formatCurrency } from '../../utils/ui'
export interface WithdrawProps {
  balance: number
}

export default function Withdraw(props: WithdrawProps) {
  return (
    <BaseHtml
      title='Withdraw | Preebee Seller Dashboard'
      includeDisableElementExtension
    >
      <body x-data='{method: null}'>
        <Header active='withdraw' />
        <div class='my-8'>
          <div>
            <h1 class='text-xl font-medium'>You currently have:</h1>
            <p class='text-3xl font-bold'>
              {formatCurrency(props.balance)}
            </p>
          </div>

          <div
            hx-get='/withdraw/form'
            hx-target='this'
            hx-swap='innerHTML'
            hx-trigger='load, withdrawal_requests_changed'
            hx-indicator='.loader'
            id='form'
          />
        </div>
        <div class='my-8'>
          <div
            hx-get='/withdraw/history'
            hx-target='this'
            hx-swap='innerHTML'
            hx-trigger='load, withdrawal_requests_changed'
            hx-indicator='.loader'
            id='list'
            class='overflow-x-auto'
          />
          <span class='loader htmx-indicator'></span>
        </div>
      </body>
    </BaseHtml>
  )
}
