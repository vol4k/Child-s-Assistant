import {useNavigate} from 'react-router-dom'
import './BackButton.css'

import {IoIosArrowBack} from 'react-icons/io'

export default function BackButton(props:{navTo: string}) {
  const nav = useNavigate()

  return (
    <div className='backButton' onClick={() => nav(props.navTo)}>
      <IoIosArrowBack color='#87CEFA' />
      <label>Return</label>
    </div>
  )
}
