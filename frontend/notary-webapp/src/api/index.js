import axios from 'axios'
import { getAccountAddress, signMessage } from '../contracts'
import * as store from '../storage'

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

api.interceptors.request.use(
  async (config) => {
    let { data } = config
    let signature = store.getSignature()
    console.log('signature', signature)
    if (!signature) {
      signature = await signMessage()
      store.saveSignature(signature)
    }
    const sig = (data = {
      ...data,
      public_key: getAccountAddress(),
      signature
    })
    return { ...config, data }
  },
  (error) => {
    return Promise.reject(error)
  }
)

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

export const getAllOrders = async () => {
  const { data } = await api.get('/orders')

  return data || []
}

export const createOrer = async ({
  participants,
  witnesses,
  documentType,
  accountAddress,
  file,
}) => {
  const { data } = await api.post('/orders', {
    owner: accountAddress,
    document_type: documentType,
    participants,
    witnesses,
    file: {
      name: file.name,
      type: file.type,
      size: file.size,
    },
  })

  if (data['upload_url']) {
    const u = await api.put(data['upload_url'], file, {
      headers: {
        'x-amz-acl': 'private',
      },
    });
  }

  return data
}
