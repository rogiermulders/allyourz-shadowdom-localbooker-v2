import { useContext } from 'react'
import { MainContext } from '../../contexts/MainContext.tsx'

export default function CountBookables({ accomodation }) {

  const label = useContext(MainContext)._t()
    .page_spa['count_bookables_' + (accomodation.isHotel ? 'hotel' : 'other')]

  return <div className="p-2 pl-4 pr-4"
              style={{
                borderRadius: '0.25em',
                backgroundColor: 'var(--surface-a)'
              }}>
    {accomodation.totalBookables} {label}
  </div>

}