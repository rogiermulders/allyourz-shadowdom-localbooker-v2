import {useContext, useRef} from "react";
import FakeDropdown from "../../molecules/FakeDropdown.jsx";
import AdministrationCalendar from "../calendar/AdministrationCalendar.jsx";
import {useRecoilValue} from "recoil";
import selectorMainFilter from "../../recoil/selectors/selectorMainFilter";
import {localeOption} from "primereact/api";
import WhoContent from "../mainfilter/WhoContent.jsx";
import {MainContext} from "../../contexts/MainContext";
import {toEuro} from "../../services/money";
import {Button} from "primereact/button";
import CalendarDialog from "../calendar/CalendarDialog.jsx";
import {gte} from "../../services/buttstrip";


export default function PdpCart({administration, pdpScrollToFirstBookabe}) {
  const calendarDialogRef = useRef(null)
  const context = useContext(MainContext)
  const _t = context._t()
  const refWhen = useRef(null)
  const refWho = useRef(null)

  const {checkIn, checkOut, adults, children, babies, pets} = useRecoilValue(selectorMainFilter)

  const monthNames = localeOption('monthNames')

  const whenTitle = (checkIn && checkOut) ?
    checkIn.getDate() + ' ' + monthNames[checkIn.getMonth()] + ' - ' + checkOut.getDate() + ' ' + monthNames[checkOut.getMonth()] :
    _t.labels.select_dates


  const tot = adults + children + babies
  const whoTitle = tot + ' ' + _t.labels[tot > 1 ? 'guests' : 'guest'] +
    (pets ? `, ${pets} ${_t.labels[pets > 1 ? 'pets' : 'pet']}` : '')

  /**
   * Return
   */
  return <div className="text-color p-8">
    <CalendarDialog ref={calendarDialogRef}/>
    {/*Selecteer Datums*/}
    {gte('md') && <div className="h3">{_t.page_pdp.select_dates}</div>}

    {/*Aankomst & vertrek*/}
    <div className="h5 mt-4 mb-2">{_t.page_pdp.checkin_checkout}</div>
    <FakeDropdown ref={refWhen} placeholder={whenTitle} onOpen={() => refWho.current.close()}>
      <div style={{margin: 'auto', width: 'max-content', marginTop:'0.2em'}}>
        <AdministrationCalendar
          administration_id={administration.id}
          onClose={() => refWhen.current.close()}
        />
      </div>
    </FakeDropdown>

    {/*Hoeveel personen*/}
    <div className="h5 mt-4 mb-2">{_t.page_pdp.how_many}</div>
    <FakeDropdown ref={refWho} placeholder={whoTitle} onOpen={() => refWhen.current.close()}>
      <WhoContent administration={administration} usedIn={'PdpCart'}/>
    </FakeDropdown>

    {/*Vanaf /nacht*/}
    <div className="flex-center mt-4">
      <div className="text-sm-4 mt-2">{_t.labels.from_night}</div>
      <div className="text-sm-8 ml-2">{toEuro(context.cheapest, true)}</div>
    </div>

    {/*Button*/}
    <div className="text-center mt-4">
      <Button label={checkIn && checkOut ? _t.labels.choose_your_room : _t.labels.select_dates}
              onClick={() => {
                if (checkIn && checkOut) {
                  pdpScrollToFirstBookabe()
                } else {
                  calendarDialogRef.current.open(administration.id)
                }
              }}
              style={{width: '60%'}}/>
    </div>
  </div>
}
