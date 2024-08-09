
import { cn } from '../utils/ui'

export interface GoBackProps {
  class?: string
  to: string
}

export default function GoBack(props: GoBackProps) {
  return (
    <a href={props.to} class={cn('flex items-center gap-2 group w-max', props.class)}>
      <img
        src='/icons/arrow-right.svg'
        class='rotate-180 group-hover:-translate-x-2 transition-transform'
        width='24'
        height='24'
        alt='back'
      />
      <span>Go back</span>
    </a>
  )
}
