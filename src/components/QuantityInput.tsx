import { cn } from '../utils/ui'

export interface QuantityInputProps {
  removeData?: boolean
  class?: string
  name?: string
  value?: number
}

export default function QuantityInput(props: QuantityInputProps) {
  return (
    <div
      class={cn('flex items-center gap-2', props.class)}
      x-data={props.removeData ? '' : `{quantity: ${props.value || 1}}`}
      x-init="$watch('quantity', (value) => quantity = value < 1 ? 1 : value > 99 ? 99 : value)"
    >
      <button
        type='button'
        class='cursor-pointer bg-button rounded-full select-none w-10 h-10 text-center flex items-center justify-center'
        x-on:click='quantity-=1'
      >
        <img src='/icons/minus.svg' alt='Minus' class='w-icon' />
      </button>
      <input
        type='number'
        name={props.name || 'quantity'}
        id='quantity'
        class='text-lg font-semibold p-2 rounded-lg w-10 text-center bg-transparent'
        x-model='quantity'
      />

      <button
        type='button'
        class='cursor-pointer bg-button rounded-full select-none w-10 h-10 text-center flex items-center justify-center'
        x-on:click='quantity+=1'
      >
        <img src='/icons/plus.svg' alt='Plus' class='w-icon' />
      </button>
    </div>
  )
}
