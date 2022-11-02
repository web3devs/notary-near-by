import axios from 'axios'

const api = axios.create({
  baseURL: 'https://nrsqfdo2y0.execute-api.us-east-1.amazonaws.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

// api.interceptors.request.use(
//   (config) => {
//     let { data } = config
//     data = { ...data, public_key: 'eeee', signature: 'signature' }
//     return { ...config, data }
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

export const signUpParticipant = async (
  address,
  signature,
  firstName,
  lastName
) => {
  const { data } = await api.post(`/participants`, {
    public_key: address,
    signature: signature,
    first_name: firstName,
    last_name: lastName
  })
  return data
}

export const getOwnersOrders = async (ownerAddress) => {
  const { data } = await api.get(`/orders-by-owner/${ownerAddress}`)
  return data || []
}

export const getNotaryProfile = async (address) => {
  const { data } = await api.get(`/notaries/${address}`)
  return data
}

export const getParticipantProfile = async (address) => {
  const { data } = await api.get(`/participants/${address}`)
  return data
}

export const getOrder = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`)
  return data
}
