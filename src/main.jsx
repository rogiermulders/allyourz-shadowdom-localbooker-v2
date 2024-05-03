import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { addLocale } from 'primereact/api'
import { PrimeReactProvider } from 'primereact/api'

import axios from 'axios'
import { injectIconSvgIntoDom } from './services/injectIconSvgIntoDom.js'
import { MainContextProvider } from './contexts/MainContext'

import ThemeRenesseAanZee from './themes/ThemeRenesseAanZee.jsx'
import ThemeAllyourz from './themes/ThemeAllyourz.jsx'
import ThemeNova from './themes/ThemeNova.jsx'

// Set the base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_APP_API

// Set the React root node
window.zaffius_root_node = document.getElementById(import.meta.env.VITE_APP_ROOT)


window.zaffius_root_node.attachShadow({ mode: 'open' })
injectIconSvgIntoDom(window.zaffius_root_node.shadowRoot)                // Insert the renesseaanzee icons into the themes dom
window.zaffius_appRoot = window.zaffius_root_node.shadowRoot

const options = {
  appendTo: window.zaffius_appRoot,
  styleContainer: window.zaffius_appRoot
}

const data = window.zaffius_root_node.dataset
/**
 * Hack so we can change some stuff with url parameter
 * This is debugging stuff.. Would like to remove
 */
const searchParams = new URLSearchParams(document.location.search)
const locale = searchParams.get('localbooker-locale')
const offset = searchParams.get('localbooker-offset')

const app = () => <App
  page={data.page}
  pid={data.pid}
  slug={data.slug}
  offset={offset || data.offset}
  mainfilter={data.mainfilter}
  hostlocale={locale || data.locale}
  content={data.content !== 'false'}
  scroll={data.scroll !== 'false'}
  scrollto={window.zaffius_root_node.getBoundingClientRect().y}
/>

const switcher = () => {
  switch (import.meta.env.VITE_APP_THEME) {
    case 'renesseaanzee':
      return <ThemeRenesseAanZee>{app()}</ThemeRenesseAanZee>
    case 'allyourz':
      return <ThemeAllyourz>{app()}</ThemeAllyourz>
    default:
      return <ThemeNova>{app()}</ThemeNova>
  }
}

// First get the locale data
axios.get('/localbooker/locales').then(res => {
  for (const [locale, json] of Object.entries(res.data)) {
    if (json) {
      addLocale(locale, JSON.parse(json))
    }
  }
  ReactDOM.createRoot(window.zaffius_appRoot).render(
    <React.StrictMode>
      <PrimeReactProvider value={options}>
        <MainContextProvider>
          <Suspense fallback="loading...">
            {switcher()}
          </Suspense>
        </MainContextProvider>
      </PrimeReactProvider>
    </React.StrictMode>
  )
})
