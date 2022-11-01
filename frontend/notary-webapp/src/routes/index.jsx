import {
  BrowserRouter,
  Navigate,
  useLocation,
  Route,
  Routes
} from 'react-router-dom'

import CreateOrderPage from '../pages/participant/CreateOrder.page'
import DashboardLayout from '../layouts/Dashboard.layout'
import NotaryDashPage from '../pages/notary/NotaryDash.page'
import ParticipantDashPage from '../pages/participant/ParticipantDash.page'
import HomePage from '../pages/Home.page'
import SignInPage from '../pages/SignIn.page'
import SignUpPage from '../pages/notary/NotarySignUp.page'
import ParticipantSignUpPage from '../pages/participant/ParticipantSignUp.page'
import OrderSessionPage from '../pages/order/Session.page'
import NotaryOrderPage from '../pages/notary/NotaryOrder.page'
import { useAuth } from '../context/AuthProvider'

const RequireAuth = ({ children }) => {
  const { isConnected } = useAuth()

  const location = useLocation()
  if (!isConnected) {
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
          path="/notary/Order/:id"
          element={
            <RequireAuth>
              <DashboardLayout>
                <NotaryOrderPage />
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
          path="/participant/create-Order"
          element={
            <RequireAuth>
              <DashboardLayout>
                <CreateOrderPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <RequireAuth>
              <DashboardLayout>
                <OrderSessionPage />
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
