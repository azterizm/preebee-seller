import { Logo } from '../../components/Logo'
import { BaseHtml } from '../../components/root'

export default function Verfiying() {
  return (
    <BaseHtml>
      <body class='flex flex-col'>
        <div class='flex items-center justify-between mb-8'>
          <Logo />
          <a href='/logout' class='btn btn-error'>Logout</a>
        </div>
        <div class='flex-1 flex items-center justify-center flex-col py-16 max-w-sm mx-auto'>
          <h1 class='mb-8 text-5xl font-bold'>Verifying...</h1>
          <p>
            Please wait while we verify your identity. This may take a few
            hours. You will be able to access your account once your identity is
            verified.
          </p>
        </div>
      </body>
    </BaseHtml>
  )
}
