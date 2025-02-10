import Icon from '../../molecules/Icon.jsx'
import { useContext } from 'react'
import { MainContext } from '../../contexts/MainContext.tsx'

export default function BreakfastIncluded() {

  const _t = useContext(MainContext)._t()

  return <div className="mt-4 p-3 pl-8 pr-6 inline-flex border-05"
              style={{ backgroundColor: '#ffffff' }}>
    <Icon className="h6" name="crossaint" color="#ef5656" />
    <div className="ml-5">{_t.labels.breakfast_included || 'Ontbijt inbegrepen'} </div>
  </div>

}