import theme_css from '../sass/renesseaanzee.scss?inline'
import Shadow from './Shadow.jsx'

export default function ThemeRenesseAanZee({ children }) {

  return <Shadow theme_css={theme_css}>
    {children}
  </Shadow>

}