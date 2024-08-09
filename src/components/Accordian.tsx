

export interface AccordianProps {
  title: string
  content: string
}

export default function Accordian(props: AccordianProps) {
  return (
    <button
      x-data='{open:false}'
      class='w-full bg-button py-4 rounded-lg cursor-pointer h-max'
      x-on:click='open=!open'
    >
      <div class='flex justify-between items-center w-full h-max'>
        <p class='px-4 text-lg font-medium'>{props.title}</p>
        <div class='px-2 text-black hover:text-gray-500 font-bold text-3xl'>
          <img
            src='/icons/caret-down-bold.svg'
            alt='indicator'
            class='w-icon transition-transform'
            x-bind:class="{'rotate-180': open}"
          />
        </div>
      </div>
      <div
        x-show='open'
        x-cloak
        class='mx-4 items-start text-start py-4 h-max'
        x-transition
      >
        {props.content}
      </div>
    </button>
  )
}
