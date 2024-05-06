import { useContext, useEffect } from 'react'

import primeicons_css from 'primeicons/primeicons.css?inline'
import swiper from 'swiper/swiper-bundle.css?inline'
import mapbox from 'mapbox-gl/dist/mapbox-gl.css?inline'
import loadfonts from './loadfonts.js'
import { MainContext } from '../contexts/MainContext'


const insertIntoShadowDom = (element) => {
  let current = window.localbooker_shadowRoot.getElementById(element.id)
  if (current) {
    current.remove()
  }
  window.localbooker_shadowRoot.insertBefore(element, window.localbooker_shadowRoot.firstChild)
}

export default function Shadow({ children, theme_css }) {
  const context = useContext(MainContext)
  const styles = { theme_css, primeicons_css, swiper, mapbox }

  const handle = setInterval(() => {
    if (window.localbooker_shadowRoot) {
      clearInterval(handle)
      for (const [key, value] of Object.entries(styles)) {
        const s = document.createElement('style')
        s.type = 'text/css'
        s.id = 'style_' + key
        s.innerHTML = value
        insertIntoShadowDom(s)
      }
      // Tell the world all css has been loaded
      context.setAllCssLoaded(true)
    }
  }, 10)


  useEffect(() => {
    const fetch = async () => {
      await loadfonts()
    }
    fetch().then()
  }, [])

  return children

}
