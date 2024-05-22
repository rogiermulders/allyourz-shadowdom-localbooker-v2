import recoilReservation from '../recoil/recoilReservation.js'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { useContext, useEffect, useState } from 'react'
import stripePayment from '../services/stripePayment.js'
import { MainContext } from '../contexts/MainContext'
import { getYmd } from '../services/dates.js'
import axios from 'axios'
import recoilForm from '../recoil/recoilForm.js'
import recoilConfig from '../recoil/recoilConfig.js'
import { classNames } from 'primereact/utils'
import selectorMainFilter from '../recoil/selectors/selectorMainFilter.js'
import { useNavigate } from 'react-router-dom'

export default function PageStripe() {
  const navigate = useNavigate()
  const context = useContext(MainContext)
  const [reservation, setReservation] = useRecoilState(recoilReservation)

  const resetReservation = useResetRecoilState(recoilReservation)
  const [form] = useRecoilState(recoilForm)
  const config = useRecoilValue(recoilConfig)
  const [stripe, setStripe] = useState(null)
  const [showWait, setShowWait] = useState(true)
  const _t = context._t()
  const {
    bookable,
    checkIn,
    checkOut,
    adults,
    children,
    babies,
    pets
  } = useRecoilValue(selectorMainFilter)

  useEffect(() => {
    // Init stripe
    window.localbookerStripe.then(stripe => {
      setStripe(stripe)
    })
  }, [])

  useEffect(() => {

    if (!stripe) return

    const onStripeCancelOrderClicked = () => {
      resetReservation()
      navigate('/')
    }

    const onStripePaymentReady = () => {
      setShowWait(false)
    }

    const onStripeError = () => {
      // resetReservation()          // remove the order
      // setConfirmDisable(false)    // disable the confirmation butt, cuz we should make new res
      // setDialog(true)             // Open the error dialog
    }


    if (!reservation.stripeClientSecret) {
      /**
       * Create a stripe payment here!
       * Now when done the reservationStatus is changed
       * so this useEffect hook runs again
       */
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
          paymentStarted: true, // still same
          reservationId: res.data.reservationId,
          reservationNumber: res.data.reservationNumber,
          stripeClientSecret: res?.data.stripeClientSecret
        })

        if (!res.data?.stripeClientSecret) {
          // You should NOT end up here
          navigate('/thankyou')
        }
      })

    } else {
      /**
       * When we HAVE a stripe secret already just open stripe again.
       * When paid redirect to thank you page
       */
      stripe.retrievePaymentIntent(reservation.stripeClientSecret).then(({ paymentIntent, error }) => {
        if (paymentIntent) {
          // Now on status do some...
          switch (paymentIntent.status) {
            case 'canceled':
              resetReservation()
              navigate('/')
              break
            // Payment OK
            case 'succeeded':
            case 'processing':
              navigate('/thankyou')
              break
            default: // requires_payment_method, requires_action
              stripePayment(
                config.basename,
                stripe,
                reservation.stripeClientSecret,
                form,
                onStripeCancelOrderClicked,
                onStripeError,
                onStripePaymentReady,
                _t
              )
          }
        } else if (error) {
          alert('ERROR')
          onStripeError()
        }
      })

    }
  }, [stripe, reservation.stripeClientSecret])

  return <div className="m-8">
    <div className="h3">{_t.stripe.page_pay || 'Betaalpagina'}</div>

    <div className={classNames(
      'mt-4', { hidden: !showWait })}>
      <i className="pi pi-spin pi-spinner mr-4" />
      {_t.stripe.wait_for_stripe || 'Wachten op stripe...'}

    </div>
  </div>

}