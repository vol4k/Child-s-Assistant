import {range} from 'lodash'
import Block from 'components/common/block/Block'
import './DatePickerField.css'

import {forwardRef, useState} from 'react'
import DatePicker, {ReactDatePickerCustomHeaderProps} from 'react-datepicker'

interface DatePickerFieldProps {
  label: string
  value?: Date | null
  onChange: CallableFunction
}

interface CustomInputProps {
  value?: string
  onClick?: () => void
  className?: string
}

export default function DatePickerField({
  label,
  value,
  onChange,
}: DatePickerFieldProps) {
  const [date, setDate] = useState<Date | null>(value ? value : null)
  const onChangeHandler = (date: Date | null) => {
    setDate(date)
    onChange(date)
  }

  const ButtonCustomInput = forwardRef<HTMLButtonElement, CustomInputProps>(
    ({value, onClick}, ref) => (
      <Block onClick={onClick}>
        <button type='button' ref={ref}>
          {value?value:<span>Choose the date</span>}
        </button>
      </Block>
    )
  )

  const years = range(1990, new Date().getFullYear() + 1, 1)
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const customHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }: ReactDatePickerCustomHeaderProps) => (
    <div
      style={{
        margin: 10,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <button type='button' onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
        {'<'}
      </button>
      <select
        value={date.getFullYear()}
        onChange={({target: {value}}) => changeYear(Number(value))}
      >
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <select
        value={months[date.getMonth()]}
        onChange={({target: {value}}) => changeMonth(months.indexOf(value))}
      >
        {months.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <button type='button' onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
        {'>'}
      </button>
    </div>
  )

  return (
    <div className='datePikerField'>
      <label>{label}</label>
      <DatePicker
        placeholderText='Select a date'
        renderCustomHeader={customHeader}
        selected={date || undefined}
        dateFormat='dd-MM-yyyy'
        onChange={onChangeHandler}
        customInput={<ButtonCustomInput className='custom-input' />}
      />
    </div>
  )
}
