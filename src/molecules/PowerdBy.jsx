import { useNavigate } from 'react-router-dom'

export default function PowerdBy() {
  const navigate = useNavigate()

  return <div className="grid">
    <div className="col-6 pb-8">
      <span style={{cursor:'default', opacity:'0'}} onClick={()=> navigate('hotel-allyourz-middelburg')}>hay</span>
    </div>
  <div className="col-6 pr-8 pb-8 text-right">
    <a href="https://allyourz.nl" target="_blank" rel="noreferrer">powered by allyourz</a>
  </div>
  </div>

}