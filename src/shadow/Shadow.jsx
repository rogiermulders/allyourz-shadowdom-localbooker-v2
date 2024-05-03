// This one will always get hotloaded cuz of the css imports
// Don't know what to do about it
import theme_css from '../sass/renesseaanzee.scss?inline'
import primeicons_css from 'primeicons/primeicons.css?inline'
import swiper from 'swiper/swiper-bundle.css?inline'
import mapbox from 'mapbox-gl/dist/mapbox-gl.css?inline'


import { useEffect } from 'react'
import loadfonts from './loadfonts.js'

const insertIntoShadowDom = (element) => {
  let current = window.zaffius_appRoot.getElementById(element.id)
  if (current) {
    current.remove()
  }
  window.zaffius_appRoot.insertBefore(element, window.zaffius_appRoot.firstChild)
}

const styles = {primeicons_css, theme_css, swiper, mapbox}

if('SHADOW' === import.meta.env.VITE_APP_MODE) {
  const handle = setInterval(() => {
    if (window.zaffius_appRoot) {
      clearInterval(handle)
      for (const [key, value] of Object.entries(styles)) {
        const s = document.createElement('style')
        s.type = 'text/css'
        s.id = 'style_' + key
        s.innerHTML = value
        insertIntoShadowDom(s)
      }
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
