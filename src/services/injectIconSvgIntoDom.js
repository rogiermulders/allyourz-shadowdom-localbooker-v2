import axios from "axios";

export const injectIconSvgIntoDom = (parent) => {
  axios({
    url: 'assets/images/icon-selection.svg',
    baseURL: process.env.REACT_APP_WHITELABEL
  }).then(res => {
    const div = document.createElement("div")
    div.dataset.info = 'allyourz icons'
    div.style.display = 'none'
    div.innerHTML = res.data

    var lastInsertedElement = window._lastElementInsertedByStyleLoader;

    if (!lastInsertedElement) {
      parent.insertBefore(div, parent.firstChild);
    } else if (lastInsertedElement.nextSibling) {
      parent.insertBefore(div, lastInsertedElement.nextSibling);
    } else {
      parent.appendChild(div);
    }
    // eslint-disable-next-line no-underscore-dangle
    window._lastElementInsertedByStyleLoader = div;
  })
}
