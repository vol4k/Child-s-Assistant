import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
  useLocation,
} from 'react-router-dom'

import NoPage from 'pages/common/NoPage'
import LayoutComponent from 'components/common/layoutComponent/LayoutComponent'
import LogoPage from 'pages/common/LogoPage'
import ChoosingPage from 'pages/common/ChoosingPage'
import ChildDashboard from 'pages/child/ChildDashboard'
import ParentDashboard from 'pages/parent/ParentDashboard'
import ParentLogin from 'pages/parent/ParentLogin'
import ChildLogin from 'pages/child/ChildLogin'
import {PropsWithChildren, useState} from 'react'

export default function App() {
  const [authState, setAuthState] = useState(false)
  
  function RequireAuth(props: PropsWithChildren): JSX.Element {
    let location = useLocation()

    if (!authState) {
      return <Navigate to='/parent' state={{from: location}} replace />
    }

    return <>{props.children}</>
  }

  const router = createBrowserRouter([
    {
      path: '/',
      element: <LayoutComponent />,
      children: [
        {
          index: true,
          element: <LogoPage />,
        },
        {
          path: 'choose',
          element: <ChoosingPage />,
        },
        {
          path: 'parent',
          children: [
            {
              index: true,
              element: <ParentLogin setAuthState={setAuthState}/>,
            },
            {
              path: 'dashboard',
              element: (
                <RequireAuth>
                  <ParentDashboard />
                </RequireAuth>
              ),
            },
          ],
        },
        {
          path: 'child',
          children: [
            {
              index: true,
              element: <ChildLogin />,
            },
            {
              path: 'dashboard/:child_profile_uuid',
              element: <ChildDashboard />,
            },
          ],
        },
      ],
    },
    {
      path: '*',
      element: <NoPage />,
    },
  ])

  return (
    <div className='App'>
      <RouterProvider router={router} />
    </div>
  )
}
