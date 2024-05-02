import Icon from "../../molecules/Icon.jsx";

export default function SpecialFacilities({specialFacilities}) {

  return <ul className="ul-none m-0 p-0">
    {specialFacilities.map((e, i) => {
      return <li key={i} className="lb-tooltip li-vert pl-2 pr-2">
        <Icon name={e.icon} size="1.5em" color="#393e4f"/>
        <span className="tooltiptext">{e.name}</span>
      </li>
    })}
  </ul>

}
