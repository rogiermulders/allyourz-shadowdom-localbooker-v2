import {useRecoilValue} from "recoil";
import recoilForm from "../recoil/recoilForm";
import Icon from "../molecules/Icon.jsx";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import recoilReservation from "../recoil/recoilReservation";
import recoilConfig from "../recoil/recoilConfig";
import PoweredBy from "../molecules/PoweredBy.jsx";
import { useContext } from 'react'
import { MainContext } from '../contexts/MainContext'

export default function PageThankYou() {
  const _t = useContext(MainContext)._t().page_thankyou
  const config = useRecoilValue(recoilConfig)
  const form = useRecoilValue(recoilForm)
  const reservation = useRecoilValue(recoilReservation)

  return <>
    <div className="p-4">
      <Card>
        <div className="h3">{_t.you_go}</div>

        <div className="pt-6">{_t.thank_you}
          <span className="font-bold ml-2">{reservation.reservationNumber}</span>.
          <span className="ml-2">{_t.receive_mail}</span>
          <span className="font-bold ml-2">{form.email}</span>.
        </div>
        <div className="h5 pt-4">{_t.start_fun}</div>
        <div className="font-bold mt-4 w10">
          <Icon name="help-circle"/>
          <span className="ml-2">{_t.need_help}</span>
        </div>
        <div className="mt-4">
          {_t.contact}
          <a className="ml-2" href="mailto:helpdesk@allyourz.nl">
            helpdesk@allyourz.nl
          </a>
        </div>
        <div className="mt-8">
          <Button label="Afsluiten" onClick={() => {
            // Keep the basename in memory
            const config_basename = config.basename

            // Just clear ALL after a booking and a hard redirect
            sessionStorage.removeItem('localbooker-persist')
            sessionStorage.removeItem('localbooker-root')

            setTimeout(() => {
              if (config_basename) {
                // when basename we're in the wild
                document.location.href = config_basename
              } else {
                // Were dev or *.localbooker.nl
                document.location.href = '/'
              }
            }, 0)
          }}/>
        </div>
      </Card>
    </div>
    <PoweredBy/>
  </>
}
