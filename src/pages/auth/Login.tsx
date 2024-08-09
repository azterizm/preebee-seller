import { BaseHtml } from '../../components/root'

export default function Login() {
  return (
    <BaseHtml title='Open your account on Preebee'>
      <body class='flex items-center justify-center h-screen'>
        <section class='bg-tint p-4 rounded-lg shadow-xl'>
          <div class='text-center mb-8'>
            <a href='/' class='mb-2'>
              <img src='/logo_full.png' alt='Logo' class='w-36 mx-auto mb-2' />
            </a>
            <p class='font-medium'>
              Select one of the following providers to continue.
            </p>
          </div>

          <div class='flex items-center justify-center flex-col space-y-4'>
            <a
              href='/auth/google'
              class='bg-[#4285F4] text-gray-100 hover:text-white shadow font-bold text-sm py-3 px-4 rounded flex justify-start items-center cursor-pointer w-64'
            >
              <svg
                viewBox='0 0 24 24'
                class='fill-current mr-3 w-6 h-6'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z' />
              </svg>
              <span class='border-l border-blue-500 h-6 w-1 block'></span>
              <span class='pl-3'>Continue with Google</span>
            </a>

            <div class='bg-indigo-600 text-gray-100 hover:text-white shadow text-sm font-bold py-3 px-4 rounded flex justify-start items-center cursor-pointer w-64 mt-2'>
              <svg
                viewBox='0 0 24 24'
                class='fill-current mr-3 w-6 h-6'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path d='M23.998 12c0-6.628-5.372-12-11.999-12C5.372 0 0 5.372 0 12c0 5.988 4.388 10.952 10.124 11.852v-8.384H7.078v-3.469h3.046V9.356c0-3.008 1.792-4.669 4.532-4.669 1.313 0 2.686.234 2.686.234v2.953H15.83c-1.49 0-1.955.925-1.955 1.874V12h3.328l-.532 3.469h-2.796v8.384c5.736-.9 10.124-5.864 10.124-11.853z' />
              </svg>
              <span class='border-l border-indigo-500 h-6 w-1 block mr-1'>
              </span>
              <span class='pl-3'>Continue with Facebook</span>
            </div>
          </div>
        </section>
      </body>
    </BaseHtml>
  )
}
