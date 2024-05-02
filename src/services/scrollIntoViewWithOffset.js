

const scrollIntoViewWithOffset =  (nodeOrRef, offset, scroll) => {

  if(!scroll) return

  if(!(nodeOrRef instanceof HTMLElement)) nodeOrRef = nodeOrRef.current

  setTimeout(() => {
    window.scrollTo({
      behavior: 'smooth',
      top:
        nodeOrRef.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        offset,
    })
  }, 100) // Dunno.. without this one things are *not* working

}
export default scrollIntoViewWithOffset