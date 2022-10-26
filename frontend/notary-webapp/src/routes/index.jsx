import { useNearAccount } from 'react-near'

import {
  BrowserRouter,
  Navigate,
  useLocation,
  Route,
  Routes
} from 'react-router-dom'
import { useNearUser } from 'react-near'

import CreateSessionPage from '../pages/participant/CreateSession.page'
import DashboardLayout from '../layouts/Dashboard.layout'
import NotaryDashPage from '../pages/notary/NotaryDash.page'
import ParticipantDashPage from '../pages/participant/ParticipantDash.page'
import HomePage from '../pages/Home.page'
import SignInPage from '../pages/SignIn.page'
import SignUpPage from '../pages/notary/NotarySignUp.page'
import ParticipantSignUpPage from '../pages/participant/ParticipantSignUp.page'
import ParticipantSessionPage from '../pages/participant/ParticipantSession.page'
import NotarySessionPage from '../pages/notary/NotarySession.page'

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
          path="/notary/session/:id"
          element={
            <RequireAuth>
              <DashboardLayout>
                <NotarySessionPage />
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
          path="/participant"
          element={
            <RequireAuth>
              <DashboardLayout>
                <ParticipantDashPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/participant/create-session"
          element={
            <RequireAuth>
              <DashboardLayout>
                <CreateSessionPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/participant/session/:id"
          element={
            <RequireAuth>
              <DashboardLayout>
                <ParticipantSessionPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/participant/sign-up"
          element={
            <RequireAuth>
              <DashboardLayout>
                <ParticipantSignUpPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
