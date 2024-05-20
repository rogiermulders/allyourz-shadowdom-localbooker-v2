import recoilReservation from '../recoil/recoilReservation.js'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { useContext, useEffect, useState } from 'react'
import stripePayment from '../services/stripePayment.js'
import { MainContext } from '../contexts/MainContext'
import { getYmd } from '../services/dates.js'
import axios from 'axios'
import recoilForm from '../recoil/recoilForm.js'
import recoilConfig from '../recoil/recoilConfig.js'
// import scrollIntoViewWithOffset from '../services/scrollIntoViewWithOffset.js'
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
    window.localbookerStripe.then(stripe => {
      setStripe(stripe)
    })
  },[])

  useEffect(() => {

    if(!stripe) return

    const onStripeReady = () => {

    }
    const onStripePayButtonClicked = () => {

    }
    const onStripeCloseButtonClicked = () => {

      // setConfirmDisable(false)    // Removes the loading animation on the button
    }
    const onStripeError = () => {
      // resetReservation()          // remove the order
      // setConfirmDisable(false)    // disable the confirmation butt, cuz we should make new res
      // setDialog(true)             // Open the error dialog
    }


    /**
     * When we HAVE a stripe secret already just open stripe again.
     * When payed redirect to thankyou
     */
    if (reservation.stripeClientSecret) {
      stripe.retrievePaymentIntent(reservation.stripeClientSecret).then(({paymentIntent, error}) => {
        if (paymentIntent) {
          console.log(paymentIntent.status)
          // Now on status do some...
          switch (paymentIntent.status) {
            // Have to pay
            case 'requires_payment_method':
            case 'requires_action':
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

    } else {
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
          paymentStarted: true,
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

  }, [stripe, reservation.stripeClientSecret])

  return (
    <div>
      <h1>PageStripe</h1>
    </div>
  )
}