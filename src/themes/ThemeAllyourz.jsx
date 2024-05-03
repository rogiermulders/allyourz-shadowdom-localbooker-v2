import theme_css from '../sass/allyourz.scss?inline'
import Shadow from './Shadow.jsx'

export default function ThemeAllyourz({ children }) {

  return <Shadow theme_css={theme_css}>
    {children}
  </Shadow>

}