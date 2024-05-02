import Icon from "../../molecules/Icon.jsx";

export default function Properties({properties}){

  return properties.map(p => {
    return <li key={p.icon}>
      <Icon name={p.icon} size={'1em'}/>
      {p.label}
    </li>
  })
}
