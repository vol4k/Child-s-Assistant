import {ChangeEvent, ChangeEventHandler, useRef, useState} from 'react'
import './InputField.css'

export enum InputFieldType {
  input,
  number,
  textarea,
  time,
  password,
}

export namespace Validator {
  export type ValidatorType = (value: string) => string
  export const validator = (validators: ValidatorType[]): ValidatorType => {
    return (value: string): string => {
      return validators.map((validator) => validator(value)).join('\n')
    }
  }
}

export namespace ValidateInputField {
  export const notEmpty = (value: string): string => {
    return value.length ? '' : 'Field must be not empty'
  }
}

interface InputFieldProps {
  label: string
  type: InputFieldType
  initalValue?: string
  onChange: ChangeEventHandler<any>
}

const Input = ({label, type, initalValue, onChange}: InputFieldProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const [inputValue, setInputValue] = useState<string>(
    initalValue ? initalValue : ''
  )

  const onChangeHandler = (e: ChangeEvent<any>) => {
    const target = e.target
    const value = target.value
    setInputValue(value)
    onChange(value)
  }

  switch (type) {
    case InputFieldType.input:
      return (
        <input
          ref={inputRef}
          key={`input-${label}`}
          type='input'
          value={inputValue}
          onChange={onChangeHandler}
          placeholder={`Enter the ${label.toLowerCase()} value`}
        />
      )

    case InputFieldType.number:
      return (
        <input
          ref={inputRef}
          key={`input-${label}`}
          type='number'
          value={inputValue}
          onChange={onChangeHandler}
          placeholder={`Enter the ${label.toLowerCase()} value`}
        />
      )

    case InputFieldType.textarea:
      return (
        <textarea
          ref={textareaRef}
          key={`textarea-${label}`}
          rows={5}
          value={inputValue}
          onChange={onChangeHandler}
          placeholder={`Enter the ${label.toLowerCase()} value`}
        />
      )

    case InputFieldType.time:
      return (
        <input
          ref={inputRef}
          key={`time-${label}`}
          type='time'
          value={inputValue}
          onChange={onChangeHandler}
          placeholder={`Enter the ${label.toLowerCase()} value`}
        />
      )

    case InputFieldType.password:
      return (
        <input
          ref={inputRef}
          key={`input-${label}`}
          type='password'
          value={inputValue}
          onChange={onChangeHandler}
          placeholder={`Enter the ${label.toLowerCase()} value`}
        />
      )
  }
}

export default function InputField({
  label,
  type,
  initalValue,
  onChange,
}: InputFieldProps) {
  return (
    <div className='inputFormField'>
      <label>{label}</label>
      <Input
        type={type}
        label={label}
        initalValue={initalValue}
        onChange={onChange}
      />
    </div>
  )
}
