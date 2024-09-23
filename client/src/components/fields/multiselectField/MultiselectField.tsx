import {useState} from 'react'
import './MultiselectField.css'

import Multiselect from 'multiselect-react-dropdown'

export type MultiselectOptions = {
  uuid?: string
  name?: string
}

interface MultiselectFieldProps {
  label: string
  options: MultiselectOptions[]
  onChange: CallableFunction
  values?: MultiselectOptions[]
  singleSelect?: boolean
}

export default function MultiselectField({
  label,
  options,
  values,
  onChange,
  singleSelect,
}: MultiselectFieldProps) {
  const [selectedValues, setSelectedValues] = useState(values)

  const handleSelectionChange = (selectedList: MultiselectOptions[]) => {
    onChange(selectedList)
    setSelectedValues(selectedList)
  }

  return (
    <div className='multiSelectField'>
      <label>{label}</label>
      <Multiselect
        singleSelect={singleSelect}
        className='multiSelect'
        placeholder='Select here...'
        options={options}
        selectedValues={selectedValues}
        onSelect={handleSelectionChange}
        onRemove={handleSelectionChange}
        closeOnSelect={false}
        avoidHighlightFirstOption={true}
        displayValue='name'
      />
    </div>
  )
}
