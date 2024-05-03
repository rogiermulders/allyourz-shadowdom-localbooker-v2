import React from 'react'
import { PrimeReactProvider } from 'primereact/api'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import Node from './shadow/Node.jsx'
import Shadow from './shadow/Shadow.jsx'
import {addLocale} from 'primereact/api';

import axios from 'axios'
import { injectIconSvgIntoDom } from './services/injectIconSvgIntoDom.js'

// Set the base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_APP_API

// Set the React root node
window.zaffius_root_node = document.getElementById(import.meta.env.VITE_APP_ROOT)

const mode = import.meta.env.VITE_APP_MODE

let options = {}
if (mode === 'SHADOW') {
  window.zaffius_root_node.attachShadow({ mode: 'open' })
  injectIconSvgIntoDom(window.zaffius_root_node.shadowRoot)                // Insert the renesseaanzee icons into the shadow dom
  window.zaffius_appRoot = window.zaffius_root_node.shadowRoot

  options = {
    appendTo: window.zaffius_appRoot,
    styleContainer: window.zaffius_appRoot,
  }
} else {
  window.zaffius_appRoot = window.zaffius_root_node
}


const data = window.zaffius_root_node.dataset
/**
 * Hack so we can change some stuff with url parameter
 * This is debugging stuff.. Would like to remove
 */
const searchParams = new URLSearchParams(document.location.search);
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
        {mode === 'SHADOW' ? (
          <Shadow>
            {app()}
          </Shadow>
        ) : (
          <Node>
            {app()}
          </Node>
        )}
      </PrimeReactProvider>
    </React.StrictMode>,
  )

})
