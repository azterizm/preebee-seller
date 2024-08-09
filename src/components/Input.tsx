import _ from 'lodash'

import { combineObjects } from '../utils/ui'
import { twMerge } from 'tailwind-merge'

export interface InputProps {
  name: string
  type?: string
  placeholder?: string
  label?: string
  hint?: string
  defaultValue?: string
  required?: boolean
  min?: number | string
  max?: number | string
  unitClass?: string
  labelClass?: string
}

export default function Input(props: InputProps) {
  return (
    <div
      {...combineObjects(
        props.type === 'price'
          ? [{ 'x-data': `{input:'${props.defaultValue || ''}'}` }]
          : [],
      )}
    >
      <label
        for={props.name}
        class={twMerge('block text-sm text-primary', props.labelClass)}
      >
        {props.label || _.capitalize(props.name)}
      </label>

      {props.type === 'price'
        ? (
          <div class='flex items-center relative'>
            <p
              class={twMerge(
                'py-2.5 translate-y-1 px-3 text-primary bg-yellow-100 border border-r-0 rtl:rounded-r-lg rtl:rounded-l-none rtl:border-l-0 rtl:border-r rounded-l-lg',
                props.unitClass,
              )}
            >
              Rs.
            </p>
            <input
              type={props.type || 'text'}
              class='mt-2 block w-full placeholder-primary/50 rounded-lg rounded-l-none border-l-0 border border-primary bg-white px-5 py-2.5 text-primary focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
              placeholder='0'
              name={props.name}
              value={props.defaultValue || '0'}
              id={props.name}
              {...combineObjects([
                { 'x-mask:dynamic': `$money($input, '.', ',', 0)` },
                { 'x-model': `input` },
                props.required ? 'required' : '',
              ])}
            />
            {props.min || props.max
              ? (
                <div class='absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none opacity-0'>
                  <input
                    type='number'
                    id={`min_price_${props.name}`}
                    name={`min_price_${props.name}`}
                    min={props.min?.toString()}
                    max={props.max?.toString()}
                    x-bind:value={`Number(input.replace(/,/g, ''))`}
                  />
                </div>
              )
              : null}
          </div>
        )
        : (
          <input
            {...combineObjects(props.required ? ['required'] : [])}
            type={props.type || 'text'}
            value={props.defaultValue || ''}
            class='mt-2 block w-full placeholder-primary/50 rounded-lg border border-primary bg-white px-5 py-2.5 text-primary focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
            placeholder={props.placeholder || ''}
            name={props.name}
            id={props.name}
            min={props.min?.toString() || ''}
            max={props.max?.toString() || ''}
            maxlength={props.max?.toString() || ''}
            {...combineObjects([{ minlength: props.min?.toString() || '' }])}
          />
        )}

      {props.hint
        ? <p class='mt-3 text-xs text-primary'>{props.hint}</p>
        : null}
    </div>
  )
}
