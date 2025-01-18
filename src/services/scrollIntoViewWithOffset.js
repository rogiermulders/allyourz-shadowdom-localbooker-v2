

const scrollIntoViewWithOffset =  (nodeOrRef, offset, scroll) => {

  if(!scroll) return

  if(!(nodeOrRef instanceof HTMLElement)) nodeOrRef = nodeOrRef.current

  const fontSize = parseFloat(getComputedStyle(document.getElementById(import.meta.env.VITE_APP_ROOT)).fontSize);

  setTimeout(() => {
    window.scrollTo({
      behavior: 'smooth',
      top:
        nodeOrRef.getBoundingClientRect().top -
        document.body.getBoundingClientRect().top -
        (offset + (1.5 * fontSize)),
    })
  }, 100) // Dunno.. without this one things are *not* working

}
export default scrollIntoViewWithOffset