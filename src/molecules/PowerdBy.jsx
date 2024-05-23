import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function PowerdBy() {
  const [pv, setPv] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handle = setInterval(() => {
      if(window.localbooker_preview !== pv) {
        setPv(window.localbooker_preview)
      }
    },1000)
    return () => {
      clearInterval(handle)
    }
  }, [pv])

  return <div className="grid">
    <div className="col-6 pb-8 pl-8">
      {/*Test Hotel Allyourz Middelburg*/}
      {pv &&
        <span style={{cursor: 'pointer'}} onClick={() => navigate('/hotel-allyourz-middelburg')}>
          Hotel Allyourz Middelburg (Testing)
        </span>}
    </div>
    <div className="col-6 pr-8 pb-8 text-right">
      <a href="https://allyourz.nl" target="_blank" rel="noreferrer">powered by allyourz</a>
    </div>
  </div>

}