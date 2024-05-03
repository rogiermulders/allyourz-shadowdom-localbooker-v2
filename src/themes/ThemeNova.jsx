import theme_css from '../sass/nova.scss?inline'
import Shadow from './Shadow.jsx'

export default function ThemeNova({ children }) {

  return <Shadow theme_css={theme_css}>
    {children}
  </Shadow>

}