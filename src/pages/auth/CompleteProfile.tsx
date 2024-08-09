import { Logo } from '../../components/Logo'
import { BaseHtml } from '../../components/root'
import GoBack from '../../components/GoBack'
import RenderSvg from '../../components/RenderSvg'
import { combineObjects } from '../../utils/ui'
export default function CompleteProfile() {
  return (
    <BaseHtml title='Complete your profile | Preebee Seller Dashboard'>
      <body>
        <div class='flex items-center justify-between'>
          <Logo />
          <a href='/logout' class='btn btn-ghost'>Logout</a>
        </div>
        <GoBack class='mt-4' to='/' />
        <form method='post' action='/complete_profile' class='max-w-lg mx-auto'>
          <div
            class='text-left my-8'
            x-data="{error: new URLSearchParams(window.location.search).get('error')}"
          >
            <p
              class='text-center mb-8 text-error'
              x-text="'Error: ' + error"
              x-show='error'
            >
              Error:
            </p>
            <h1 class='text-3xl font-bold text-left'>
              Complete your profile
            </h1>
            <p>
              Your profile does not contain required information. Please
              complete the following fields to unlock full functionality of{' '}
              <span class='font-semibold text-primary'>
                Preebee Seller Dashboard
              </span>.
            </p>
          </div>
          <div class='form-control'>
            <label class='label' for='address'>
              <span class='label-text'>Address</span>
            </label>
            <input
              type='text'
              placeholder='House # 000, Unknown Residency, Qasimabad, Hyd'
              class='input input-bordered'
              name='address'
              {...combineObjects(['required', { minLength: '5' }])}
            />
            <label class='label'>
              <span class='label-text-alt text-error flex items-center gap-2'>
                <RenderSvg
                  src='/icons/warning.svg'
                  alt='warning icon'
                  width='20'
                  height='20'
                  class='fill-red-600'
                />
                <span>
                  Rider will visit in this address to collect items.
                </span>
              </span>
            </label>
          </div>

          <div
            class='form-control'
            x-data="{input: ''}"
            x-init="$watch('input', (value) => input = isNaN(Number(value.slice(0,11))) ? '0' : value.slice(0,11))"
          >
            <label class='label' for='phone'>
              <span class='label-text'>Phone number</span>
            </label>
            <input
              type='text'
              placeholder='03123456789'
              class='input input-bordered'
              x-model='input'
              name='phone'
              {...combineObjects(['required', {
                minLength: '11',
                maxLength: '11',
              }])}
            />
          </div>

          <button type='submit' class='btn btn-primary mt-8'>Submit</button>
        </form>
      </body>
    </BaseHtml>
  )
}
