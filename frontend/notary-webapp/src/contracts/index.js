export const signUpNotary = (companyName, notaryLicenseFile, stampFile) => {
  // add actual contract interaction here
  return new Promise((res, rej) => {
    setTimeout(() => {
      tmpNotaryState = { ...tmpNotaryState, isNotary: true }
      res()
    }, 3000)
  })
}

export const signUpClient = (form, idFile) => {
  // add actual contract interaction here
  return new Promise((res, rej) => {
    setTimeout(() => {
      tmpClientState = { ...tmpClientState, isClient: true }
      res()
    }, 3000)
  })
}

// mock data
let tmpClientState = {
  isClient: false
}
let tmpNotaryState = {
  isNotary: false
}

export const getNotaryAccount = (accountAddress) => {
  return tmpNotaryState
}

export const getClientAccount = (accountAddress) => {
  return tmpClientState
}

export const getOrders = () => {
  return new Promise((res, rej) => {
    setTimeout(() => {
      res([
        {
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'open'
        },

        {
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'closed'
        },
        {
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'closed'
        },
        {
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'open'
        },
        {
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'open'
        },
        {
          name: 'John',
          surrname: 'Doe',
          fileType: 'Contract',
          status: 'open'
        }
      ])
    }, 1000)
  })
}
