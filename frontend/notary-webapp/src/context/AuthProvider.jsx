import { isAddress } from 'ethers/lib/utils'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
  connectToWallet,
  getAccountAddress,
  registerCallback,
  signMessage,
  unregisterCallback
} from '../contracts'

const AuthContext = createContext({
  role: null,
  isConnected: false,
  signature: null,
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
  const [signature, setSigature] = useState(null)
  const [role, setRole] = useState(null)
  const [accountAddress, setAccountAddress] = useState(null)

  useEffect(() => {
    registerCallback('auth', async () => {
      const addres = getAccountAddress()
      if (addres) {
        setAccountAddress(getAccountAddress())
        let sig = localStorage.getItem('sig')
        if (!sig) {
          sig = await signMessage()
          localStorage.setItem('sig', sig)
        }
        setSigature(sig)
      } else {
        setAccountAddress(null)
        setSigature(null)
        localStorage.clear()
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
    console.error('not implemented')
  }

  const login = () => {
    connectToWallet()
  }

  const value = useMemo(
    () => ({
      isConnected,
      accountAddress,
      role,
      setRole,
      logout,
      login,
      signature
    }),
    [isConnected, role, setRole, login, logout, accountAddress, signature]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
