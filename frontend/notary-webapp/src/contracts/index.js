export const signUpNotary = (companyName, notaryLicenseFile, stampFile) => {
  // add actual contract interaction here
  return new Promise((res, rej) => {
    setTimeout(() => {
      res()
    }, 3000)
  })
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
