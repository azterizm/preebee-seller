import { Logo } from '../../components/Logo'
import { BaseHtml } from '../../components/root'

export default function Onboarding(props: {
  error?: string
}) {
  return (
    <BaseHtml>
      <body>
        <form
          enctype='multipart/form-data'
          hx-post='/onboarding/add_documents'
          hx-target='this'
          hx-swap='outerHTML'
          hx-indicator='.loader'
          hx-ext='disable-element'
          hx-disable-element='#submit_btn'
        >
          <div class='flex items-center justify-between mb-8'>
            <Logo />
            <h1 class='text-3xl font-bold'>Welcome</h1>
            <a href='/logout' class='btn btn-error'>Logout</a>
          </div>
          <div class='container mx-auto prose text-center'>
            <p>
              You have successfully opened your account as seller on the
              marketplace. Now you will need verify your identity.
            </p>
            <div class='!my-16'>
              <img
                src='/images/nic-card.png'
                alt='nic card'
                class='w-56 mx-auto'
              />
              <p>
                Please add <b>FRONT</b> and <b>BACK</b>{' '}
                picture of your National Identity Card.
              </p>
              <div class='form-control'>
                <label class='label'>
                  <span class='label-text'>Front</span>
                </label>
                <input
                  type='file'
                  placeholder='Front'
                  name='front'
                  required
                  class='file-input file-input-bordered'
                  accept='image/*'
                />
              </div>
              <div class='form-control mt-4'>
                <label class='label'>
                  <span class='label-text'>Back</span>
                </label>
                <input
                  accept='image/*'
                  type='file'
                  placeholder='Back'
                  name='back'
                  class='file-input file-input-bordered'
                  required
                />
              </div>
              <div class='my-8 max-w-xs text-left mx-auto'>
                <div class='form-control'>
                  <label class='label'>
                    <input
                      type='checkbox'
                      class='checkbox mr-2'
                      name='agree_rules'
                      required
                    />
                    <span class='label-text'>
                      You agree to our{' '}
                      <a
                        href='/terms-and-conditions'
                        class='link link-primary'
                        target='_blank'
                      >
                        Terms of Service{' '}
                      </a>
                      and{' '}
                      <a
                        href='/privacy-policy'
                        class='link link-primary'
                        target='_blank'
                      >
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>
                </div>
              </div>
              <button
                id='submit_btn'
                class='mt-8 btn btn-secondary'
              >
                Submit
              </button>
              {props.error && (
                <p class='text-error'>Error occured: {props.error}</p>
              )}
            </div>
          </div>
        </form>
        <span class='loader htmx-indicator'></span>
      </body>
    </BaseHtml>
  )
}
