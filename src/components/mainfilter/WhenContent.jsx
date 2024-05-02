import {useEffect, useRef, useState} from "react";
import {Calendar} from "primereact/calendar";
import {useRecoilState, useRecoilValue} from "recoil";
import recoilMainFilter from "../../recoil/recoilMainFilter";
import {createRange} from "../../services/dates";
import selectorMainFilter from "../../recoil/selectors/selectorMainFilter";
import UxFeedback from "../calendar/UxFeedback.jsx";
import {lte} from "../../services/buttstrip";

export default function WhenContent({onSelected, onClose}) {

  const ref = useRef()

  const [ux, setUx] = useState('get_start_date')
  const [, setMainFilter] = useRecoilState(recoilMainFilter);
  const {checkIn, checkOut} = useRecoilValue(selectorMainFilter)
  const [calendarMindate, setCalendarMindate] = useState(new Date())
  const [selectedDates, setSelectedDates] = useState([])

  useEffect(() => {
    if (checkIn && !checkOut) {
      setCalendarMindate(checkIn)
      setSelectedDates([checkIn])
      setUx('get_end_date')
    } else if (checkIn && checkOut) {
      setSelectedDates(createRange(checkIn, checkOut))
      setUx('we_have_range')
    } else {
      setUx('get_start_date')
      setSelectedDates([])
    }
  }, [checkIn, checkOut])

  // Helper
  const update = (name, value) => {
    const prop = {}
    prop[name] = value
    setMainFilter(old => {
      return {...old, when: {...old.when, ...prop}}
    })
  }

  const uxClick = (type, e) => {
    switch (type) {
      case 'clear':
        if(onClose){
          // close when both are checked
          if(checkIn && checkOut){
            onClose()
          }
        }
        setCalendarMindate(new Date())
        update('checkIn', null)
        update('checkOut', null)
        break;
      case 'date-clicked':
        switch (ux) {
          case 'get_start_date':
            setCalendarMindate(e.value[0])
            update('checkIn', e.value[0])
            break
          case 'get_end_date':
            update('checkOut', e.value[1])
            onSelected()
            break;
          default:
        }
    }
  }
  /**
   * The template
   */
  const dateTemplate = (d) => {
    return <div className="datefield">
      <div className="day">{d.day}</div>
    </div>
  }

  return <div ref={ref} className="localbooker-calendar">
    {ref.current && <>
      <div>
        {/*This Calendar is much less complicated than the one on the PDP cuz it does not have open and closed days etc*/}
        <Calendar
          value={selectedDates}
          // WEEEE!!! Some nice hack to resize the calendar (using em)
          // When > sm, so md and up we show 2 cals so divide size by 2
          style={{fontSize: (ref.current?.clientWidth / 19.95 / (lte('sm') ? 1 : 2)) + 'px'}}
          pt={{
            'group': {
              'style': {
                border: 0
              }
            }
          }}
          className="calendar-small w100 ay-datepicker"
          selectionMode="multiple"
          inline={true}
          minDate={calendarMindate}
          onChange={e => uxClick('date-clicked', e)}
          dateTemplate={dateTemplate}
          // When sm or less show 1 month
          numberOfMonths={lte('sm') ? 1 : 2}
        >
        </Calendar>
      </div>
      <div className="pb-4 pt-4">
        <UxFeedback checkIn={checkIn} checkOut={checkOut} ux={ux} uxClick={uxClick}/>
      </div>
    </>}
  </div>
}
