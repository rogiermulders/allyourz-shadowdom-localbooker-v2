import Icon from '../../molecules/Icon.jsx'
import { useContext } from 'react'
import { MainContext } from '../../contexts/MainContext.tsx'

export default function BreakfastIncluded({width, border}) {

  const _t = useContext(MainContext)._t()
  width = width || 'auto'
  border = border || 0

  return <div className="p-2 pl-4 pr-4 inline-flex justify-center border-025"
              style={{ backgroundColor: 'white', width, border }}>
    <Icon className="h6" name="crossaint" color="#ef5656" />
    <div className="ml-3">{_t.labels.breakfast_included} </div>
  </div>

}