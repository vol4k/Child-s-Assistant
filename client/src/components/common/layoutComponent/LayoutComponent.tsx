import './LayoutComponent.css'

import { Outlet } from 'react-router-dom'

export default function LayoutComponent() {
  return (
    <div className='layout-wrapper'>
      <div className='layout'>
        <Outlet/>
      </div>
    </div>
  )
}
