import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  connectToWallet,
  getAccountAddress,
  registerCallback,
  unregisterCallback
} from '../contracts'

const AuthContext = createContext({
  role: null,
  isConnected: false,
  login: () => {
    console.error('not implemented')
  },
  logout: () => {
    console.error('not implemented')
  },
  setRole: (role) => console.log('not implemented'),
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null)
  const [accountAddress, setAccountAddress] = useState(null)

  useEffect(() => {
    registerCallback('auth', () => {
      setAccountAddress(getAccountAddress())
    })
    return () => {
      unregisterCallback('auth')
    }
  }, [])

  const isConnected = useMemo(() => {
    return !!accountAddress
  }, [accountAddress])

  const logout = () => {
    console.error('not implemented')
  }

  const login = () => {
    connectToWallet()
  }

  const value = useMemo(
    () => ({ isConnected, role, setRole, logout, login, accountAddress }),
    [isConnected, role, setRole, login, logout, accountAddress]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
