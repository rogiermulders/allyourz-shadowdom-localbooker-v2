var localbooker = {

  insertStyleLink: function (path) {

    const shadowRoot = localbooker.root.shadowRoot

    var link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('href', path)

    var lastInsertedElement = window._lastElementInsertedByStyleLoader;
    if (!lastInsertedElement) {
      shadowRoot.insertBefore(link, shadowRoot.firstChild);
    } else if (lastInsertedElement.nextSibling) {
      shadowRoot.insertBefore(link, lastInsertedElement.nextSibling);
    } else {
      shadowRoot.appendChild(link);
    }
    window._lastElementInsertedByStyleLoader = link;
  },


  init: function () {
    /**
     * Add the main js file
     */
    var script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('crossorigin', null);
    script.setAttribute('src', localbooker.domain + '$index_js');
    document.head.appendChild(script);

    /**
     * Add the custom style link (have to wait for the shadowRoot)
     */
    if (localbooker.root.dataset.hostcss) {
      var intervalID = setInterval(function () {
        if (localbooker.root && localbooker.root.shadowRoot) {
          localbooker.insertStyleLink(localbooker.root.dataset.hostcss)
          clearInterval(intervalID)
        }
      }, 20)
    }
  },


  handlePageNotFound: () => {

    const storage = JSON.parse(sessionStorage.getItem('localbooker-root'))
    if (!storage) return

    const {nl, de, en} = storage
    const {location} = document
    const {pathname} = location

    const locales = [nl?.spa, nl?.pdp, de?.spa, de?.pdp, en?.spa, en?.pdp]

    // Do nothing when you land on the basename
    if (!locales.includes(pathname)) {
      // Fancy code... if the current location starts with the basename redirect to the basename
      locales.every(l => {
        return pathname.startsWith(l) ? !!location.replace(l) : true
      })
    }
  },

  preInit: () => {
    /**
     * This one runs only when we have #localbooker
     */
    let storage = JSON.parse(sessionStorage.getItem('localbooker-root')) || {} // storage

    let {locale, page} = localbooker.root.dataset
    locale = locale || 'nl'
    /**
     * This will set the root path of the page (pdp or spa) in localstorage (once)
     */
    if (!storage[locale]) {
      storage[locale] = {}
    }

    // !! This one should be set BEFORE the if statement !!
    const basenameSwitched = !storage[locale][page] || storage[locale][page] !== document.location.pathname

    if (basenameSwitched) {
      storage[locale][page] = document.location.pathname
    }

    storage.basenameSwitched = basenameSwitched
    sessionStorage.setItem('localbooker-root', JSON.stringify(storage))

  },


  domain: null,
  root: null,
  intervalId: null,
  counter: 0
}

/**
 * Have to set this one outside the localbooker object (dunno why)
 */
localbooker.domain = new URL(document.currentScript.src).origin

/**
 * For 404's in the localbooker path
 */
localbooker.handlePageNotFound()

/**
 * Try to launch localbooker
 */
localbooker.intervalId = setInterval(function () {

  // Set root
  localbooker.root = document.getElementById('$root')

  if (localbooker.root || ++localbooker.counter >= 100) {
    // Quit after 10 secs (can clearInterval immediately, still will run)
    clearInterval(localbooker.intervalId)
  }
  if (localbooker.root) {
    localbooker.preInit()
    localbooker.init()
  }
}, 100)
