import { Ingredient, Product, SuitableFor } from '@prisma/client'

import Button from '../../components/Button'
import GoBack from '../../components/GoBack'
import ImageInput from '../../components/ImageInput'
import Input from '../../components/Input'
import QuantityInput from '../../components/QuantityInput'
import TextArea from '../../components/TextArea'
import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import {
  categoriesLabel,
  hairCareCategories,
  makeupCategories,
  skinCareCategories,
} from '../../constants/api'
import { combineObjects } from '../../utils/ui'

export interface ManageProductProps {
  error?: string
  data?: Product & { ingredients: Ingredient[]; suitableFor: SuitableFor[] }
  imagesId?: string[]
}

export default function ManageProduct(props: ManageProductProps) {
  return (
    <BaseHtml title='Add new product'>
      <body>
        <Header active='products' activeClickable />
        <div class='mt-8'>
          <GoBack to='/products' class='mb-2' />

          <h1 class='text-left text-3xl font-bold mb-2'>
            {props.data ? 'Editing existing product' : 'Add a new product'}
          </h1>
          {props.error ? <p safe class='text-red-600'>{props.error}</p> : null}
          <form
            class='space-y-6 mt-4'
            action={`/products/${props.data ? 'edit' : 'add'}`}
            method='post'
            enctype='multipart/form-data'
          >
            <div class='flex flex-col md:flex-row items-center w-full gap-2'>
              <ImageInput
                name='main_image'
                accept='.jpg,.jpeg,.png,.webp,.jp2,.bmp,.tiff'
                containerLabel='Main product image'
                label='Main Product Image'
                required={!props.data}
                availableImageUrls={!props.data?.id ? [] : [{
                  url: `/products/main_image/${props.data?.id}`,
                  id: props.data?.id!,
                }]}
              />
              <ImageInput
                availableImageUrls={!props.imagesId?.length
                  ? undefined
                  : props.imagesId?.map(
                    (r) => ({
                      url: `/products/image/${r}/${props.data?.id}`,
                      id: r,
                    }),
                  ) || []}
                canDelete
                required={!props.imagesId?.length}
                name='images'
                multiple
                accept='.jpg,.jpeg,.png,.webp,.jp2,.bmp,.tiff'
                containerLabel='Product Images'
                containerClass='flex-1 mb-6 md:mb-0'
                min={props.imagesId?.length ? 0 : 3}
                max={14}
              />
            </div>
            <Input
              defaultValue={props.data?.title}
              min='5'
              required
              name='title'
            />
            <Input
              defaultValue={props.data?.price
                ? Intl.NumberFormat('en-US').format(props.data?.price)
                : undefined}
              required
              name='price'
              type='price'
              hint='Per unit'
              min='100'
              max='50000'
            />
            <div>
              <p class='mb-2 block text-sm text-primary'>Stocks available</p>
              <QuantityInput
                value={props.data?.stockAcquired}
                class='flex-reverse'
              />
            </div>
            <TextArea
              name='description'
              label='Description (optional)'
              maxLength={500}
              hint='Write about your product to provide more information to your buyers. This is completely optional.'
              value={props.data?.description || ''}
            />
            <div>
              <p class='block text-sm mb-2 text-primary'>
                Stock processing method
              </p>
              <div class='flex items-start justify-between gap-6 w-full'>
                <div class='w-full bg-button p-4 rounded-lg hover:bg-priamry/50'>
                  <h1 class='text-lg font-bold'>Process Yourself (selected)</h1>
                  <p>
                    You will have to process the orders yourself. You will be
                    notified via app notifcation, email, and SMS when you have a
                    new order.
                  </p>
                </div>
                <div class='w-full bg-button p-4 rounded-lg hover:bg-priamry/50 opacity-50 pointer-events-none'>
                  <h1 class='text-lg font-bold'>
                    We process them for you (coming soon)
                  </h1>
                  <p>
                    We will process the orders for you. You will send us the
                    product beforehand and we will store them in our warehouse.
                    When you have a new order, we will process it for you and
                    ship it to the buyer.
                  </p>
                </div>
              </div>
            </div>
            <div
              x-data={`{selected: '${
                props.data?.category || 'null'
              }', selectedSub: '${
                props.data?.subCategory || 'null'
              }', selectedInternal: '${props.data?.category || 'null'}'}`}
              class='relative'
            >
              <p class='mb-2 block text-sm text-primary'>Category</p>
              <div class='flex items-center gap-6 justify-between'>
                {Object.keys(categoriesLabel)
                  .map((r) => (
                    <Button
                      class='w-full'
                      type='button'
                      x-on:click={`selected='${r}'`}
                      x-bind:class={`{'bg-tint border-2 border-primary pointer-events-none': selected == '${r}'}`}
                    >
                      {categoriesLabel[r]}
                    </Button>
                  ))
                  .join('')}
              </div>
              <div
                x-show="selected=='makeup'"
                id='makeup_categories'
                class='flex items-center gap-2 flex-wrap mt-2'
              >
                {makeupCategories.map((r) => (
                  <Button
                    type='button'
                    x-on:click={`selectedSub='${r}';selectedInternal='makeup'`}
                    x-bind:class={`{'bg-tint border-2 border-primary pointer-events-none': selectedSub == '${r}'}`}
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <div
                x-show="selected=='skin_care'"
                id='skincare_categories'
                class='flex items-center gap-2 flex-wrap mt-2'
              >
                {skinCareCategories.map((r) => (
                  <Button
                    type='button'
                    x-on:click={`selectedSub='${r}';selectedInternal='skin_care'`}
                    x-bind:class={`{'bg-tint border-2 border-primary pointer-events-none': selectedSub == '${r}'}`}
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <div
                x-show="selected=='hair_care'"
                id='haircare_categories'
                class='flex items-center gap-2 flex-wrap mt-2'
              >
                {hairCareCategories.map((r) => (
                  <Button
                    type='button'
                    x-on:click={`selectedSub='${r}';selectedInternal='hair_care'`}
                    x-bind:class={`{'bg-tint border-2 border-primary pointer-events-none': selectedSub == '${r}'}`}
                  >
                    {r}
                  </Button>
                ))}
              </div>
              <input
                class='opacity-0 pointer-events-none absolute top-0 left-0'
                name='selected'
                x-bind:value='selectedInternal'
                {...combineObjects(['required'])}
              />
              <input
                name='selectedSub'
                x-bind:value='selectedSub'
                class='opacity-0 pointer-events-none absolute top-0 left-0'
                {...combineObjects(['required'])}
              />
            </div>

            <div
              x-data={`{inputs:[${
                props.data?.suitableFor.map((r) => ({
                  name: r.key,
                  value: r.value,
                })).map(JSON.stringify as any) || '{name:"",value:""}'
              }]}`}
            >
              <p class='mb-2 block text-sm text-primary'>
                Who can use it? (optional)
              </p>
              <template x-for='(input,index) in inputs'>
                <div
                  class='w-full grid grid-cols-7 space-x-4 mb-4'
                  x-bind:id='"suitable_for-" + index'
                >
                  <input
                    type='text'
                    class='input input-bordered col-span-3'
                    placeholder='Oily skin'
                    name='suitable_for_name'
                    x-model='input.name'
                    {...{
                      'x-on:keyup.enter':
                        'input.name && input.value ? (inputs.push({name:"",value:""}), $nextTick(() => document.querySelector(`#suitable_for-${index + 1} input`)?.focus())) : null',
                    }}
                  />
                  <input
                    type='text'
                    class='input input-bordered col-span-3'
                    placeholder='Not suitable'
                    name='suitable_for_value'
                    x-model='input.value'
                    {...{
                      'x-on:keyup.enter.prevent':
                        'input.name && input.value ? (inputs.push({name:"",value:""}), $nextTick(() => document.querySelector(`#suitable_for-${index + 1} input`)?.focus())) : null',
                    }}
                  />
                  <button
                    class='btn btn-error'
                    {...combineObjects([
                      {
                        'x-on:click.prevent': 'inputs.splice(index,1)',
                      },
                    ])}
                    x-bind:disabled='inputs.length == 1'
                    type='button'
                  >
                    <img src='/icons/trash.svg' class='w-4 h-4 invert' />
                  </button>
                </div>
              </template>
              <button
                class='btn mt-2 w-full block flex items-center space-x-2'
                {...combineObjects([
                  {
                    'x-on:click.prevent': 'inputs.push({name:"",value:""})',
                  },
                ])}
                type='button'
              >
                <span>
                  Add one more condition
                </span>
                <img src='/icons/plus.svg' class='w-4 h-4 mr-2' />
              </button>
            </div>

            <div>
              <p class='mb-2 block text-sm text-primary'>
                Ingredients (optional)
              </p>
              <div
                x-data={`{inputs:["${
                  props.data?.ingredients.map((r) => r.name).join('","') || ''
                }"]}`}
              >
                <template x-for='(input,index) in inputs'>
                  <div
                    class='w-full grid grid-cols-7 space-x-4 mb-4'
                    x-bind:id='"ingredient-" + index'
                  >
                    <input
                      type='text'
                      class='input input-bordered col-span-6'
                      placeholder='Benzoic acid'
                      name='ingredients'
                      x-model='inputs[index]'
                      {...{
                        'x-on:keyup.enter.prevent':
                          'inputs[index] ? (inputs.push(""), $nextTick(() => document.querySelector(`#ingredient-${index + 1} input`)?.focus())) : null',
                      }}
                    />
                    <button
                      class='btn btn-error'
                      {...combineObjects([
                        {
                          'x-on:click.prevent': 'inputs.splice(index,1)',
                        },
                      ])}
                      x-bind:disabled='inputs.length == 1'
                      type='button'
                    >
                      <img src='/icons/trash.svg' class='w-4 h-4 invert' />
                    </button>
                  </div>
                </template>

                <button
                  class='btn mt-2 w-full block flex items-center space-x-2'
                  {...combineObjects([
                    {
                      'x-on:click.prevent': 'inputs.push("")',
                    },
                  ])}
                  type='button'
                >
                  <span>
                    Add one more ingredient
                  </span>
                  <img src='/icons/plus.svg' class='w-4 h-4 mr-2' />
                </button>
              </div>
            </div>

            <div class='join mt-16 space-x-4 flex w-full' x-data='{}'>
              <button class='btn btn-secondary flex-1 block'>Submit</button>
              {props.data?.id
                ? (
                  <button
                    x-on:click={`$refs.delete.showModal()`}
                    type='button'
                    class='btn btn-error'
                  >
                    Delete
                  </button>
                )
                : null}
              <dialog x-ref='delete' id='delete_modal' class='modal'>
                <div class='modal-box'>
                  <p class='py-4'>
                    Are you sure you want to delete this product?
                  </p>
                  <div class='modal-action'>
                    <div class='join space-x-4'>
                      <button
                        type='button'
                        x-on:click='$refs.delete.close()'
                        class='btn'
                      >
                        No
                      </button>
                      <button
                        type='submit'
                        name='delete'
                        value='1'
                        class='btn btn-primary'
                      >
                        Yes
                      </button>
                    </div>
                  </div>
                </div>
              </dialog>
            </div>

            {props.data && (
              <input type='hidden' name='product_id' value={props.data.id} />
            )}
          </form>
        </div>

        <script src='/scripts/prevent-enter-submit.js' />
      </body>
    </BaseHtml>
  )
}
