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

    if(storage.hasBaseName) return

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

    let {locale, page, basename} = localbooker.root.dataset
    locale = locale || 'nl'

    /**
     * When the basename is not set, we will use the current location.pathname
     */
    if(basename){

      let pathname = document.location.pathname

      // Add / when not there
      const realPathName = pathname.split('/').pop() === '' ? pathname : pathname + '/'
      const testBaseName = basename.split('/').pop() === '' ? basename : basename + '/'

      // check if test is in realPathname
      if(realPathName.includes(testBaseName)){
        // remove everything after the testBaseName string
        basename = realPathName.split(testBaseName)[0] + testBaseName
      } else {
        basename = realPathName
      }
    } else {
      basename = document.location.pathname
    }

    /**
     * This will set the root path of the page (pdp or spa) in localstorage (once)
     * Also sets if a basename is defined by the user
     */
    if (!storage[locale]) {
      storage[locale] = {}
      storage.hasBaseName =  !!localbooker.root.dataset.basename
    }

    // !! This one should be set BEFORE the if statement !!
    const basenameSwitched = !storage[locale][page] || storage[locale][page] !== basename

    if (basenameSwitched) {
      storage[locale][page] = basename
      // NEW SESSION!
      sessionStorage.removeItem('localbooker-persist')
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
