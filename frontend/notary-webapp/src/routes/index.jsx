import {
  BrowserRouter,
  Navigate,
  useLocation,
  Route,
  Routes
} from 'react-router-dom'

import CreateOrderPage from '../pages/participant/order/CreateOrder.page'
import DashboardLayout from '../layouts/Dashboard.layout'
import NotaryDashPage from '../pages/notary/NotaryDash.page'
import ParticipantDashPage from '../pages/participant/ParticipantDash.page'
import ParticipantSessionPage from '../pages/participant/order/Session.page'
import ParticipantMintPage from '../pages/participant/order/Mint.page'
import HomePage from '../pages/Home.page'
import SignInPage from '../pages/SignIn.page'
import SignUpPage from '../pages/notary/NotarySignUp.page'
import ParticipantSignUpPage from '../pages/participant/ParticipantSignUp.page'
// import OrderSessionPage from '../pages/order/Session.page'
import NotarySessionPage from '../pages/notary/order/Session.page'
import TestPage from '../pages/Test.page'
import { useAuth } from '../context/AuthProvider'

const RequireAuth = ({ children }) => {
  const { isConnected } = useAuth()

  const location = useLocation()

  if (!isConnected && location.pathname !== '/test') {
    return <Navigate to="/" state={{ from: location }} replace />
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
          path="/notary/orders/:id"
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
          path="/participant/create-order"
          element={
            <RequireAuth>
              <DashboardLayout>
                <CreateOrderPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/participant/orders/:id"
          element={
            <RequireAuth>
              <DashboardLayout>
                <ParticipantSessionPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        <Route
          path="/participant/claim/:id"
          element={
            <RequireAuth>
              <DashboardLayout>
                <ParticipantMintPage />
              </DashboardLayout>
            </RequireAuth>
          }
        />
        {/* <Route
          path="/orders/:id"
          element={
            <RequireAuth>
              <DashboardLayout>
                <OrderSessionPage />
              </DashboardLayout>
            </RequireAuth>
          }
        /> */}
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
        <Route
            path="/test"
            element={
              <RequireAuth>
                  <DashboardLayout>
                      <TestPage />
                  </DashboardLayout>
              </RequireAuth>
            }
        />
      </Routes>
    </BrowserRouter>
  )
}
