export default function Address({address}){
  return <>
    <div className="text-xl ml-2 mb-2">Adres- en contactgegevens</div>
    <div className="grid mt-1">
      <div className="col-1">
        <svg style={{width: '1em', height: '1em', marginLeft: '0.5em'}}>
          <use xlinkHref={`/assets/images/icon-selection.svg#icon-map-pin`}/>
        </svg>
      </div>
      <div className="col-11">{address.street} {address.houseNumber}</div>
    </div>
    <div className="grid">
      <div className="col-1"></div>
      <div className="col-11">{address.zipCode} {address.city}</div>
    </div>
    <div className="grid">
      <div className="col-1"></div>
      <div className="col-11">{address.region}</div>
    </div>
    <div className="grid">
      <div className="col-1">
        <svg style={{width: '1em', height: '1em', marginLeft: '0.5em'}}>
          <use xlinkHref={`/assets/images/icon-selection.svg#icon-mail`}/>
        </svg>
      </div>
      <div className="col-11"><a href="mailto:helpdesk@allyourz.nl" target="_blank" rel="noreferrer">Stuur een e-mail</a></div>
    </div>
  </>
}
