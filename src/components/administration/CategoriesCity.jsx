import Icon from "../../molecules/Icon.jsx";

export default function CategoriesCity({categories,city}) {
  return <div className="flex" style={{flexWrap:'wrap'}}>
    {categories.map(e => {
      return <div key={e.icon} className="flex">
        <Icon name={e.icon} size="1.2em"/>
        <div className="pt-1 pl-1 pr-2">{e.label}</div>
      </div>
    })}
    <div className="flex">
      <Icon name="map-pin" size="1.2em"/>
      <div className="pt-1 pl-1">{city}</div>
    </div>
  </div>

}