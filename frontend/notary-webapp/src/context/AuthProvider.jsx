import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  connectToWallet,
  disconnect,
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
  const [signature, setSignature] = useState(null)

  useEffect(() => {
    registerCallback('auth', async () => {
      const addres = getAccountAddress()
      if (addres) {
        setAccountAddress(getAccountAddress())
        setSignature(store.getSignature())
      } else {
        setAccountAddress(null)
        setSignature(null)
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
    disconnect()
    store.clear()
  }

  const login = async () => {
    await connectToWallet()
  }

  const me = (order) => {
    console.log('ME.order: ', order)
    let full_name = ''
    if (role === 'notary' && order.notary_joined) {
      full_name = order.notary_joined?.full_name
    }

    if (role === 'participant' && order.participants_joined) {
      full_name = order.participants_joined[accountAddress]?.full_name
    }

    if (role === 'witness' && order.witnesses_joined) {
      full_name = order.witnesses_joined[accountAddress]?.full_name
    }

    return {
      full_name: full_name,
      public_key: accountAddress,
      role: role
    }
  }

  const value = useMemo(
    () => ({
      isConnected,
      accountAddress,
      publicKey: accountAddress,
      signature,
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
