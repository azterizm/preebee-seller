import _ from 'lodash'

import { pageNames } from '../../constants/api'
import { PageName } from '../../types/api'
import { cn, combineObjects } from '../../utils/ui'
import Button from '../Button'

export interface HeaderProps {
  active: PageName | 'account'
  activeClickable?: boolean
}

export default function Header(props: HeaderProps) {
  return (
    <nav x-data='{menuOpen:false}'>
      <div class='flex items-center gap-2 w-full justify-between'>
        <a href='/'>
          <img src='/logo_full.png' alt='logo' class='w-24 translate-x-1' />
        </a>
        <div
          hx-trigger="load delay:1000ms"
          hx-get="/account/status"
          hx-swap="outerHTML"
        />

        <div class='flex items-center gap-2' x-data='{visible:$persist(true)}'>
          <p class='text-xl text-primary'>
            Balance:{' '}
            <span
              x-show='visible'
              class='font-semibold'
              x-cloak
              hx-get='/balance'
              id='balance'
              hx-swap='innerHTML'
              hx-trigger='load delay:1000ms, balance_changed'
            >
              Loading...
            </span>
            <span x-show='!visible'>&bull;&bull;&bull;&bull;</span>
          </p>
          <img
            x-bind:src="visible ? '/icons/visible_off.svg' : '/icons/visible_on.svg'"
            x-on:click='visible=!visible'
            class='w-6 h-6 cursor-pointer'
            src='/icons/visible_off.svg'
            alt='visible'
          />
        </div>
        <button
          class='lg:hidden w-8 h-full space-y-1 group'
          x-on:click='menuOpen=true'
        >
          <div class='w-full h-1 bg-primary rounded-lg' />
          <div class='w-1/2 h-1 bg-primary rounded-lg ml-auto transition-transform duration-500 group-hover:scale-x-200 group-hover:-translate-x-2' />
          <div class='w-full h-1 bg-primary rounded-lg' />
        </button>
      </div>
      <div class='lg:flex justify-between items-center gap-4 mt-4 hidden'>
        <div class='flex items-center gap-2'>
          {pageNames.map((pageName) => (
            <div class='relative'>
              <Button
                preload='auto'
                href={props.active === pageName && !props.activeClickable
                  ? '#'
                  : '/' + (pageName === 'home' ? '' : pageName)}
                class={cn(
                  props.active === pageName
                    ? 'font-semibold bg-tint border-2 border-primary'
                    : '',
                  props.activeClickable
                    ? ''
                    : props.active === pageName
                    ? 'pointer-events-none'
                    : '',
                )}
              >
                {_.capitalize(pageName)}
              </Button>
              {pageName === 'orders'
                ? (
                  <div
                    hx-get='/orders/count'
                    hx-swap='outerHTML'
                    hx-trigger='load'
                  />
                )
                : null}
            </div>
          ))}
        </div>
        <div class='flex items-center gap-2'>
          <Button
            class={cn(
              'flex items-center gap-2 justify-between',
              props.active === 'account'
                ? 'bg-tint border-2 border-primary'
                : '',
            )}
            href='/account'
          >
            <img src='/icons/user.svg' alt='user' class='w-icon' />
          </Button>

          <Button
            class='flex items-center gap-2 justify-between'
            href='/logout'
          >
            <img src='/icons/logout.svg' alt='logout' class='w-icon' />
            <span>Logout</span>
          </Button>
        </div>
      </div>
      <div
        class='lg:hidden w-full h-screen fixed top-0 left-0 z-50 bg-tint p-8 flex flex-col justify-end items-end space-y-4'
        x-cloak
        x-show='menuOpen'
        {...combineObjects(['x-transition.scale.origin.right'])}
      >
        <button x-on:click='menuOpen=false'>
          <img
            src='/icons/close.svg'
            alt='close'
            class='w-large-icon self-start absolute top-8 right-8'
          />
        </button>
        {pageNames.map((pageName) => (
          <Button
            preload='auto'
            href={props.active === pageName
              ? '#'
              : '/' + (pageName === 'home' ? '' : pageName)}
            class={cn(
              'bg-secondary',
              props.active === pageName
                ? 'font-semibold bg-tint border-2 border-primary pointer-events-none'
                : '',
            )}
          >
            {_.capitalize(pageName)}
          </Button>
        ))}
        <div class='absolute left-8 bottom-8 flex items-start space-y-4 flex-col'>
          <Button
            class={cn(
              'flex items-center gap-2 justify-between bg-secondary',
              props.active === 'account'
                ? 'bg-tint border-2 border-primary'
                : '',
            )}
            href='/account'
          >
            <img src='/icons/edit.svg' alt='edit' class='w-icon' />
            <span>Account settings</span>
          </Button>
          <Button
            class='flex items-center gap-2 justify-between bg-secondary'
            href='/logout'
          >
            <img src='/icons/logout.svg' alt='logout' class='w-icon' />
            <span>Logout</span>
          </Button>
        </div>
      </div>
    </nav>
  )
}
