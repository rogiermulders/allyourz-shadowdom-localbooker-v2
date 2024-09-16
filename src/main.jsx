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

import relativeToStatic from './services/relativeToStatic.js'
import ThemeProvincieZeeland from './themes/ThemeProvincieZeeland.jsx'

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

// Easy reading
const data = window.localbooker_container.dataset

/**
 * Hack so we can change some stuff with url parameter
 * This is debugging stuff. Would like to remove
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
  scrollto={window.localbooker_container.getBoundingClientRect().y}
/>

/*******************************************************************************
  * Switcher
  * @returns {JSX.Element}
  *****************************************************************************/
const switcher = () => {
  switch (import.meta.env.VITE_APP_THEME) {
    case 'renesseaanzee':
      return <ThemeRenesseAanZee>{app()}</ThemeRenesseAanZee>
    case 'allyourz':
      return <ThemeAllyourz>{app()}</ThemeAllyourz>
    case 'provinciezeeland':
      return <ThemeProvincieZeeland>{app()}</ThemeProvincieZeeland>
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
  ReactDOM.createRoot(window.localbooker_shadowRoot).render(
    // <React.StrictMode>
      <PrimeReactProvider value={options}>
        <MainContextProvider>
            {switcher()}
        </MainContextProvider>
      </PrimeReactProvider>
    // </React.StrictMode>
  )
})
