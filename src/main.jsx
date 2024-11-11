import ReactDOM from 'react-dom/client'
import App from './App.jsx'

import { addLocale } from 'primereact/api'
import { PrimeReactProvider } from 'primereact/api'

import axios from 'axios'
import { injectIconSvgIntoDom } from './services/injectIconSvgIntoDom.js'
import { MainContextProvider } from './contexts/MainContext'

import relativeToStatic from './services/relativeToStatic.js'
import ThemeLoader from './themes/ThemeLoader.jsx'

// Set the base URL for axios
axios.defaults.baseURL = import.meta.env.VITE_APP_API

window.localbooker_preview = false

// Find and store the localbooker container
window.localbooker_container = document.getElementById(import.meta.env.VITE_APP_ROOT)
/**
 * Have a hard time with relative containers
 * Seems to not have too many issues wen just convert them to static
 */
relativeToStatic.run(window.localbooker_container)

// Open the shadow dom
window.localbooker_container.attachShadow({ mode: 'open' })
window.localbooker_shadowRoot = window.localbooker_container.shadowRoot
// need them icons in the shadow dom
injectIconSvgIntoDom(window.localbooker_container.shadowRoot)

// Set the options for PrimeReact
const options = {
  appendTo: window.localbooker_shadowRoot,
  styleContainer: window.localbooker_shadowRoot
}

// Cloneto to prevent updating the #localbooker <div>
const data = JSON.parse(JSON.stringify(window.localbooker_container.dataset))

// !! Most of the time it's already set but chrome might have a bug
// !! where it's not set when the page loads too fast.
// !! I set it also in an attribute in the localbooker div
// !! But not in dev mode, it's not there.
if (data.sess) {
  sessionStorage.setItem('localbooker-root', data.sess)
}

/**
 * When no data-theme attribute is set
 */

if (import.meta.env.PROD) {
  /** PROD */
  if (!data.theme) {
    if (window.localbooker.domain) {
      /** Have a window.localbooker.domain. This means we MUST be on the HOST */
      data.theme = window.localbooker.domain.split('//')[1].split('.')[0]
    } else {
      /** Have NO window.localbooker.domain. This means we are on th lb domain itself */
      data.theme = 'demo'
    }
  }
} else {
  /** DEV */
  if (!data.theme) {
    data.theme = 'demo'
  }
}


// First get the locale data @todo get config too
axios.get(`/localbooker/locale?locale=${data.locale}`).then(res => {

  addLocale(data.locale, res.data)

  ReactDOM.createRoot(window.localbooker_shadowRoot).render(
    <PrimeReactProvider value={options}>
      <MainContextProvider locale={data.locale}>
        <ThemeLoader theme={data.theme}>
          <App
            theme={data.theme}
            page={data.page}
            pid={data.pid}
            slug={data.slug}
            offset={data.offset}
            mainfilter={data.mainfilter}
            hostlocale={data.locale}
            content={data.content !== 'false'}
            scroll={data.scroll !== 'false'}
            scrollto={window.localbooker_container.getBoundingClientRect().y}
          />
        </ThemeLoader>
      </MainContextProvider>
    </PrimeReactProvider>
  )
})
