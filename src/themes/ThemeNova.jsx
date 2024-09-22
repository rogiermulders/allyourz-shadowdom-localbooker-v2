import Shadow from './Shadow.jsx'
import { useState, useEffect } from 'react'


export default function ThemeNova({ children }) {
  const [css, setCss] = useState(null)

  useEffect(() => {
    import('../sass/nova.scss?inline').then(e => setCss(e.default))
  }, [])

  if (!css) return null

  return <Shadow theme_css={css}>
    {children}
  </Shadow>

}