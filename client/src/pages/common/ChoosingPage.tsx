import './ChoosingPage.css'

import parent from 'images/parent.png'
import child from 'images/child.png'

import LargeInscription from 'components/common/largeInscription/LargeInscription'
import {useNavigate} from 'react-router-dom'
import Block from 'components/common/block/Block'

export default function ChoosingPage() {
  const nav = useNavigate()
  const navigateWithDelay = (path: string, delay: number = 0) => {
    setTimeout(() => nav(path), delay)
  }

  return (
    <div className='choosingPage'>
      <LargeInscription label='Who are you?' />
      <div className='choosingGrid'>
        <Block onClick={() => navigateWithDelay('/child', 250)}>
          <img src={child} alt='child' />
          <div className='labelWrapper'>
            <label>Child</label>
          </div>
        </Block>
        <Block onClick={() => navigateWithDelay('/parent', 250)}>
          <img src={parent} alt='parent' />
          <div className='labelWrapper'>
            <label>Parent</label>
          </div>
        </Block>
      </div>
    </div>
  )
}
