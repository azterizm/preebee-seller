import { Seller } from '@prisma/client'
import _ from 'lodash'
import GoBack from '../../components/GoBack'
import PageHeader from '../../components/PageHeading'
import Header from '../../components/dashboard/Header'
import { BaseHtml } from '../../components/root'
import { combineObjects } from '../../utils/ui'
import { AuthUser } from '../../types/api'

interface Props {
  user: AuthUser & Seller & { social: { platform: string; link: string }[], profile: string }
}

export default function Profile(props: Props) {
  return (
    <BaseHtml title='Profile | Preebee Seller Dashboard'>
      <body
        x-data={`{editMode: false}`}
      >
        <form action='/account' method='post'>
          <Header active='account' />
          <GoBack to='/products' class='mt-8' />
          <PageHeader title='Profile' titleClass='!text-center' />
          <div class='flex flex-col items-start justify-start space-y-4 w-full h-full'>
            <img
              class='w-40 mask mask-circle cursor-pointer'
              src={props.user.profile}
              alt={props.user.name}
            />
            <div class='grid w-full grid-cols-2'>
              <div class='space-y-2'>
                {Object.keys(
                  _.omit(props.user, ['id', 'createdAt', 'profile', 'social']),
                )
                  .map((
                    r,
                  ) => (
                    <div>
                      <p class='capitalize font-bold text-lg'>{r}</p>
                      <p x-show='!editMode' x-transition>
                        {props.user[r as keyof typeof props.user] as any}
                      </p>
                      <input
                        x-show='editMode'
                        x-transition
                        type='text'
                        class='input input-bordered'
                        value={props.user[r as keyof typeof props.user] as any}
                        placeholder={_.capitalize(r)}
                        name={r}
                        disabled={r === 'email' || r === 'id' ||
                          r === 'createdAt'}
                        {...combineObjects([
                          'required',
                          r === 'phone'
                            ? {
                              minLength: '11',
                              maxLength: '11',
                            }
                            : {},
                        ])}
                      />
                    </div>
                  ))}
              </div>
              <div class='space-y-2'>
                {props.user.social.map((r) => (
                  <div>
                    <p class='capitalize font-bold text-lg'>{r.platform}</p>
                    <p x-show='!editMode' x-transition>
                      {r.link || 'No link'}
                    </p>
                    <input
                      x-show='editMode'
                      x-transition
                      type='text'
                      class='input input-bordered'
                      value={r.link}
                      placeholder={`https://${r.platform.toLowerCase()}.com/...`}
                      name={r.platform.toLowerCase()}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p class='capitalize font-bold text-lg'>Since</p>
              <p>{new Date(props.user.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div class='my-8 space-x-4'>
            <button
              x-text="editMode ? 'Cancel edit mode' : 'Edit account'"
              x-on:click='editMode=!editMode'
              class='btn btn-secondary'
              type='button'
            >
              Edit account
            </button>
            <a href='/account/manage_shipping' class='btn btn-secondary'>
              Manage shipping
            </a>
            <button
              type='submit'
              x-show='editMode'
              x-transition
              class='btn btn-primary'
            >
              Submit
            </button>
          </div>
        </form>
      </body>
    </BaseHtml>
  )
}
