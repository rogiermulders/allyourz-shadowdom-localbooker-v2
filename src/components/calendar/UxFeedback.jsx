import {Button} from "primereact/button";
import {localeOption} from "primereact/api";
import {useContext} from "react";
import {MainContext} from "../../contexts/MainContext";


export default function UxFeedback({ux,checkIn,checkOut,uxClick }){
  const context = useContext(MainContext)
  const _t = context._t()

  const monthNames = localeOption('monthNames')

  return <div className="legenda">
    {ux === 'get_start_date' && <div className="">
      <i className="pi pi-exclamation-circle"/> {_t.mainFilter.choose_checkin}
    </div>}
    {ux === 'get_end_date' && <>
      <div className="mr-4">
        <i className="pi pi-exclamation-circle"/> {_t.mainFilter.choose_checkout}
      </div>
      <Button icon="pi pi-times"
              rounded outlined
              onClick={() => uxClick('clear')}
              className="p-button-secondary"/>
    </>}
    {checkIn && checkOut && <>
      <div className="mr-4">
        {checkIn.getDate()} {monthNames[checkIn.getMonth()]}&nbsp;
        - &nbsp;
        {checkOut.getDate()} {monthNames[checkOut.getMonth()]}
      </div>
      <Button icon="pi pi-times"
              rounded outlined
              onClick={() => uxClick('clear')}
              className="p-button-secondary"/>
    </>}
  </div>


}
