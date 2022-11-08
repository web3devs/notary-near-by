import { ethers } from 'ethers'
import { utils } from 'ethers'

let provider = null
let signer = null
let accountAddress = null
const callbacks = {}

export const signMessage = async (msg) => {
  console.log('accountAddress', accountAddress)
  const sig = await signer.signMessage('hello!')
  // const hash = ethers.utils.keccak256(
  //   '0x352aBe22d01AC782bbe79A042B79964f770B91e2'
  // )
  // console.log('rawHash', hash)
  // console.log('hash', ethers.utils.arrayify(hash))
  // const sig = await w.signMessage(ethers.utils.arrayify(hash))
  // new ethers.utils.SigningKey()
  console.log('sig', sig)
  // const pk = ethers.utils.recoverPublicKey(hash, sig)
  // console.log('pk', pk)

  // const output = utils.verifyMessage(ethers.utils.arrayify(hash), sig)
  // console.log(output)

  return sig
}

export const unregisterCallback = (key) => {
  delete callbacks[key]
}
export const registerCallback = (key, fn) => {
  callbacks[key] = fn
}
const notifyCallbacks = () => {
  Object.values(callbacks).map((fn) => fn())
}

export const getAccountAddress = () => accountAddress

export const connectToWallet = async () => {
  console.log('connect to wallet')
  await provider.send('eth_requestAccounts', [])
  signer = provider.getSigner()
  return signer
}

export const initProvider = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const accounts = await provider.listAccounts()
    if (accounts.length > 0) {
      signer = provider.getSigner()
      console.log('signer', signer)
      console.log('accountAddress', accountAddress)
      accountAddress = accounts[0]
      notifyCallbacks()
    }
    window.ethereum.on('accountsChanged', function (accounts) {
      console.log('accountsChanged')
      accountAddress = accounts[0]
      notifyCallbacks()
    })
  } else {
    throw new Error('this brawser does not support ethereum')
  }
}

export const signUpNotary = (companyName, notaryLicenseFile, stampFile) => {
  // add actual contract interaction here
  return new Promise((res, rej) => {
    setTimeout(() => {
      tmpNotaryState = { ...tmpNotaryState, isNotary: true }
      res()
    }, 3000)
  })
}

// mock data
let tmpParticipantState = {
  isParticipant: false
}
let tmpNotaryState = {
  isNotary: true
}

export const getNotaryAccount = (accountAddress) => {
  return tmpNotaryState
}

export const getOrders = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res([
        {
          id: 'e3a021bd-cff9-4d35-911c-f149e461765d',
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'open'
        },

        {
          id: '8f5eef43-7c85-43c4-a73c-4d85ee7f5b24',
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'closed'
        },
        {
          id: '338719a3-6bf5-4c71-a2a4-f299242df570',
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'closed'
        },
        {
          id: '47673dc4-f30b-4001-9d12-059d1ab5045c',
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'open'
        },
        {
          id: '0d44a1a8-ceb0-401e-bac0-a34b0cdcd0a4',
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'open'
        },
        {
          id: 'e2a156b1-2af8-49bc-91da-79d8682753cb',
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'open'
        }
      ])
    }, 1000)
  })
}
