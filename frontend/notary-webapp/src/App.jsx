import React, { useState } from 'react'

import 'primereact/resources/themes/lara-light-indigo/theme.css' //theme
import 'primereact/resources/primereact.min.css' //core css
import 'primeicons/primeicons.css' //icons

import './App.scss'

import {
  AuthProvider,
  OrdersProvider,
  WSProvider,
} from './context'

import { AppRouter } from './routes'
const App = () => {
  return (
    <AuthProvider>
      <OrdersProvider>
        <WSProvider>
          <AppRouter />
        </WSProvider>
      </OrdersProvider>
    </AuthProvider>
  )
}

export default App
