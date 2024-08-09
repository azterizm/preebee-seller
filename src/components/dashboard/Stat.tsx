
import { cn } from '../../utils/ui'

export interface StatProps {
  title: string | number
  value: string | number
  percentage?: number
  trend?: 'up' | 'down'
}

export default function Stat(props: StatProps) {
  return (
    <article class='rounded-lg bg-tint p-6'>
      <div class='flex items-center justify-between'>
        <div>
          <p class='text-sm'>{props.title}</p>
          <p class='text-2xl font-semibold whitespace-nowrap'>{props.value}</p>
        </div>
      </div>

      {props.trend ? (
        <div
          class={cn(
            'mt-1 flex gap-1 items-center',
            props.trend === 'up' ? 'text-green-600' : 'text-red-600',
          )}
        >
          {props.trend === 'up' ? (
            <img src='/icons/trend_up.svg' class='w-icon' alt='Trend up' />
          ) : props.trend === 'down' ? (
            <img src='/icons/trend_down.svg' class='w-icon' alt='Trend down' />
          ) : null}

          {props.percentage && props.trend ? (

          <p class='flex gap-2 text-xs'>
            <span class='font-medium'> {props.percentage?.toFixed(2)}% </span>

            <span class='text-muted'> Since last week </span>
          </p>
          ) : null}
        </div>
      ) : (
      null
      )}
    </article>
  )
}
