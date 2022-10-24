import { useNearAccount } from 'react-near'

import {
  BrowserRouter,
  Navigate,
  useLocation,
  Route,
  Routes
} from 'react-router-dom'
import { useNearUser } from 'react-near'

import CreateSessionPage from '../pages/CreateSession.page'
import DashboardLayout from '../layouts/Dashboard.layout'
import NotaryDashPage from '../pages/NotaryDash.page'
import ClientDashPage from '../pages/ClientDash.page'
import HomePage from '../pages/Home.page'
import SignInPage from '../pages/SignIn.page'
import SignUpPage from '../pages/NotarySignUp.page'

const RequireAuth = ({ children }) => {
  const nearUser = useNearUser()

  const location = useLocation()
  if (!nearUser || !nearUser.isConnected) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }
  return children
}

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route
          path="/create-session"
          element={
            <RequireAuth>
              <DashboardLayout>
                <CreateSessionPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/notary"
          element={
            <RequireAuth>
              <DashboardLayout>
                <NotaryDashPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/notary/sign-up"
          element={
            <RequireAuth>
              <DashboardLayout>
                <SignUpPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/client"
          element={
            <RequireAuth>
              <DashboardLayout>
                <ClientDashPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
