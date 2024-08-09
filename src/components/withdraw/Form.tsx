import { BankAccount, EasyPaisa, JazzCash } from '@prisma/client'

export default function (props: {
  data: {
    jazzCash: JazzCash | null
    easyPaisa: EasyPaisa | null
    bankAccount: BankAccount | null
  }
}) {
  return (
    <form
      hx-post='/withdraw/add'
      hx-target='this'
      hx-swap='innerHTML'
      hx-indicator='.loader'
      hx-ext='disable-element'
      hx-disable-element='#submit_btn'
      {...{
        'hx-on:htmx:after-request':
          'htmx.trigger("#balance", "balance_changed");htmx.trigger("#list", "withdrawal_requests_changed");',
      }}
      class='my-8 space-y-2'
    >
      <input type='hidden' name='method' x-model='method' />

      <p>Proceed by selecting your withdrawal method.</p>
      <div class='flex items-center gap-2'>
        {['JazzCash', 'EasyPaisa', 'Bank Transfer'].map((r, i) => (
          <button
            type='button'
            x-bind:class={`{'btn-primary': method === ${i}}`}
            class='btn'
            x-on:click={`method===${i} ? method=null : method=${i}`}
          >
            {r}
          </button>
        ))}
      </div>
      <div
        class='form-control max-w-lg'
        x-show='method===0'
        x-cloak
        x-transition
      >
        <label class='label'>
          <span class='label-text'>Enter your JazzCash number</span>
        </label>{' '}
        <input
          x-bind:required='method===0'
          type='text'
          placeholder='Mobile number'
          class='input input-bordered'
          name='jazzcash'
          value={props.data.jazzCash?.number || '03'}
          x-mask='0399 9999999'
        />
      </div>
      <div
        class='form-control max-w-lg'
        x-show='method===1'
        x-cloak
        x-transition
      >
        <label class='label'>
          <span class='label-text'>Enter your EasyPaisa number</span>
        </label>{' '}
        <input
          x-bind:required='method===1'
          type='text'
          placeholder='Mobile number'
          class='input input-bordered'
          name='easypaisa'
          value={props.data.easyPaisa?.number || '03'}
          x-mask='0399 9999999'
        />
      </div>
      <div
        class='max-w-lg space-y-4'
        x-show='method===2'
        x-cloak
        x-transition
      >
        <div class='form-control'>
          <label class='label'>
            <span class='label-text'>
              Enter your Bank Account number or IBAN
            </span>
          </label>

          <input
            x-bind:required='method===2'
            type='text'
            placeholder='Bank Account number or IBAN'
            class='input input-bordered'
            name='bank_account'
            value={props.data.bankAccount?.number || ''}
          />
        </div>
        <div class='form-control max-w-xs'>
          <div class='label'>
            <span class='label-text'>Select input type</span>
          </div>
          <label class='cursor-pointer label !bg-tint px-5 rounded-lg mb-2'>
            <span class='label-text ml-2'>Account Number</span>
            <input
              x-bind:required='method===2'
              type='radio'
              name='input_type'
              value='account_number'
              class='radio'
              checked={props.data.bankAccount?.numberType === 'AccountNumber'}
            />
          </label>
          <label class='cursor-pointer label !bg-tint px-5 rounded-lg mb-2'>
            <span class='label-text ml-2'>IBAN</span>
            <input
              x-bind:required='method===2'
              type='radio'
              name='input_type'
              value='iban'
              class='radio'
              checked={props.data.bankAccount?.numberType === 'IBAN'}
            />
          </label>
        </div>
        <div class='form-control'>
          <label class='label'>
            <span class='label-text'>Enter your Bank Name</span>
          </label>
          <input
            x-bind:required='method===2'
            type='text'
            placeholder='Bank Name'
            class='input input-bordered'
            name='bank_name'
            value={props.data.bankAccount?.bankName || ''}
          />
        </div>
        <div class='form-control'>
          <label class='label'>
            <span class='label-text'>
              Enter your name (according to bank account)
            </span>
          </label>
          <input
            x-bind:required='method===2'
            type='text'
            placeholder='Name'
            class='input input-bordered'
            name='name'
            value={props.data.bankAccount?.name || ''}
          />
        </div>
        <div class='form-control'>
          <label class='label'>
            <span class='label-text'>Enter your email</span>
          </label>
          <input
            x-bind:required='method===2'
            type='email'
            placeholder='Email'
            class='input input-bordered'
            name='email'
            value={props.data.bankAccount?.email || ''}
          />
        </div>
        <div class='form-control'>
          <label class='label'>
            <span class='label-text'>
              Enter your phone number
            </span>
          </label>
          <input
            x-bind:required='method===2'
            type='text'
            placeholder='Phone number'
            class='input input-bordered'
            name='phone'
            x-mask='0399 9999999'
            value={props.data.bankAccount?.phone || '03'}
          />
        </div>
      </div>

      <button
        x-show='method!==null'
        x-transition
        x-cloak
        class='btn btn-secondary'
        id='submit_btn'
      >
        Submit
      </button>
      <span class='loader htmx-indicator'></span>
    </form>
  )
}
