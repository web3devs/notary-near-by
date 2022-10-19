import React, { useState } from 'react'
import {
  NearEnvironment,
  NearEnvironmentProvider,
  NearProvider
} from 'react-near'

import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons

import './App.scss'
import HomePage from './pages/Home.page'
import SignInPage from './pages/SignIn.page'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/sign-in',
    element: <SignInPage />
  }
])

function App() {
  const [count, setCount] = useState(0)

  return (
    <NearEnvironmentProvider defaultEnvironment={NearEnvironment.TestNet}>
      <NearProvider authContractId="my-contract.testnet">
        <RouterProvider router={router} />
      </NearProvider>
    </NearEnvironmentProvider>
  )
}

export default App
