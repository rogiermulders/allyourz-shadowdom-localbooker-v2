import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { RecoilRoot, useRecoilState, useRecoilValue } from 'recoil'
import { MainContext } from './contexts/MainContext'
import PageError from './pages/PageError.jsx'
import {locale} from 'primereact/api';
import {loadStripe} from '@stripe/stripe-js';
import { useContext, useEffect } from 'react'
import recoilConfig from './recoil/recoilConfig.js'
import recoilMainFilter from './recoil/recoilMainFilter.js'
import deviceCheck from './services/deviceCheck.js'
import { plotBreakpint } from './services/debug.js'
import Spa from './pages/Spa.jsx'
import Pdp from './pages/Pdp.jsx'
import PageTest from './pages/PageTest.jsx'
import PageForm from './pages/PageForm.jsx'
import PageConfirm from './pages/PageConfirm.jsx'
import PageThankYou from './pages/PageThankYou.jsx'
import recoilReservation from './recoil/recoilReservation.js'
import PageStripe from './pages/PageStripe.jsx'

function App({
               page,
               slug,
               pid,
               offset,
               content,
               hostlocale,
               mainfilter,
               scroll
             }) {

  if (!pid) {
    return <PageError messages={[
      'No data-pid attribute given. Please provide like so:',
      '<div id="localbooker" data-pid="demo.localbooker.nl"/>'
    ]}/>
  }

  try {
    mainfilter = JSON.parse(mainfilter || null)
  } catch (e) {
    return <PageError messages={[
      'No valid JSON in the data-mainfilter parameter',
      mainfilter
    ]}/>
  }

  if (typeof offset !== 'undefined') {
    if (isNaN(offset)) {
      const e = document.querySelector(offset)
      if (e) {
        offset = e.getBoundingClientRect().bottom
      } else {
        return <PageError messages={[
          `Offset can be a number or an existing element.`,
          `Element '${offset}' not found on this page.`,
          `document.querySelector('${offset}') = undefined`
        ]}/>
      }
    }
  }

  /**
   * !! This one is here for primereact !!
   */
  locale(hostlocale || 'nl')

  /**
   * Set Stripe global!
   */
  window.localbookerStripe = loadStripe(import.meta.env.VITE_APP_STRIPE_API_KEY, {locale: hostlocale});

  // eslint-disable-next-line react/prop-types
  const MyRouter = ({content, page, slug, pid, scroll, offset, mainfilter, hostlocale}) => {
    const { paymentStarted } = useRecoilValue(recoilReservation)
    const context = useContext(MainContext)
    const [config, setConfig] = useRecoilState(recoilConfig)
    const [, setMainFilter] = useRecoilState(recoilMainFilter)
    /**
     * Routes when landing on SPA
     *
     * When DEV we do not have a localbooker-root so just '/'
     * In the wild, localbooker is bootstrapped with localbooker.js
     * (from within the public folder)
     * That one sets the root pages
     */
    const lbRoot = JSON.parse(sessionStorage.getItem('localbooker-root'))
    const basename = lbRoot ? lbRoot[hostlocale][page] : '/'

    useEffect(() => {

      context.setHostLocale(hostlocale)

      // Detects tag changes (also the first load)
      // page means pageType 'spa' or 'pdp'
      if (page !== config.page || hostlocale !== config.locale) {
        setConfig(p => {
          return {
            ...p,
            content,  // when true the PDP shows the administration info
            basename, // For react router
            pid,      // Partner id (will be stored in DB on booking)
            scroll,   // To scroll or not to scroll
            offset,   // String (dom id, class e.t.c.) or number for the position:fixed
            page,     // Type pdp or spa
            slug,     // when pdp
            device: deviceCheck(),  // mobile or desktop
            locale: hostlocale      // nl,de,en
          }
        })
        // <== !! this is the JSON on the localbooker tag ==> //
        if (mainfilter && mainfilter.where) {
          setMainFilter(p => {
            return {
              ...p, where: {
                disabled: !!mainfilter.where?.disabled,
                regionId: mainfilter.where?.regionId || null,
                destinationZip: mainfilter.where?.destinationZip || null,
                range: mainfilter.where?.range || 2
              }
            }
          })
        }
      }
    }, [config])

    /**
     * Outside locale switcher
     * My guess is we should delete this functionality (its confusing)
     */
    if (window.localbooker && !window.localbooker.setLocale) {
      window.localbooker.setLocale = (locale) => {
        if (['nl', 'de', 'en', 'tp'].includes(locale)) {
          context.setHostLocale(locale)
          return true
        } else {
          return "Enkel 'nl','de','en','tp' toegestaan"
        }
      }
    }


    useEffect(() => {
      plotBreakpint(context.breakpoint?.s, context.breakpoint?.sw, context.breakpoint?.ih)
    }, [context.breakpoint?.s, context.breakpoint?.sw, context.breakpoint?.ih])

    /**
     * Wait for all css to be loaded before we show the app
     */
    useEffect(() => {
      if(context.allCssLoaded){
          window.localbooker_shadowRoot.getElementById('app').style.visibility= 'visible'
      }
    }, [context.allCssLoaded])


    /**
     * wait for breakpoints
     */
    if (!context.breakpoint?.s) return null

    /**
     * This one hurts... this is a stripe redirect
     * When we detect a payment_intent GET variable
     * It's the strip redirect so can not use routing
     */
    const searchParams = new URLSearchParams(document.location.search);

    return <BrowserRouter basename={basename}>
      <Routes>
        {searchParams.get('payment_intent') ?
          <>
            <Route key="040" exact path="/" element={<PageThankYou/>}/>
          </> : <>
            {paymentStarted && <>
              <Route key="060" exact path="/" element={<PageStripe/>}/>
            </>}
            {page === 'spa' && <>
              <Route key="000" exact path="/" element={<Spa/>}/>
              <Route key="010" exact path="/:administration_slug" element={<Pdp/>}/>
            </>}
            {page === 'pdp' && <>
              <Route key="010" exact path="/" element={<Pdp administration_slug={slug}/>}/>
            </>}
            <Route key="000" exact path="/" element={<PageThankYou/>}/>
            <Route key="020" exact path="/book" element={<PageForm/>}/>
            <Route key="030" exact path="/check" element={<PageConfirm/>}/>
            <Route key="040" exact path="/thankyou" element={<PageThankYou/>}/>
            <Route key="050" exact path="/test" element={<PageTest/>}/>

          </>}
      </Routes>

    </BrowserRouter>
  }


  return (
    <RecoilRoot>

        <div id="app" className="p-component" style={{visibility:'hidden'}}>
          <MyRouter
            content={content}
            page={page || null}
            slug={slug || null}
            pid={pid || null}
            scroll={scroll}
            offset={parseInt(offset || 0)}
            hostlocale={hostlocale || 'nl'}
            mainfilter={mainfilter || null}
          />
        </div>

    </RecoilRoot>


  )
}

export default App
