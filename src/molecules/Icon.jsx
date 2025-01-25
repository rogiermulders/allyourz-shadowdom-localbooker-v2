/**
 *
 * @param name
 * @param size
 * @param color
 * @param light
 * @param style
 * @param className
 * @returns {JSX.Element}
 * @constructor
 */
export default function Icon({name, size, color, light, style, className}) {
  className = className || ''
  size = size || '1em'

  // no color given
  if (!color) {
    color = light ? 'var(--primary-color-text)' : 'var(--text-color)'
  } else if(color.charAt(0) !== '#'){
    color = 'var(--' + color + ')'
   }

  if(!style) {
    style = {}
  }



  return <svg className={className} style={{...style,width: size, height: size, fill: color}}>
    <use xlinkHref={`#icon-${name}`}/>
  </svg>
}
