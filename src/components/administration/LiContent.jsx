import Icon from '../../molecules/Icon.jsx'

/**
 *
 * @param icon
 * @param label
 * @param onClick
 * @param style
 * @param className
 * @param color !! name of the variable in the css
 * @returns {JSX.Element}
 * @constructor
 */
export default function LiContent({icon, label, onClick, style, className, color}) {

  onClick = onClick || (() => {})
  style = style || {}
  className = 'flex ' + className || 'flex'
  color = color || 'text-color-secondary'

  return <div className={className} onClick={onClick} style={style}>
    <div>
      <Icon className="font-normal" name={icon} size="1.25em" color={color}/>
    </div>
    <div className="ml-3 mr-3 mt-1" style={{color:`var(--${color}`}}>
      {label}
    </div>
  </div>

}