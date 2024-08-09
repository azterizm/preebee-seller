import Html from '@kitajs/html'
import { cn } from '../utils/ui'

export interface TableProps {
  data: {
    title: string
    content: string | number | Html.Children
    headClass?: string
    dataClass?: string
  }[][]
}

export default function Table(props: TableProps) {
  return (
    <div class='overflow-x-auto'>
      <table class='table'>
        <thead>
          <tr>
            {!props.data.length ? '' : props.data[0]
              .map((r) => (
                <th
                  safe
                  class={cn(
                    r.headClass || '',
                  )}
                >
                  {r.title}
                </th>
              ))
              .join('') as any}
          </tr>
        </thead>
        <tbody>
          {props.data.map((row) => (
            <tr>
              {row.map((r) => (
                <td safe={false} class={cn(r.dataClass || '')}>
                  {r.content}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
