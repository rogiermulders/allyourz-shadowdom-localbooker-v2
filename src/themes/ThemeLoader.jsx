import Shadow from './Shadow.jsx'
import { useEffect, useState } from 'react'

export default function ThemeLoader({ children }) {

  const [css, setCss] = useState(null)

  const [unknownTheme, setUnknownTheme] = useState(false)

  /**
   * !! this HAS to be done like this i think !!
   * !! Vite needs to analyze the import statements !!
   * !! using a variable in the import statements will not work !!
   */

  useEffect(() => {
    switch (import.meta.env.VITE_APP_THEME) {
      case 'renesseaanzee':
        import(`../sass/renesseaanzee.scss?inline`).then(e => setCss(e.default))
        break
      case 'nova':
        import(`../sass/nova.scss?inline`).then(e => setCss(e.default))
        break
      case 'allyourz':
        import(`../sass/allyourz.scss?inline`).then(e => setCss(e.default))
        break
      case 'provinciezeeland':
        import(`../sass/provinciezeeland.scss?inline`).then(e => setCss(e.default))
        break
      default:
        setUnknownTheme(true)
    }
  }, [])

  if (unknownTheme) return <div>Unknown theme '{import.meta.env.VITE_APP_THEME}'</div>

  if (!css) return null

  return <Shadow theme_css={css}>
    {children}
  </Shadow>

}