
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainWeb from './pages/MainWeb'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Chat from './pages/Chat'

const App = () => {
  const routes = createBrowserRouter([
    {
      path:"/",
      element:<MainWeb />,
      children:[
        {
          path:"",
          element:<Chat />
        },
        {
          path:"login",
          element:<Login />
        },
        {
          path:"register",
          element:<Register />
        },
        {
          path:"profile",
          element:<Profile />
        },
      ]
    }
  ])
  return (
    <div>
      <RouterProvider router={routes} />
    </div>
  )
}

export default App