import Header from '../components/Header'
import { Outlet } from 'react-router-dom'

const MainWeb = () => {
  return (
    <div>
        <Header />
        <Outlet />
    </div>
  )
}

export default MainWeb