// extern
import {useContext, useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue, useResetRecoilState} from 'recoil'
import {Button} from 'primereact/button'
import {localeOptions} from "primereact/api";
import {Dialog} from "primereact/dialog";
import {Accordion, AccordionTab} from 'primereact/accordion';
import axios from "axios";
// recoil and context
import {MainContext} from "../contexts/MainContext";
import selectorMainFilter from '../recoil/selectors/selectorMainFilter'
import recoilForm from "../recoil/recoilForm";
import recoilConfig from "../recoil/recoilConfig";
import recoilReservation from "../recoil/recoilReservation";
// services
import {col} from '../services/buttstrip'
import {toEuro} from "../services/money";
import {getYmd} from "../services/dates";
import scrollIntoViewWithOffset from "../services/scrollIntoViewWithOffset";
import stripePayment from "../services/stripePayment";
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
  const config = useRecoilValue(recoilConfig)
  const [reservation, setReservation] = useRecoilState(recoilReservation)
  const resetReservation = useResetRecoilState(recoilReservation);
  const {
    administration,
    bookable,
    checkIn,
    checkOut,
    adults,
    children,
    babies,
    pets
  } = useRecoilValue(selectorMainFilter)

  const monthNames = localeOptions('nl').monthNames
  const [accordionStatus, setAccordionStatus] = useState(0)
  const [stripe, setStripe] = useState(null)

  const [confirmDisabled, setConfirmDisable] = useState(true) // !! default disabled.. onMount eneabled
  const [confirmLoading, setConfirmLoading] = useState(false)
  const locale = localeOptions('nl').localbooker.page_confirm
  const [dialog, setDialog] = useState(false)

  const cartData = useRecoilValue(recoilCartData)
  const {totals} = cartData
  /**
   * onMount
   */
  useEffect(() => {

    scrollIntoViewWithOffset(srollInViewRef, config.offset, config.scroll)

    window.localbookerStripe.then(stripe => {
      setStripe(stripe)

      if (!reservation.stripeClientSecret) {
        // No stripe secret we just can confirm
        setConfirmDisable(false)
      } else {
        // Get the Stripe payment status from the Stripe server
        stripe.retrievePaymentIntent(reservation.stripeClientSecret).then(({paymentIntent, error}) => {
          if (paymentIntent) {
            // Now on status do some...
            switch (paymentIntent.status) {
              // Have to pay
              case 'requires_payment_method':
                setConfirmDisable(true)
                setConfirmLoading(true)
                // Pay
                stripePayment(
                  config.basename,
                  stripe,
                  reservation.stripeClientSecret,
                  form,
                  onStripePayButtonClicked,
                  onStripeCloseButtonClicked,
                  onStripeReady,
                  onStripeError,
                  _t
                )
                break
              // Payment OK
              case 'succeeded':
              case 'processing':
                navigate('/thankyou')
                break
              // Error. Payment cancelled or some
              default:
                onStripeError()
                break
            }
          } else if (error) {
            onStripeError()
          }
        })
      }
    })
  }, [reservation.stripeClientSecret])


  const onStripeReady = () => {
    setConfirmLoading(false)    // Removes the loading animation on the button
  }
  const onStripePayButtonClicked = () => {
    context.setLoading(true)    // Sets the loading overlay on the page
  }
  const onStripeCloseButtonClicked = () => {
    setConfirmDisable(false)    // Removes the loading animation on the button
  }
  const onStripeError = () => {
    resetReservation()          // remove the order
    context.setLoading(false)   // Disable the loading overlay
    setConfirmDisable(false)    // disable the confirmation butt, cuz we should make new res
    setDialog(true)             // Open the error dialog
  }

  const confirmBooking = () => {

    setConfirmDisable(true)
    setConfirmLoading(true)

    /**
     * When we HAVE a stripe secret already just open stripe again.
     * This happens on page refreshes
     */
    if (reservation.stripeClientSecret) {
      stripePayment(
        config.basename,
        stripe,
        reservation.stripeClientSecret,
        form,
        onStripePayButtonClicked,
        onStripeCloseButtonClicked,
        onStripeReady,
        onStripeError,
        _t
      )
      return;
    }

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
      locale: 'nl',
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

    axios.post('/v1/booking/create', payload).then(res => {

      // Store
      setReservation({
        reservationId: res.data.reservationId,
        reservationNumber: res.data.reservationNumber,
        stripeClientSecret: res.data.stripeClientSecret
      })

      // What to do after the creation of the booking
      const pay_or_thank_you = res.data?.stripeClientSecret ? 'pay' : 'thankyou'

      switch (pay_or_thank_you) {
        /**
         * When need to pay we stay here until payed
         */
        case 'pay':
          // And Pay
          stripePayment(
            config.basename,
            stripe,
            res.data.stripeClientSecret,
            form,
            onStripePayButtonClicked,
            onStripeCloseButtonClicked,
            onStripeReady,
            onStripeError,
            _t
          )
          break;

        /**
         * When no need to pay go thank you
         */
        case 'thankyou':
          navigate('/thankyou')
          break;
      }
    })
  }

  return <>
    <Dialog
      header={locale.error_header}
      appendTo={context.shadowRoot}
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
              loading={confirmLoading}
              disabled={confirmDisabled}
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
