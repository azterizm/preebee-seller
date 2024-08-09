import { cn } from '../utils/ui'

interface Props {
  title: string | JSX.Element
  description?: string | JSX.Element
  titleClass?: string
  descriptionClass?: string
}
export default function PageHeader(props: Props) {
  return (
    <div
      class='my-8 max-w-lg mx-auto'
      x-data="{error: new URLSearchParams(window.location.search).get('error')}"
    >
      <p
        class='text-center mb-8 text-error'
        x-text="'Error: ' + error"
        x-show='error'
      >
        Error:
      </p>
      <h1 class={cn('text-3xl font-bold text-left', props.titleClass)}>
        {props.title}
      </h1>
      {props.description
        ? (
          <p class={cn('mt-2', props.descriptionClass)}>
            {props.description}
          </p>
        )
        : null}
    </div>
  )
}
