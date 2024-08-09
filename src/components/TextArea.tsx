import _ from 'lodash'

import { combineObjects } from '../utils/ui'

export interface TextAreaProps {
  name: string
  placeholder?: string
  label?: string
  hint?: string
  maxLength?: number | string
  value?:string
}

export default function TextArea(props: TextAreaProps) {
  return (
    <div x-data={`{input:'${props.value||''}'}`} class='relative'>
      <label for={props.name} class='block text-sm text-primary'>
        {props.label || _.capitalize(props.name)}
      </label>

      <textarea
        name={props.name}
        id={props.name}
        placeholder={props.placeholder || ''}
        class='block mt-2 w-full placeholder-primary/50 rounded-lg border border-primary bg-white px-4 h-32 py-2.5 text-primary focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
        {...combineObjects(
          props.maxLength
            ? [
                { 'x-model': 'input' },
                { maxlength: props.maxLength.toString() },
              ]
            : [],
        )}
      />

      {props.hint && <p class='mt-3 text-xs text-primary'>{props.hint}</p>}

      {props.maxLength && (
        <div class='absolute top-0 right-0 text-xs'>
          <p>
            <span x-text={`${props.maxLength}-input.length`}>
              {props.maxLength}
            </span>{' '}
            characters left
          </p>
        </div>
      )}
    </div>
  )
}
