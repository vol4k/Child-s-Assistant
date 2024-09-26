import './ModalComponent.css'
import Modal from 'react-modal'
import 'react-datepicker/dist/react-datepicker.css'
import Carousel, {
  Direction,
  Justify,
  ScrollVisibility,
} from 'components/common/carousel/Carousel'
import InputField from 'components/fields/inputField/InputField'
import MultiselectField from 'components/fields/multiselectField/MultiselectField'
import ImageUploadingField from 'components/fields/imageUploadingField/ImageUploadingField'
import DatePikerField from 'components/fields/datePickerField/DatePickerField'
import ModalContent from 'components/modalContent/ModalContent'
import {FormEvent, useEffect, useState} from 'react'
import {FormSheme, TypeFields} from 'components/common/formField/formField'
import React from 'react'
import DescriptionField from 'components/fields/descriptionField/DescriptionField'

export default function ModalComponent(props: {
  formSheme: FormSheme
  modalIsOpen: boolean
  setIsOpen: (state: boolean) => void
  onSubmitEvent: (formState: any) => void
  hideCancel?: boolean
}) {
  Modal.setAppElement('#root')

  const generateInitialState = (formSheme: FormSheme) => {
    let initialState: any = {}
    formSheme.content.forEach((item) => {
      initialState[item.label] = item.initialValue
    })

    setFormState(initialState)
  }

  const [formState, setFormState] = useState<any>({})

  useEffect(() => {
    generateInitialState(props.formSheme)
  }, [props.modalIsOpen])

  const getFormState = () => {
    return formState
  }

  const closeModal = () => {
    props.setIsOpen(false)
  }

  const onChangeHandlerGenerator = (
    label: string,
    getFormState: CallableFunction,
    setFormState: React.Dispatch<React.SetStateAction<{}>>
  ) => {
    return (value: any) => {
      const newState = Object.assign(getFormState(), {[label]: value})
      setFormState(newState)
    }
  }

  const FormFields = () => {
    const [formFields, setFormFields] = useState<(JSX.Element | undefined)[]>()

    useEffect(() => {
      const initFormFields = props.formSheme.content.map((item, index) => {
        switch (item.type) {
          case TypeFields.inputField:
            return (
              <InputField
                type={item.inputType}
                key={`inputField-${index}`}
                label={item.label}
                initalValue={formState[item.label]}
                onChange={onChangeHandlerGenerator(
                  item.label,
                  getFormState,
                  setFormState
                )}
              />
            )
          case TypeFields.multiselectField:
            return (
              <MultiselectField
                key={`multiselectField-${index}`}
                label={item.label}
                singleSelect={item.singleSelect}
                options={item.options!}
                values={formState[item.label]}
                onChange={onChangeHandlerGenerator(
                  item.label,
                  getFormState,
                  setFormState
                )}
              />
            )
          case TypeFields.imageUploadingField:
            return (
              <ImageUploadingField
                key={`imageUploadingField-${index}`}
                label={item.label}
                value={formState[item.label]}
                onChange={onChangeHandlerGenerator(
                  item.label,
                  getFormState,
                  setFormState
                )}
              />
            )
          case TypeFields.datePikerField:
            return (
              <DatePikerField
                key={`datePikerField-${index}`}
                label={item.label}
                value={formState[item.label]}
                onChange={onChangeHandlerGenerator(
                  item.label,
                  getFormState,
                  setFormState
                )}
              />
            )
          case TypeFields.descriptionField:
            return (
              <DescriptionField
                key={`descriptionField-${index}`}
                label={item.label}
                value={formState[item.label]}
              />
            )
        }
      })
      setFormFields(initFormFields)
    }, [])

    return (
      <Carousel
        direction={Direction.vertical}
        justify={Justify.start}
        scrollVisibility={ScrollVisibility.visible}
      >
        <>{formFields}</>
      </Carousel>
    )
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    props.onSubmitEvent(formState)
    closeModal()
  }

  const onCancel = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    closeModal()
  }

  return (
    <Modal
      isOpen={props.modalIsOpen}
      onRequestClose={closeModal}
      overlayClassName={{
        base: 'overlay',
        afterOpen: 'afterOpen',
        beforeClose: 'beforeClose',
      }}
      className={{
        base: 'base',
        afterOpen: 'afterOpen',
        beforeClose: 'beforeClose',
      }}
      closeTimeoutMS={350}
    >
      <ModalContent
        title={props.formSheme.title}
        onSubmit={onSubmit}
        onCancel={onCancel}
        FormFields={FormFields}
        hideCancel={props.hideCancel}
      />
    </Modal>
  )
}
