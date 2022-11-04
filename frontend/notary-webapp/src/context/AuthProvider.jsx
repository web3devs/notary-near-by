import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  connectToWallet,
  getAccountAddress,
  registerCallback,
  unregisterCallback
} from '../contracts'

import * as store from '../storage'

const AuthContext = createContext({
  role: null,
  isConnected: false,
  login: () => {
    console.error('not implemented')
  },
  logout: () => {
    console.error('not implemented')
  },
  setRole: (role) => console.log('not implemented')
})
export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null)
  const [accountAddress, setAccountAddress] = useState(null)

  useEffect(() => {
    registerCallback('auth', async () => {
      const addres = getAccountAddress()
      if (addres) {
        setAccountAddress(getAccountAddress())
      } else {
        setAccountAddress(null)
        store.clear()
      }
    })
    return () => {
      unregisterCallback('auth')
    }
  }, [])

  const isConnected = useMemo(() => {
    return !!accountAddress
  }, [accountAddress])

  const logout = () => {
    store.clear()
  }

  const login = async () => {
    await connectToWallet()
  }

  const value = useMemo(
    () => ({
      isConnected,
      accountAddress,
      role,
      setRole,
      logout,
      login
    }),
    [isConnected, role, setRole, login, logout, accountAddress]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
