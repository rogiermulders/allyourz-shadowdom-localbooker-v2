import {useRecoilValue, useResetRecoilState} from "recoil";
import recoilForm from "../recoil/recoilForm";
import Icon from "../molecules/Icon.jsx";
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import recoilReservation from "../recoil/recoilReservation";
import {useNavigate} from "react-router-dom";
import recoilCartData from "../recoil/recoilCartData";
import recoilConfig from "../recoil/recoilConfig";
import PoweredBy from "../molecules/PoweredBy.jsx";


export default function PageThankYou() {

  const navigate = useNavigate()
  const config = useRecoilValue(recoilConfig)
  const form = useRecoilValue(recoilForm)
  const reservation = useRecoilValue(recoilReservation)
  const resetReservation = useResetRecoilState(recoilReservation)
  const resetCartData = useResetRecoilState(recoilCartData)

  return <>
    <div className="p-4">
      <Card>
        <div className="h3">Je gaat op reis!</div>
        <div className="pt-6">Bedankt voor je boeking met boekingsnummer{' '}
          <span className="font-bold">{reservation.reservationNumber}</span>.
          Je ontvangt zo een bevestigingsmail van je boeking op{' '}
          <span className="font-bold">{form.email}</span>.
        </div>
        <div className="h5 pt-4">Laat de voorpret maar beginnen!</div>
        <div className="font-bold mt-4 w10"><Icon name="help-circle"/> Hulp nodig?</div>
        <div className="mt-4">Neem dan contact op via <a href="mailto:helpdesk@allyourz.nl">helpdesk@allyourz.nl</a>
        </div>
        <div className="mt-8">
          <Button label="Afsluiten" onClick={() => {
            const config_basename = config.basename

            // Just clear ALL after a booking and a hard redirect
            sessionStorage.removeItem('localbooker-persist')
            sessionStorage.removeItem('localbooker-root')

            setTimeout(() => {

              if (document.location.pathname === config_basename) {
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
