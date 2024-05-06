/**
 * Just goes up the DOM tree and sets all the positions to static
 */
export default {

  run: (lb) => {
    let parent = lb.parentNode
    while (parent.nodeName !== 'HTML') {

      if (window.getComputedStyle(parent).position !== 'static') {
        parent.style.position = 'static'
        parent.dataset.localbooker = 'to static by localbooker'
      }
      parent = parent.parentNode
    }
  }
}

