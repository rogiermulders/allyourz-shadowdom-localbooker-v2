var shadow_launch = {


  init: function () {
    /**
     * Add the main js file
     */
    var script = document.createElement('script');
    script.setAttribute('type', 'module');
    script.setAttribute('crossorigin', null);
    script.setAttribute('src', shadow_launch.domain + '$index_js');
    document.head.appendChild(script);

  },


  handlePageNotFound: () => {

    const storage = JSON.parse(sessionStorage.getItem('shadow_launch-root'))
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


  domain: null,
  root: null,
  intervalId: null,
  counter: 0
}

/**
 * Have to set this one outside the shadow_launch object (dunno why)
 */
shadow_launch.domain = new URL(document.currentScript.src).origin

/**
 * For 404's in the shadow_launch path
 */
shadow_launch.handlePageNotFound()

/**
 * Try to launch shadow_launch
 */
shadow_launch.intervalId = setInterval(function () {

  // Set root
  shadow_launch.root = document.getElementById('$root')

  if (shadow_launch.root || ++shadow_launch.counter >= 100) {
    // Quit after 10 secs (can clearInterval immediately, still will run)
    clearInterval(shadow_launch.intervalId)
  }
  if (shadow_launch.root) {
    shadow_launch.init()
  }
}, 100)
