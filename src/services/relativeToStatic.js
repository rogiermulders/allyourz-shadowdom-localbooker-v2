/**
 * Just goes up the DOM tree and sets 2 deep parents to position: static
 */
export default {

  run: (lb) => {
    let count = 0;
    let parent = lb.parentNode
    while (parent.nodeName !== 'HTML') {
      if(count++ === 2) break;
      if (window.getComputedStyle(parent).position !== 'static') {
        parent.style.position = 'static'
        parent.dataset.localbooker = 'to static by localbooker'
      }
      parent = parent.parentNode
    }
  }
}

