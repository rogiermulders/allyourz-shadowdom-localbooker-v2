import Icon from '../../molecules/Icon.jsx'

export default function LiContent({icon, label}) {


  return <>
    <div>
      <Icon name={icon} size="1.25em" color="text-color-secondary"/>
    </div>
    <div className="ml-4 mr-3 text-color-secondary">
      {label}
    </div>
  </>

}