import './ModalContent.css'

import {FormEvent} from 'react'

interface ModalContentProps {
  title: string
  FormFields: () => JSX.Element
  onSubmit: (e: FormEvent<HTMLFormElement>) => void
  onCancel: (e: FormEvent<HTMLFormElement>) => void
  hideCancel?: boolean
}

export default function ModalContent({
  title,
  FormFields,
  onSubmit,
  onCancel,
  hideCancel,
}: ModalContentProps) {
  const ModalButtons = () => {
    return (
      <div className='modalButtons'>
        {hideCancel ? <></> : <button type='reset'>Cancel</button>}
        <button type='submit'>Submit</button>
      </div>
    )
  }

  return (
    <div className='modalContainer'>
      <h1 className='title'>{title}</h1>
      <form className='modalContent' onSubmit={onSubmit} onReset={onCancel}>
        <FormFields />
        <ModalButtons />
      </form>
    </div>
  )
}
