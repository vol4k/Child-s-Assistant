import './LogoPage.css'
import logo from 'images/logo512.png'
import LargeInscription from 'components/common/largeInscription/LargeInscription'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react';

export default function LogoPage() {
  const nav = useNavigate();

  useEffect(()=>{ 
    setTimeout(()=> nav('/choose'), 3000);
  },[nav])

  return (
    <div className='logoPage'>
      <img src={logo} alt={'logo'}/>
      <LargeInscription label="Child's Assistant" />
    </div>
  )
}
