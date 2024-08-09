import Html from '@kitajs/html'
import RenderSvg from './RenderSvg'

export interface DropdownProps {
  title: string
  options: Html.Children[]
  optionAttr?: { [x: string]: string | ((index: number) => void) }
  titleAttr?: { [x: string]: string }
  keys?: string[]
  jsVarName: string
}

export default function Dropdown(props: DropdownProps) {
  if (props.keys && props.keys.length !== props.options.length) {
    throw new Error('keys and options must have the same length')
  }
  return (
    <div class='dropdown' x-data='{open:false}'>
      <label
        tabindex={0}
        class='m-1 btn btn-button'
        for={props.jsVarName}
        x-on:click='open = !open'
      >
        <span {...props.titleAttr}>{props.title}</span>
        <img
          src='/icons/caret-down-bold.svg'
          alt='arrow'
          width='20'
          height='20'
        />
      </label>
      <ul
        tabindex={0}
        class='p-2 shadow menu dropdown-content z-[1] bg-base-100 rounded-box w-52'
        id={props.jsVarName}
        x-cloak
        x-show='open'
        {...{
          'x-transition.scale.origin.top': '',
          'x-on:click.outside': 'open=false',
        }}
      >
        {props.options.map((r, i) => (
          <li
            tabindex='-1'
            x-on:click={`${props.jsVarName}='${
              props.keys?.length ? props.keys[i] : i
            }'`}
            x-bind:class={`${props.jsVarName}==='${
              props.keys?.length ? props.keys[i] : i
            }'?'text-muted pointer-events-none':''`}
          >
            <p class='whitespace-nowrap'>
              {r}{' '}
              <RenderSvg
                class='fill-muted'
                x-show={`${props.jsVarName}==='${i}'`}
                src='/icons/check.svg'
                width='20'
                height='20'
              />
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
