import { ethers } from 'ethers'
import contracts from '../settings/contracts.json'
import NotaryContractABI from '../settings/Notary.json'

let provider = null
let signer = null
let accountAddress = null
const callbacks = {}

export const signMessage = async () => {
  const sig = await signer.signMessage(accountAddress)
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

export const getAccountAddress = () => accountAddress.toLowerCase()

export const connectToWallet = async () => {
  await provider.send('eth_requestAccounts', [])
  signer = provider.getSigner()
  const accounts = await provider.listAccounts()
  if (accounts.length > 0) {
    accountAddress = accounts[0]
    notifyCallbacks()
  }
  return signer
}

export const disconnect = () => {
  signer = null
  accountAddress = null
  console.log('disconnect')
  notifyCallbacks()
}
export const initProvider = async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    const accounts = await provider.listAccounts()
    if (accounts.length > 0) {
      signer = provider.getSigner()
      accountAddress = accounts[0]
      notifyCallbacks()
    }
    window.ethereum.on('accountsChanged', function (accounts) {
      accountAddress = accounts[0]
      notifyCallbacks()
    })
  } else {
    console.error('this browser does not support ethereum')
  }
}

export const signUpNotary = async ({ idNumber, metadataURL }) => {
  const contractAddress = contracts.Notary
  const abi = NotaryContractABI.abi
  const contract = new ethers.Contract(contractAddress, abi, signer)
  const issueTokenReceipt = await contract.issueNotaryToken(accountAddress, idNumber, metadataURL)

  await issueTokenReceipt.wait()
}
