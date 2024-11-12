// extern
import { useContext, useEffect, useRef, useState } from 'react'
import { useRecoilState, useRecoilValue } from 'recoil'
import { useNavigate } from 'react-router-dom'
import recoilCartData from '../recoil/recoilCartData'
import axios from 'axios'
import recoilConfig from '../recoil/recoilConfig.js'

// primereact
import { Button } from 'primereact/button'
import { localeOptions } from 'primereact/api'
import { Dialog } from 'primereact/dialog'
import { Accordion, AccordionTab } from 'primereact/accordion'

// recoil and context
import { MainContext } from '../contexts/MainContext'
import selectorMainFilter from '../recoil/selectors/selectorMainFilter'
import recoilForm from '../recoil/recoilForm'
import recoilReservation from '../recoil/recoilReservation'

// services
import { col } from '../services/buttstrip'
import { toEuro } from '../services/money'
import { getYmd } from '../services/dates.js'

// molecules
import Icon from '../molecules/Icon.jsx'
import Loading from '../molecules/Loading.jsx'
import PoweredBy from '../molecules/PoweredBy.jsx'
import DangerouslyInsertTextToBr from '../molecules/DangerouslyInsertTextToBr.jsx'

// components
import Fees from '../components/cart/Fees.jsx'
import BookCart from '../components/cart/BookCart.jsx'
import Extras from '../components/cart/Extras.jsx'

/**
 * Little complex stuff cuz we can pay here as well
 */

export default function PageConfirm() {
  const context = useContext(MainContext)
  const config = useRecoilValue(recoilConfig)
  const navigate = useNavigate()
  const _t = context._t()
  const scrollInViewRef = useRef(null)
  const [form] = useRecoilState(recoilForm)

  const [reservation, setReservation] = useRecoilState(recoilReservation)

  const {
    administration,
    bookable,
    checkIn,
    checkOut,
    adults,
    babies,
    children,
    pets

  } = useRecoilValue(selectorMainFilter)

  const monthNames = localeOptions(context.hostLocale).monthNames
  const [accordionStatus, setAccordionStatus] = useState(0)
  const locale = localeOptions(context.hostLocale).localbooker.page_confirm
  const [dialog, setDialog] = useState(false)

  const cartData = useRecoilValue(recoilCartData)
  const { totals } = cartData

  useEffect(() => {
    if (reservation.paymentStarted) {
      navigate('/')
    }
  }, [reservation.paymentStarted])

  /**
   * BOOK!
   */
  const confirmBooking = () => {
    const personalDetails = {
      valid: true,
      firstName: form.first_name,
      lastName: form.last_name,
      email: form.email,
      phoneNumber: form.phone_number,
      zipCode: form.zip_code,
      houseNumber: form.house_number,
      street: form.street,
      city: form.city,
      country: form.country,
      extraMessage: form.extra_message
    }

    /**
     * Create the payload to make the booking
     */
    const payload = {
      locale: config.locale,
      pid: config.pid,
      personalDetails,
      products: [
        {
          id: bookable.id,
          guests: {
            adults,
            babies,
            children,
            pets
          },
          quantity: 1,
          checkIn: getYmd(checkIn),
          checkOut: getYmd(checkOut),
          options: [...form.options]
        }
      ]
    }
    context.setLoading(true)
    axios.post('/v1/booking/create', payload).then(res => {

      // Store
      setReservation({
        reservationId: res.data.reservationId,
        reservationNumber: res.data.reservationNumber,
        stripeClientSecret: res?.data.stripeClientSecret
      })
      context.setLoading(false)
      // The server adds the stripeClientSecret to the response
      // when there is a need to pay
      if (res.data?.stripeClientSecret) {
        navigate('/')
      } else {
        navigate('/thankyou')
      }
    })
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
          <Button label="OK" />
        </div>
      </div>
    </Dialog>
    <Loading />

    <div ref={scrollInViewRef} className="grid padding text-color">
      <div className={col({ md: 8, sm: 12 })}>
        <div className="h1">{_t.page_confirm.almost_ready}</div>
        <div className="h4 pt-4">{_t.page_confirm.check_booking}</div>
        <div>{_t.page_confirm.booked_by} {form.first_name} {form.last_name}</div>
        <div className="h4 pt-4">{administration.name}</div>
        <div className="h6">{bookable.name}</div>
        <div>
          <ul className="ul-none pl-0">
            <li className="grid">
              <div className="pr-3"><Icon name="bed" color="var(--text-color)" size="1.5em" /></div>
              <div>{bookable.type}</div>
            </li>
            <li className="grid">
              <div className="pr-3"><Icon name="calendar" color="var(--text-color)" size="1.5em" /></div>
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
              <Fees cartData={cartData} />
              {totals.sumDepositFees > 0 && <>
                <div className="mt-6 mb-2 text-bold">{_t.cart.deposit_fees}</div>
                <Extras cartData={cartData} />
              </>}
            </AccordionTab>
          </Accordion>
        </div>
        <hr />
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
              label={totals.payNow ? _t.page_confirm.pay : _t.page_confirm.confirm}
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

      <div className={col({ md: 4, sm: 12 })}>
        <BookCart bookable={bookable} administration={administration} />
      </div>

    </div>
    <PoweredBy />
  </>

}
