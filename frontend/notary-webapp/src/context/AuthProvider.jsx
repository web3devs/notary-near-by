import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  connectToWallet,
  getAccountAddress,
  initProvider,
  registerCallback,
  unregisterCallback
} from '../contracts'
import NoeExtensionsPage from '../pages/NoeExtensions.page'

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
  const [noProvider, setNoProvider] = useState(false)
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
    ;(async () => {
      try {
        await initProvider()
      } catch (err) {
        console.log(err)
        setNoProvider(true)
      }
    })()
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

  const me = (order) => {
    let first_name = ''
    let last_name = ''
    if (role === 'notary') {
      first_name = order.notary_joined?.first_name
      last_name = order.notary_joined?.last_name
    }

    if (role === 'participant') {
      first_name = order.participants_joined[accountAddress]?.first_name
      last_name = order.participants_joined[accountAddress]?.last_name
    }

    if (role === 'witness') {
      first_name = order.witnesses_joined[accountAddress]?.first_name
      last_name = order.witnesses_joined[accountAddress]?.last_name
    }

    return {
      first_name: first_name,
      last_name: last_name,
      public_key: accountAddress,
      role: role
    }
  }

  const value = useMemo(
    () => ({
      isConnected,
      accountAddress,
      role,
      setRole,
      logout,
      login,
      me
    }),
    [isConnected, role, setRole, login, logout, accountAddress]
  )
  if (noProvider) {
    return <NoeExtensionsPage />
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
