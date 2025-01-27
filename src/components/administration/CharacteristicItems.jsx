import { useMemo } from 'react'
import Icon from '../../molecules/Icon.jsx'

const MAX_CHARACTERISTICS = 12

export default function CharacteristicItems({ facilityGroups }) {

  const characteristicItems = useMemo(() => {
    return facilityGroups
      .slice(0, MAX_CHARACTERISTICS)
      .map(facilityGroup => {
          return {
            icon: facilityGroup.facilities[0].icon,
            label: facilityGroup.facilities[0].name
          }
        }
      )
  }, [facilityGroups])

  // return null
  return (
    <div className="grid">
      {characteristicItems.map((fg, i) => {
        return <div key={i} className="col-4 flex p-1">
          <Icon name={fg.icon} size={'1.2em'} />
          <div className="ml-6">{fg.label}</div>
        </div>
      })}
    </div>
  )
}