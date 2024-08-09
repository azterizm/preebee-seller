

export interface StepProps {
  step: number
  content: string
}

export default function Step(props: StepProps) {
  return (
    <div class='w-full p-4 rounded-lg bg-tint'>
      <div class='font-bold'>Step. {props.step}</div>
      <span>{props.content}</span>
    </div>
  )
}
