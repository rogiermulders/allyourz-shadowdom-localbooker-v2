import recoilReservation from '../recoil/recoilReservation.js'
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import { useContext, useEffect, useState } from 'react'
import { loadStripe } from '@stripe/stripe-js/pure'
import stripePayment from '../services/stripePayment.js'
import { MainContext } from '../contexts/MainContext'
import recoilForm from '../recoil/recoilForm.js'
import recoilConfig from '../recoil/recoilConfig.js'
import { classNames } from 'primereact/utils'

import { useNavigate } from 'react-router-dom'
import Layout from './Layout.jsx'

export default function PageStripe() {
  const navigate = useNavigate()
  const context = useContext(MainContext)
  const reservation = useRecoilValue(recoilReservation)

  const resetReservation = useResetRecoilState(recoilReservation)
  const [form] = useRecoilState(recoilForm)
  const config = useRecoilValue(recoilConfig)
  const [stripe, setStripe] = useState(null)
  const [showWait, setShowWait] = useState(true)
  const _t = context._t()

  useEffect(() => {
    // Init stripe
    loadStripe.setLoadParameters({ advancedFraudSignals: false })
    const localbookerStripe = loadStripe(import.meta.env.VITE_APP_STRIPE_API_KEY, { locale: context.hostLocale })
    localbookerStripe.then(stripe => {
      setStripe(stripe)
    })
  }, [context.hostLocale])

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
      // Strange

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

  return <Layout>
    <div className="m-8">
      <div className="h3">{_t.stripe.page_pay || 'Betaalpagina'}</div>
      <div className={classNames(
        'mt-4', { hidden: !showWait })}>
        <i className="pi pi-spin pi-spinner mr-4" />
        {_t.stripe.wait_for_stripe || 'Wachten op stripe...'}
      </div>
    </div>
  </Layout>
}