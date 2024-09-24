import Shadow from './Shadow.jsx'
import { useEffect, useState } from 'react'

export default function ThemeLoader({ children,theme }) {

  const [css, setCss] = useState(null)

  const [unknownTheme, setUnknownTheme] = useState(false)

  /**
   * !! this HAS to be done like this i think !!
   * !! Vite needs to analyze the import statements !!
   * !! using a variable in the import statements will not work !!
   */

  useEffect(() => {
    switch (theme) {
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
  }, [theme])

  if (unknownTheme) return <div>Unknown theme '{theme}'</div>

  if (!css) return null

  return <Shadow theme_css={css}>
    {children}
  </Shadow>

}