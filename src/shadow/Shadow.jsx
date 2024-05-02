// This one will always get hotloaded cuz of the css imports
// Don't know what to do about it
import index_css from '../css/index.css?inline'
import primereact_css from 'primereact/resources/themes/lara-dark-blue/theme.css?inline'
import primeicons_css from 'primeicons/primeicons.css?inline'
import { useEffect } from 'react'
import loadfonts from './loadfonts.js'

const insertIntoShadowDom = (element) => {
  let current = window.zaffius_appRoot.getElementById(element.id)
  if (current) {
    current.remove()
  }
  window.zaffius_appRoot.insertBefore(element, window.zaffius_appRoot.firstChild)
}

if('SHADOW' === import.meta.env.VITE_APP_MODE) {
  const handle = setInterval(() => {
    if (window.zaffius_appRoot) {
      clearInterval(handle)
      const styles = [primeicons_css, primereact_css, index_css]
      styles.forEach((e, i) => {
        const s = document.createElement('style')
        s.id = 'style_' + i
        s.innerHTML = e
        insertIntoShadowDom(s)
      })
    }
  }, 10)
}

export default function Shadow({ children }) {
  useEffect(() => {
    const fetch = async () => {
      await loadfonts()
    }

    if (import.meta.env.PROD) {
      fetch().then()
    }
  }, [])
  return children
}
