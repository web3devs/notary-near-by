import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  connectToWallet,
  getAccountAddress,
  registerCallback,
  unregisterCallback
} from '../contracts'

const AuthContext = createContext({
  isConnected: false,
  login: () => {
    console.error('not implemented')
  },
  logout: () => {
    console.error('not implemented')
  }
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  useEffect(() => {
    registerCallback('auth', () => {
      setAccountAddress(getAccountAddress())
    })
    return () => {
      unregisterCallback('auth')
    }
  }, [])
  const [accountAddress, setAccountAddress] = useState(null)

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
    () => ({ isConnected, logout, login, accountAddress }),
    [isConnected, login, logout, accountAddress]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
