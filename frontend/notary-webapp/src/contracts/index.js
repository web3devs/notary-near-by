export const signUpNotary = (companyName, notaryLicenseFile, stampFile) => {
  // add actual contract interaction here
  return new Promise((res, rej) => {
    setTimeout(() => {
      tmpNotaryState = { ...tmpNotaryState, isNotary: true }
      res()
    }, 3000)
  })
}

export const signUpParticipant = (form, idFile) => {
  // add actual contract interaction here
  return new Promise((res, rej) => {
    setTimeout(() => {
      tmpParticipantState = { ...tmpParticipantState, isParticipant: true }
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

export const getParticipantAccount = (accountAddress) => {
  return tmpParticipantState
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
