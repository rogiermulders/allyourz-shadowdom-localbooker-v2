import { useEffect, useState } from 'react'

export default function useCssLoader(theme) {
  const [css, setCss] = useState(null)

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
        break;
      default:
        import(`../sass/nova.scss?inline`).then(e => setCss(e.default))
    }

  }, [theme])

  return css ? css : null

}