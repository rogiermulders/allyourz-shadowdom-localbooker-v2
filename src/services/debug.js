function plotBreakpint(s, sw, ih) {

  if(!s || !sw) return;

  if(import.meta.env.PROD) return

  /**
   * Set some debby breakpoint
   */
  let d = window.document.getElementById('localbooker-breakpoint')
  if (!d) {
    d = window.document.createElement('div')
    d.setAttribute('id', 'localbooker-breakpoint')
    d.style.cssText = "color:#dddddd; position:absolute;top:0px;margin:5px;font-size:16px;font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";"
    window.document.body.appendChild(d)
  }

  d.innerHTML = `${s} (${sw}/${ih})`

}
export {plotBreakpint}
