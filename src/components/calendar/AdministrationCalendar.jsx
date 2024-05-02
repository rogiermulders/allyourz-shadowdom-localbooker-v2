import {Calendar} from 'primereact/calendar';
import {useEffect, useState, useRef} from "react";
import {classNames} from "primereact/utils";
import {createRange, getYmd} from "../../services/dates";
import axios from "axios";
import recoilMainFilter from "../../recoil/recoilMainFilter";
import selectorMainFilter from "../../recoil/selectors/selectorMainFilter";
import {useRecoilState, useRecoilValue} from "recoil";
import UxFeedback from "./UxFeedback.jsx";


export default function AdministrationCalendar(
  {
    administration_id,
    onClose,
    width,
  }) {
  const ref = useRef()
  // Recoil
  const [, setMainFilter] = useRecoilState(recoilMainFilter)
  const {checkIn, checkOut} = useRecoilValue(selectorMainFilter)

  // UX
  const [ux, setUx] = useState('get_start_date')
  const [reload, setReload] = useState(false)

  // Thes have the date as yyyy-mm-dd
  const [serverAvailability, setServerAvailability] = useState([])
  // This one gets filled when you click your first date (yyyy-mm-dd)
  const [workAvailability, setWorkAvailability] = useState([])
  const [stayUntil, setStayUntil] = useState([])

  const [disabledDates, setDisabledDates] = useState([])  // Calendar
  const [minDate, setMinDate] = useState(new Date())      // Calendar
  const [maxDate, setMaxDate] = useState(new Date())      // Calendar
  const [selectedDates, setSelectedDates] = useState([])  // Calendar
  const [viewDate, setViewDate] = useState(new Date())    // Calendar

  useEffect(() => {

    const range = createRange(checkIn, checkOut)

    if (range.length) {
      // WhenContent we have a range it's easy. no need to go to server
      setSelectedDates(range)
      setMinDate(range[0])
      setMaxDate(range[range.length - 1])
      setDisabledDates([])
      setViewDate(range[0])
      setUx('we_have_range')

    } else {

      // No range get the data from the server
      let a = [], dis = [], m = '2000-01-01'
      axios.post('/v1/administration/calendar-availability', {
          admin_id: administration_id
        }
      ).then(res => {
        res.data.forEach(e => {
          a[e.from] = e.till
          const t = e.till[e.till.length - 1]
          if (t > m) {
            m = t
          }
        })

        /**
         * Disable the non used dates
         */
        let loopDate = new Date(m)
        loopDate.setDate(loopDate.getDate() + 1)
        for (let d = new Date(); d <= loopDate; d.setDate(d.getDate() + 1)) {
          if (!a[getYmd(d)]) {
            dis.push(new Date(d.getTime()))
          }
        }

        /**
         * Now set them states
         */
        setSelectedDates([])
        setMinDate(new Date())
        setMaxDate(new Date(m))
        setDisabledDates(dis)
        setServerAvailability(a)
        setWorkAvailability(a)

      })
    }
  }, [administration_id, checkIn, checkOut, reload])


  /**
   * Handles the UX
   */
  const uxClick = (type, e) => {

    let loopDate, dis
    switch (type) {
      case 'clear':
        setReload(old => !old)
        setMainFilter(old => {
          return {
            ...old, when: {
              checkIn: null,
              checkOut: null
            }
          }
        })
        setUx('get_start_date')
        break;
      case 'calendar':
        switch (ux) {
          case 'get_start_date':
            let sa = serverAvailability[getYmd(e.value[0])]
            loopDate = maxDate
            loopDate.setDate(loopDate.getDate() + 1)
            const su = []
            dis = []
            // Loop for the disabled dates
            for (let d = new Date(); d <= loopDate; d.setDate(d.getDate() + 1)) {
              if (
                getYmd(d) !== getYmd(e.value[0]) &&
                !sa.includes(getYmd(d))
              ) {
                dis.push(new Date(d.getTime()))
              } else {
                if (getYmd(d) !== getYmd(e.value[0])) {
                  su[getYmd(d)] = true
                }
              }
            }
            setSelectedDates(e.value)
            setWorkAvailability([])
            setStayUntil(su)
            setDisabledDates(dis)
            setUx('get_end_date')
            break

          case 'get_end_date':
            /**
             * Here the end date is clicked
             * Just update recoil
             */
            setMainFilter(old => {
              return {
                ...old, when: {
                  checkIn: e.value[0],
                  checkOut: e.value[1]
                }
              }
            })
            setUx('we_have_range')
            if (onClose) {
              onClose()
            }
            break;
          default:
        }
        break;
      default:

    }
  }

  /**
   * The template
   */
  const dateTemplate = (d) => {
    return <div className={classNames('datefield', {
        avail: workAvailability[getYmd(d)],
        'stay-til': stayUntil[getYmd(d)]
      }
    )}>
      <div className="day">{d.day}</div>
    </div>
  }


  return <div className="localbooker-calendar">

    {/*CALENDAR*/}
    {<>
      <div onClick={(e) => e.stopPropagation()}>
        <Calendar
          ref={ref}
          className="calendar-small ay-datepicker"
          // Some hacking to get the calendar to the right size
          // width is an attribute of the Component
          pt={{
            root: {
              style: {
                width: width || null,
                fontSize: (ref.current?.getElement().clientWidth / 312.5) + 'em'
              }
            },
            table: {
              style: {
                margin: 'auto',
                width: '100%',
              }
            },
            panel: {
              style: {
                margin: 'auto',
              }
            },
          }}
          value={selectedDates}
          selectionMode="multiple"
          inline={true}
          numberOfMonths={1}
          disabledDates={disabledDates}
          minDate={minDate}
          maxDate={maxDate}
          onViewDateChange={e => {
            setViewDate(e.value)
          }}
          viewDate={viewDate}
          onChange={(e) => uxClick('calendar', e)}
          dateTemplate={dateTemplate}
        />
      </div>

      {/*UX*/}
      <UxFeedback ux={ux} checkIn={checkIn} checkOut={checkOut} uxClick={uxClick}/>
    </>}

  </div>

}
