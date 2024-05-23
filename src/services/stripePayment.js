/**
 * !! Fancy code because Stripe does NOT work inside the shadowRoot
 * So create some overlay in the host DOM tree and move the Stripe
 * shit into there. Handle the clicks etc. here though
 */
export default function stripePayment(
  basename,
  stripe,
  stripeClientSecret,
  form,
  onCancelOrderClicked,
  onStripeError,
  onPaymentReady,
  _t
) {
  const buttonStyle = 'top:12px;position:absolute;border:solid 1px #e6e6e6;padding:8px 16px;border-radius:6px;font-size:16px;cursor:pointer;'
  let elements, payment, handler

  /**
   * This one runs when the 'Klik hier om te betalen' button is clicked
   */
  const payClicked = () => {

    stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
        return_url: document.location.origin + basename
      }
    }).then(result => {
      // This one fires on an error
      onStripeError(result)
      cleanup()
    })
  }

  /**
   * This one runs when the 'Klik hier om deze boeking te annuleren' button is clicked
   */
  const cancelOrderClicked = () => {

    cleanup()
    onCancelOrderClicked()
  }

  /**
   * Create some html OUTSIDE the shadowRoot
   * So far Stripe does not seem to work in the shadowRoot
   * This function returns the stripe container
   */
  const addStripeParentAndContainerToDocumentBody = () => {
    const stripeParent = document.createElement('div')
    const stripeContainer = document.createElement('div')
    stripeParent.setAttribute('id', 'localbooker-stripe-parent')
    stripeParent.setAttribute('style', 'position:fixed;width:100%;height:100%;top:0;left:0;right:0;bottom:0;background-color:rgba(0,0,0,0.5);z-index:1000000000;')
    stripeContainer.setAttribute('id', 'localbooker-stripe')
    stripeContainer.setAttribute('style', 'position:absolute;top:30%;left:50%;border-radius: 8px;padding:16px;background-color: white;width: 30vw;transform: translateY(-30%) translateX(-50%);')
    stripeParent.append(stripeContainer)
    document.body.append(stripeParent)
    return stripeContainer
  }

  /**
   * Should clean everything up
   */
  const cleanup = () => {
    payment.unmount()
    const s = document.getElementById('localbooker-stripe-parent')
    const p = s.parentNode
    p.removeChild(s)
    clearInterval(handler)
  }

  /**
   * Function to animate the button
   */
  const animator = (butt, func, timeout) => {
    if(!timeout) timeout = 0
    let text = butt.innerHTML, i = 0
    handler = setInterval(() => {
      i++
      console.log(i)
      butt.innerHTML = text + '.'.repeat(i)
    },200)
    window.addEventListener('unload', () => {
      clearInterval(handler)
    })
    setTimeout(() => {
      func()
    }, timeout)
  }

  /**
   * Function to create a button
   */
  const butt = (text, style, func, delay) => {

    const button = document.createElement('button')
    button.append(document.createTextNode(text))
    button.setAttribute('style', buttonStyle + style)
    button.onclick = (e) => {
      if(delay) {
        animator(e.target, func, delay)
      } else {
        func()
      }
    }
    return button
  }

  // Add the overlay and container to the
  const stripeContainer = addStripeParentAndContainerToDocumentBody()

  // Create the elements
  elements = stripe.elements({
    clientSecret: stripeClientSecret
  })

  // Create the payment
  elements.create('payment', {
    defaultValues: {
      billingDetails: {
        name: form.first_name + ' ' + form.last_name,
        email: form.email,
        phone: form.phone_number,
        address: {
          line1: form.street,
          line2: form.house_number,
          city: form.city,
          country: form.country,
          postal_code: form.zip_code
        }
      }
    }
  })

  // Get the payment element
  payment = elements.getElement('payment')
  // And mount
  payment.mount(stripeContainer)

  //////////////////////////////////////////////////////////////////////////////
  // After the mount add the buttons
  // So below is our custom HTML
  //////////////////////////////////////////////////////////////////////////////
  payment.on('ready', () => {

    ////////////////////////////////////////////////////////////////////////////
    // Pay row
    ////////////////////////////////////////////////////////////////////////////
    let div = document.createElement('div')
    div.id = 'localbooker-stripe-pay-wrapper'
    div.setAttribute('style', 'position:relative;height:48px')
    // Klik hier om te betalen
    div.append(butt(
      _t.stripe.pay,
      'background-color:#6D6E78;color:white',
      payClicked, 1))
    // Sluit dit venster
    div.append(butt(
      _t.stripe.close_stripe,
      'background-color:white;color:#333333;right:0',
      () => {
        document.getElementById('localbooker-stripe-cancel-wrapper').style.display = 'block'
        document.getElementById('localbooker-stripe-pay-wrapper').style.display = 'none'
      }))
    // --
    stripeContainer.append(div)

    ////////////////////////////////////////////////////////////////////////////
    // Cancel row
    ////////////////////////////////////////////////////////////////////////////
    div = document.createElement('div')
    div.id = 'localbooker-stripe-cancel-wrapper'
    div.setAttribute('style', 'position:relative;height:48px;display:block;display:none')
    // Klik hier om deze boeking te annuleren
    div.append(butt(
      _t.stripe.cancel_button || 'Klik hier om deze boeking te annuleren',
      'background-color:steelblue;color:white',
      cancelOrderClicked, 2000))
    // Ga terug
    div.append(butt(_t.stripe.goback_button || 'Ga terug',
      'background-color:white;color:#333333;right:0px',
      () => {
        document.getElementById('localbooker-stripe-cancel-wrapper').style.display = 'none'
        document.getElementById('localbooker-stripe-pay-wrapper').style.display = 'block'
      }
    ))
    // --
    stripeContainer.append(div)
    onPaymentReady()
  })
}
