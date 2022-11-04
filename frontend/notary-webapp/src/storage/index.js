export const clear = () => {
  localStorage.clear()
}

export const getSignature = () => {
  return localStorage.getItem('sig')
}

export const saveSignature = (sig) => {
  localStorage.setItem('sig', sig)
}
