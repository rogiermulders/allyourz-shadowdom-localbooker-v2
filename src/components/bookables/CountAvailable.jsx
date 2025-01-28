import Icon from '../../molecules/Icon.jsx'
import { useContext, useRef, useState } from 'react'
import { MainContext } from '../../contexts/MainContext.tsx'
import CalendarDialog from '../calendar/CalendarDialog.jsx'
import selectorMainFilter from '../../recoil/selectors/selectorMainFilter.js'
import { useRecoilValue } from 'recoil'
import { localeOption } from 'primereact/api'

export default function CountAvailable({ countActive, administration }) {
  const context = useContext(MainContext)
  const _t = context._t()
  const [mover, setMover] = useState(false)
  const calendarDialogRef = useRef()
  const { checkIn, checkOut, adults, children } = useRecoilValue(selectorMainFilter)
  const monthNames = localeOption('monthNamesShort')

  return <>

    <CalendarDialog ref={calendarDialogRef} />

    {/*Big top text*/}
    <div className="h4 text-center">
      {_t.page_pdp.found_n_bookables
        .replace('{{count}}', countActive)
        .replace('{{s}}', countActive > 1 ? 's' : '')}
    </div>

    <div className="mt-8 flex justify-center">
      {/*Calendar butt*/}

      {(checkIn && checkOut) ?

        <div className="flex">
          <div className="text-bold">{checkIn.getDate()}</div>
          <div className="text-bold ml-2">{monthNames[checkIn.getMonth()]}</div>
          {' - '}
          <div className="text-bold">{checkOut.getDate()}</div>
          <div className="text-bold ml-2 mr-2">{monthNames[checkOut.getMonth()]}</div>
          met
          <div className="text-bold ml-2">{(adults + children) + ' gasten'}</div>
          <div className="flex pointer"
               onMouseOver={() => setMover(true)}
               onMouseOut={() => setMover(false)}
               onClick={() => calendarDialogRef.current.open(
                 administration.id
               )}>
            <Icon className="font-normal ml-4" name="calendar" size="1.25em" color={mover ? '#ef5656' : ''} />
            <div className="ml-3 mr-3 mt-0 text-underline" style={{ color: mover ? '#ef5656' : null }}>
              aanpassen
            </div>
          </div>

        </div>
        :
        <>
          <div className="text-bold flex pointer"
               onMouseOver={() => setMover(true)}
               onMouseOut={() => setMover(false)}
               onClick={() => calendarDialogRef.current.open(
                 administration.id
               )}>
            <div>
              <Icon className="font-normal" name="calendar" size="1.25em" color={mover ? '#ef5656' : ''} />
            </div>
            <div className="ml-3 mr-3 mt-1 text-underline" style={{ color: mover ? '#ef5656' : null }}>
              Kies een datum
            </div>
          </div>
          <div className="mt-1">voor beschikbaarheid.</div>
        </>}


      {/*Text*/}
    </div>
  </>

}