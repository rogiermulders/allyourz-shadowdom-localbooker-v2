let bodyStyle = null

export const freeze = () => {
  // prevent running twice
  if(bodyStyle === null) {
    bodyStyle = window.document.body.getAttribute('style')
    // Need to freeze the real body
    document.body.style.paddingRight = `${Math.abs(window.innerWidth - document.documentElement.clientWidth)}px`;
    document.body.style.height = '100%'
    document.body.style.overflow = 'hidden'
  }
}

export const unFreeze = () => {
  window.document.body.setAttribute('style', bodyStyle)
  bodyStyle = null
}
