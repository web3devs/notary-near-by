import axios from 'axios'
import { getAccountAddress, signMessage } from '../contracts'
import * as store from '../storage'

const api = axios.create({
  baseURL: 'https://nrsqfdo2y0.execute-api.us-east-1.amazonaws.com',
  headers: {
    'Content-Type': 'application/json'
  }
})

const s3 = axios.create()

api.interceptors.request.use(
  async (config) => {
    let signature = store.getSignature()
    if (!signature) {
      signature = await signMessage()
      store.saveSignature(signature)
    }
    // config.headers['X-PublicKey'] = getAccountAddress()
    // config.headers['X-Signature'] = store.getSignature()
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export const signUpParticipant = async (
  address,
  signature,
  fullName,
) => {
  const { data } = await api.post(`/participants`, {
    public_key: address,
    signature: signature,
    full_name: fullName,
  })
  return data
}

export const signUpNotary = async ({
  publicKey,
  signature,
  fullName,
  state,
  idNumber,
  commissionExpirationDate,

}) => {
  const { data } = await api.post(`/notaries`, {
    public_key: publicKey,
    signature: signature,
    full_name: fullName,
    state: state,
    id_number: idNumber,
    commission_expiration_date: commissionExpirationDate,
  })

  const notary = { ...data.notary }

  console.log('n: ', notary)

  return notary
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
  file
}) => {
  const { data } = await api.post('/orders', {
    owner: accountAddress,
    document_type: documentType,
    participants,
    witnesses,
    file: {
      name: file.name,
      type: file.type,
      size: file.size
    }
  })

  if (data['upload_url']) {
    const u = await s3.put(data['upload_url'], file, {
      headers: {
        'x-amz-acl': 'private'
      }
    })
  }

  return data
}
