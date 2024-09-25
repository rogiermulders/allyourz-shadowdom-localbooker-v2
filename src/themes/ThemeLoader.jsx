import Shadow from './Shadow.jsx'
import { useEffect, useState } from 'react'

export default function ThemeLoader({ children,theme }) {

  const [css, setCss] = useState(null)

  const [unknownTheme, setUnknownTheme] = useState(false)

  /**
   * !! this HAS to be done like this as far as I know !!
   * !! Vite needs to analyze the import statements to create chunks !!
   * !! using a variable in the import statements will not work !!
   */

  useEffect(() => {
    switch (theme) {
      case 'renesseaanzee':
        import(`../sass/primereact/themes/_renesseaanzee/index.scss?inline`).then(e => setCss(e.default))
        break
      case 'nova':
        import(`../sass/primereact/themes/_nova/index.scss?inline`).then(e => setCss(e.default))
        break
      case 'allyourz':
        import(`../sass/primereact/themes/_allyourz/index.scss?inline`).then(e => setCss(e.default))
        break
      case 'provinciezeeland':
        import(`../sass/primereact/themes/_provinciezeeland/index.scss?inline`).then(e => setCss(e.default))
        break
      case 'demo':
        import(`../sass/primereact/themes/_demo/index.scss?inline`).then(e => setCss(e.default))
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