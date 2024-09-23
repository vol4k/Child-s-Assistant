import './DescriptionField.css'

type Props = {
  label: string
  value: string
}

export default function DescriptionField({label, value}: Props) {
  return (
    <div className='descriptionFormField'>
      <label>{label}</label>
      <p>{value}</p>
    </div>
  )
}
