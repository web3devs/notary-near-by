import React, { useState } from 'react'
import {
  NearEnvironment,
  NearEnvironmentProvider,
  NearProvider,
  useNearAccount
} from 'react-near'

import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons

import './App.scss'
import HomePage from './pages/Home.page'
import SignInPage from './pages/SignIn.page'
import {
  RouterProvider,
  createBrowserRouter,
  Navigate,
  useLocation
} from 'react-router-dom'
import { useNearUser } from 'react-near'
import CreateSessionPage from './pages/CreateSession.page'
import DashboardLayout from './layouts/Dashboard.layout'
import { AuthProvider } from './context/AuthProvider'

const RequireAuth = ({ children }) => {
  const nearUser = useNearUser()

  const location = useLocation()
  console.log(nearUser)
  if (!nearUser || !nearUser.isConnected) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />
  }
  return children
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/sign-in',
    element: <SignInPage />
  },
  {
    path: '/create-session',
    element: (
      <RequireAuth>
        <DashboardLayout>
          <CreateSessionPage />
        </DashboardLayout>
      </RequireAuth>
    )
  }
])

function App() {
  return (
    <NearEnvironmentProvider defaultEnvironment={NearEnvironment.TestNet}>
      <NearProvider authContractId="bujal.testnet">
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </NearProvider>
    </NearEnvironmentProvider>
  )
}

export default App
