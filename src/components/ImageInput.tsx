import _ from 'lodash'

import { cn, combineObjects } from '../utils/ui'

export interface ImageInputProps {
  name: string
  availableImageUrls?: { url: string; id?: string }[]
  label?: string
  canDelete?: boolean
  accept?: string
  multiple?: boolean
  containerLabel?: string
  required?: boolean
  min?: number | string
  max?: number | string
  containerClass?: string
  inputClass?: string
}

export default function ImageInput(props: ImageInputProps) {
  const inputMessage = props.availableImageUrls?.length
    ? `Click here or drag & drop your ${props.multiple ? 'files' : 'file'} to ${
      props.multiple ? 'add more images' : 'to change this image'
    }.`
    : `Click here to change or darg & drop your ${
      props.multiple ? 'files' : 'file'
    }.`
  return (
    <div
      x-data={`{${props.name}_files: [], deleteImagesId: []}`}
      class={cn('relative', props.containerClass)}
    >
      <label for='file' class='block text-sm text-primary text-center'>
        {props.label || _.capitalize(props.name)}
      </label>

      <div
        class={cn(
          'grid gap-2 mt-2 mt-4 mx-auto',
          props.multiple ? 'grid-cols-3' : 'justify-center items-center',
        )}
        style='width:fit-content;'
        x-show={!props.multiple ? `!${props.name}_files.length` : 'true'}
      >
        {props.availableImageUrls
          ?.map((imageUrl) => (
            <div
              class='relative'
              x-show={!props.canDelete
                ? 'true'
                : `!deleteImagesId.includes('${imageUrl.id}')`}
            >
              <img
                src={imageUrl.url}
                alt=''
                class={cn(
                  'aspect-square w-32 rounded-lg object-cover ml-auto',
                )}
              />
              {!props.canDelete ? null : (
                <button
                  x-on:click={`deleteImagesId=[...deleteImagesId,'${imageUrl.id}']`}
                  class='top-2 right-2 absolute bg-red-600 rounded-full p-1'
                  type='button'
                >
                  <img
                    src='/icons/x-mark.svg'
                    alt='Close button'
                    class='w-4 h-4 rounded-full invert'
                  />
                </button>
              )}
            </div>
          ))
          .join('')}
      </div>

      <div x-show={`${props.name}_files.length`}>
        <div
          class={cn(
            'grid gap-2 mt-2 mt-4 mx-auto',
            props.multiple ? 'grid-cols-3' : 'justify-center items-center',
          )}
          style='width:fit-content;'
        >
          <template
            x-for={`(image, index) in ${props.name}_files`}
            x-bind:key='index'
          >
            <div class='relative'>
              <img
                src='#'
                x-bind:src='URL.createObjectURL(image)'
                alt=''
                class={cn(
                  'aspect-square w-32 rounded-lg object-cover',
                )}
              />
            </div>
          </template>
        </div>
        <label for={`${props.name}-dropzone-file`} class='cursor-pointer'>
          <p
            x-show={`${props.name}_files.length`}
            class='mt-2 text-xs tracking-wide text-primary block text-center border-2 border-dashed border-primary p-2 rounded-xl'
          >
            {inputMessage}
          </p>
        </label>
      </div>

      <label
        for={`${props.name}-dropzone-file`}
        class='flex flex-col items-center w-full p-5 mx-auto mt-2 text-center bg-white border-2 border-primary border-dashed cursor-pointer rounded-xl'
        x-show={`!${props.name}_files.length`}
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke-width='1.5'
          stroke='currentColor'
          class='w-8 h-8 text-primary'
        >
          <path
            stroke-linecap='round'
            stroke-linejoin='round'
            d='M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z'
          />
        </svg>

        <p class='text-lg mt-1 font-medium tracking-wide text-primary'>
          {props.containerLabel || _.capitalize(props.name)}
        </p>

        <p class='mt-2 text-xs tracking-wide text-primary'>
          {inputMessage}
        </p>
      </label>

      <input
        name={props.name}
        id={`${props.name}-dropzone-file`}
        type='file'
        class={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none',
          props.inputClass,
        )}
        x-on:change={`${props.name}_files=($el.files)`}
        {...combineObjects(
          [
            props.multiple
              ? [
                'multiple',
                {
                  min: props.min?.toString() || '1',
                  max: props.max?.toString() || '10',
                },
              ]
              : [],
            props.accept ? [{ accept: props.accept }] : [],
            props.required ? ['required'] : '',
          ].flat(),
        )}
      />

      {props.canDelete && (
        <template x-for='id in deleteImagesId'>
          <input
            type='hidden'
            name={props.name + '_deleted'}
            value='null'
            x-bind:value='id'
          />
        </template>
      )}

      {props.multiple && (props.min || props.max)
        ? (
          <input
            type='number'
            name='number_file_uploads'
            id='number_file_uploads'
            min={props.min?.toString() || ''}
            max={props.max?.toString() || ''}
            x-bind:value={`${props.name}_files.length`}
            class='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 pointer-events-none'
          />
        )
        : null}
    </div>
  )
}
