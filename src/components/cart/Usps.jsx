export default function Usps({usps}) {
  return usps.map((usp, i) => {
    return <div key={i} className="flex mb-3">
      <div>
        <i className="pi pi-check mt-1" style={{ color: '#8ccbc8'}}></i>
      </div>
      <div className="pl-4">
        <div className="mt-0">{usp.usp}</div>
      </div>
    </div>
  })
}
