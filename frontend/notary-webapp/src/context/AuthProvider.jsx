import { createContext, useContext, useMemo } from 'react'
import { useNearAccount, useNearUser } from 'react-near'

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
  const nearUser = useNearUser()

  const accountAddress = useMemo(() => {
    return nearUser?.address
  })

  const isConnected = useMemo(() => {
    return nearUser?.isConnected
  }, [nearUser])

  const logout = () => {
    nearUser?.disconnect()
  }

  const login = () => {
    nearUser?.connect()
  }

  const value = useMemo(
    () => ({ isConnected, logout, login, accountAddress }),
    [isConnected, login, logout, accountAddress]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}