export default function Icon({name, size, color, light, style}) {

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

  return <svg style={{...style,width: size, height: size, fill: color}}>
    <use xlinkHref={`#icon-${name}`}/>
  </svg>
}
