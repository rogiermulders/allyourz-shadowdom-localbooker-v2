import { useMemo } from 'react'

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
  return (
    <div>
      <p>CharacteristicItems</p>
    </div>
  )
}