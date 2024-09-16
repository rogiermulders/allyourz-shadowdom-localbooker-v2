import theme_css from '../sass/provinciezeeland.scss?inline'
import Shadow from './Shadow.jsx'

export default function ThemeProvincieZeeland({ children }) {

  return <Shadow theme_css={theme_css}>
    {children}
  </Shadow>

}