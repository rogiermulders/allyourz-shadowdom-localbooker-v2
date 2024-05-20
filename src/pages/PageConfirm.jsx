// extern
import {useContext, useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil'
import {Button} from 'primereact/button'
import {localeOptions} from "primereact/api";
import {Dialog} from "primereact/dialog";
import {Accordion, AccordionTab} from 'primereact/accordion';

// recoil and context
import {MainContext} from "../contexts/MainContext";
import selectorMainFilter from '../recoil/selectors/selectorMainFilter'
import recoilForm from "../recoil/recoilForm";
import recoilReservation from "../recoil/recoilReservation";

// services
import {col} from '../services/buttstrip'
import {toEuro} from "../services/money";

// molecules
import Icon from "../molecules/Icon.jsx";
import Loading from "../molecules/Loading.jsx";

// components
import Fees from "../components/cart/Fees.jsx";
import BookCart from '../components/cart/BookCart.jsx'
import DangerouslyInsertTextToBr from "../molecules/DangerouslyInsertTextToBr.jsx";
import recoilCartData from "../recoil/recoilCartData";
import {useNavigate} from "react-router-dom";
import PowerdBy from "../molecules/PowerdBy.jsx";
import Extras from "../components/cart/Extras.jsx";


/**
 * Little complex stuff cuz we can pay here as well
 */

export default function PageConfirm() {
  const context = useContext(MainContext)

  const navigate = useNavigate()
  const _t = context._t()
  const srollInViewRef = useRef(null)
  const [form] = useRecoilState(recoilForm)

  const [reservation, setReservation] = useRecoilState(recoilReservation)

  const {
    administration,
    bookable,
    checkIn,
    checkOut,
  } = useRecoilValue(selectorMainFilter)

  const monthNames = localeOptions('nl').monthNames
  const [accordionStatus, setAccordionStatus] = useState(0)
  const locale = localeOptions('nl').localbooker.page_confirm
  const [dialog, setDialog] = useState(false)

  const cartData = useRecoilValue(recoilCartData)
  const {totals} = cartData


  useEffect(() => {
    if(reservation.paymentStarted) {
      navigate('/')
    }
  }, [reservation.paymentStarted])

  const confirmBooking = () => {
    setReservation({...reservation,paymentStarted: true})
  }

  return <>
    <Dialog
      header={locale.error_header}
      onHide={() => setDialog(false)} visible={dialog}>
      <div>
        <DangerouslyInsertTextToBr>
          {locale.error_message}
        </DangerouslyInsertTextToBr>
        <div className="mt-10">
          <Button label="OK"/>
        </div>
      </div>
    </Dialog>
    <Loading/>

    <div ref={srollInViewRef} className="grid padding text-color">
      <div className={col({md: 8, sm: 12})}>
        <div className="h1">{_t.page_confirm.almost_ready}</div>
        <div className="h4 pt-4">{_t.page_confirm.check_booking}</div>
        <div>{_t.page_confirm.booked_by} {form.first_name} {form.last_name}</div>
        <div className="h4 pt-4">{administration.name}</div>
        <div className="h6">{bookable.name}</div>
        <div>
          <ul className="ul-none pl-0">
            <li className="grid">
              <div className="pr-3"><Icon name="bed" color="var(--text-color)" size="1.5em"/></div>
              <div>{bookable.type}</div>
            </li>
            <li className="grid">
              <div className="pr-3"><Icon name="calendar" color="var(--text-color)" size="1.5em"/></div>
              <div> {checkIn.getDate() + ' ' +
                monthNames[checkIn.getMonth()] + ' ' +
                checkIn.getFullYear() + ' - ' +
                checkOut.getDate() + ' ' +
                monthNames[checkOut.getMonth()] + ' ' +
                checkOut.getFullYear()
              }
              </div>
            </li>
          </ul>
        </div>
        {/*DETAILS*/}
        <div>
          <Accordion activeIndex={accordionStatus} onTabChange={(e) => setAccordionStatus(e.index)}>
            <AccordionTab header={_t.page_confirm.more_details}>
              <Fees cartData={cartData}/>
              {totals.sumDepositFees > 0 && <>
                <div className="mt-6 mb-2 text-bold">{_t.cart.deposit_fees}</div>
                <Extras cartData={cartData}/>
              </>}
            </AccordionTab>
          </Accordion>
        </div>
        <hr/>
        {/*TOTAAL*/}
        <div className="grid">
          <div className="w50 h6 text-bold">{_t.cart.subtotal}</div>
          <div className="w50 text-right h6 text-bold">
            {toEuro(totals.total + totals.sumDepositFees, true)}
          </div>
        </div>
        {/*NU TE VOLDOEN*/}
        <div className="pay-overview mt-4">
          <div className="grid">
            <div className="w60">{_t.cart.total}</div>
            <div className="w40 text-right text-bold">{toEuro(totals.total + totals.sumDepositFees, true)}</div>
          </div>
          <div className="grid mt-2">
            <div className="w60">{_t.cart.pay_now}</div>
            <div className="w40 text-right text-bold">{toEuro(totals.payNow, true)}</div>
          </div>
          <div className="grid mt-2">
            <div className="w60">{_t.cart.pay_later}</div>
            <div
              className="w40 text-right text-bold">{toEuro(totals.total + totals.sumDepositFees - totals.payNow, true)}</div>
          </div>
        </div>
        {/*BUTTON*/}
        <div className="grid grid-valign mt-8 mb-4">
          <div>
            <Button
              label={totals.payNow ? _t.labels.confirm_and_pay : _t.labels.confirm_booking}
              onClick={() => confirmBooking()}
            />
          </div>
          <div className="ml-8 mt-4">
            {_t.page_confirm.terms_and_conditions_1} <a
            href={_t.page_confirm.terms_and_conditions_pdf} target="_blank"
            rel="noreferrer">{_t.page_confirm.terms_and_conditions_2}</a>
          </div>
        </div>

      </div>

      <div className={col({md: 4, sm: 12})}>
        <BookCart bookable={bookable} administration={administration}/>
      </div>

    </div>
    <PowerdBy/>
  </>

}
