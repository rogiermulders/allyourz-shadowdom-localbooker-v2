const lb = document.getElementById('localbooker')
let prevStyles = []

export default {
  tempFix: () => {
    // I know where I'm attached to
    let parent = lb.parentNode
    while (parent.nodeName !== 'HTML') {
      if(window.getComputedStyle(parent).zIndex !== 'auto') {
        prevStyles.push({node:parent, style:parent.getAttribute('style')})
        parent.style.zIndex = 'auto'
        parent.dataset.localbooker = 'z-index temporary removed by locabooker'
      }
      parent = parent.parentNode
    }
  },
  removeTempFix: () => {
    if(prevStyles.length){
      prevStyles.map(p => {
        p.node.setAttribute('style', p.style)
        delete p.node.dataset.localbooker
      })
      prevStyles = []
    }
  }
}

