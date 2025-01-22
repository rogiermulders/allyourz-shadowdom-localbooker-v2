import Icon from "../../molecules/Icon.jsx";

export default function TermsAndConditions({tacs}) {
  return tacs.map((usp, i) => {
    return <div key={i} className="flex mb-4">
      <div>
        <Icon name="check-circle" size="1.25em" color="#8ccbc8"/>
      </div>
      <div className="pl-4">
        <div className="font-bold">{usp.name}</div>
        <div className="mt-1">{usp.description}</div>
      </div>
    </div>
  })
}
