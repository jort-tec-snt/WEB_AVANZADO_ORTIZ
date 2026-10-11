import { Navigate, Route, Routes } from 'react-router-dom'
import SignIn from './pages/SignIn.jsx'
import SignUp from './pages/SignUp.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Profile from './pages/Profile.jsx'
import Forbidden from './pages/Forbidden.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signIn" replace />} />
      <Route path="/signIn" element={<SignIn />} />
      <Route path="/signUp" element={<SignUp />} />
      <Route path="/user/dashboard" element={<Dashboard admin={false} />} />
      <Route path="/admin/dashboard" element={<Dashboard admin />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/403" element={<Forbidden />} />
      <Route path="*" element={<Navigate to="/signIn" replace />} />
    </Routes>
  )
}
