import Icon from "../../molecules/Icon.jsx";

export default function Usps({usps}) {
  return usps.map((usp, i) => {
    return <div key={i} style={{display: 'flex', marginBottom:'0.5em'}}>
      <div>
        <Icon name={usp.icon} size={'1.50em'} color="#8ccbc8"/>
      </div>
      <div style={{margin:'0.25em 0 0 0.5em'}}>
        <div className="font-bold">{usp.name}</div>
        <div className="mt-1">{usp.description}</div>
      </div>
    </div>
  })
}
