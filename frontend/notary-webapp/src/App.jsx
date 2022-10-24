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
import { AuthProvider } from './context/AuthProvider'

import { AppRouter } from './routes'
const App = () => {
  return (
    <NearEnvironmentProvider defaultEnvironment={NearEnvironment.TestNet}>
      <NearProvider authContractId="bujal.testnet">
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </NearProvider>
    </NearEnvironmentProvider>
  )
}

export default App
