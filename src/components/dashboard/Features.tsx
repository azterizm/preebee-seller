
import { combineObjects } from '../../utils/ui'
import RenderSvg from '../RenderSvg'

export interface FeaturesProps {}

export default function Features(props: FeaturesProps) {
  const onAddFeature =
    "!name||!value?null:items=items.concat({name,value});name='';value='';$refs.feature_name.focus();"
  return (
    <div
      x-data="{name: '', value:'', items: []}"
      x-init="$watch('name', e=>name=!e ? '' : e[0].toUpperCase() + e.slice(1));$watch('value', e=>value=!e ? '' : e[0].toUpperCase() + e.slice(1))"
    >
      <p class='mb-2 block text-sm text-primary'>Features</p>
      <template x-for='(item, index) in items' x-bind:key='index'>
        <div class='grid grid-cols-7 my-2'>
          <p class='col-span-3' x-text='item.name' />
          <p x-text='item.value' class='col-span-3 translate-x-4' />
          <button
            x-on:click='items[index]=undefined;items=items.filter(Boolean)'
            class='h-8 w-[4rem] ml-auto flex items-center justify-center cursor-pointer bg-button rounded-lg aspect-square text-center'
            type='button'
          >
            <RenderSvg src='/icons/close.svg' />
          </button>
        </div>
      </template>
      <div class='flex items-center gap-2'>
        <input
          type='text'
          name='feature_name'
          id='feature_name'
          x-ref='feature_name'
          x-model='name'
          placeholder='Name'
          maxlength='25'
          class='block w-full placeholder-primary/50 rounded-lg border border-primary bg-white px-5 py-2.5 text-primary focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
          {...combineObjects([{ 'x-on:keyup.enter': onAddFeature }])}
        />
        <input
          type='text'
          x-model='value'
          name='feature_value'
          id='feature_value'
          placeholder='Value'
          class='block w-full placeholder-primary/50 rounded-lg border border-primary bg-white px-5 py-2.5 text-primary focus:border-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-40'
          maxlength='25'
          {...combineObjects([{ 'x-on:keyup.enter': onAddFeature }])}
        />
        <button
          x-on:click={onAddFeature}
          class='h-full w-32 flex items-center justify-center cursor-pointer bg-button rounded-lg aspect-square text-center'
          type='button'
        >
          <RenderSvg src='/icons/plus.svg' />
        </button>
      </div>
    </div>
  )
}
