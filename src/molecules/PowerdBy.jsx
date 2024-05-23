import { useNavigate } from 'react-router-dom'

export default function PowerdBy() {
  const navigate = useNavigate()

  return <div className="grid">
    <div className="col-6 pb-8">
      {/*Test Hotel Allyourz Middelburg*/}
      <span style={{cursor:'default', opacity:'0'}} onClick={()=> navigate('/d7afc128-c19e-4dd5-8856-d4375baea240')}>ham</span>
    </div>
  <div className="col-6 pr-8 pb-8 text-right">
    <a href="https://allyourz.nl" target="_blank" rel="noreferrer">powered by allyourz</a>
  </div>
  </div>

}