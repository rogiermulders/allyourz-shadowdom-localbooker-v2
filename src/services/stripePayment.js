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
  onPayClicked,
  onCloseClicked,
  onStripeReady,
  onError,
  _t
) {
  const buttonStyle = 'top:12px;position:absolute;border:solid 1px #e6e6e6;padding:8px 16px;border-radius:6px;font-size:16px;cursor:pointer;'
  let elements, payment

  const payClicked = () => {

    /**
     * Tell mamma we clicked pay
     */
    if(onPayClicked){
      onPayClicked()
    }

    stripe.confirmPayment({
      elements,
      confirmParams: {
        // Return URL where the customer should be redirected after the PaymentIntent is confirmed.
        return_url: document.location.origin + basename,
      },
    }).then(result => {
      onError(result)
      payment.unmount()
      cleanup()

    })
  }


  /**
   * Create some html OUTSIDE the shadowRoot
   * So far Stripe does not seem to work in the shadowRoot
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

  const createPayButton = () => {
    const button = document.createElement('button')
    button.append(document.createTextNode(_t.stripe.pay))
    button.setAttribute('style', buttonStyle + 'background-color:#6D6E78;color:white;')
    button.onclick = () => {
      payClicked()
    }
    return button
  }

  const cleanup = () => {
    document.getElementById('localbooker-stripe-parent').remove()

  }

  const closeClicked = () => {
    confirm("Press a button!");
    payment.unmount()
    cleanup()
    onCloseClicked()
  }

  const createCloseButton = () => {
    const button = document.createElement('button')
    button.append(document.createTextNode(_t.stripe.close_stripe))
    button.setAttribute('style', buttonStyle + 'background-color:white;color:#333333;right:0px')
    button.onclick = () => closeClicked()
    return button
  }

  // Add the overlay and container to the
  const stripeContainer = addStripeParentAndContainerToDocumentBody()

  elements = stripe.elements({
    clientSecret: stripeClientSecret
  })

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
  });

  // Get the payment element
  payment = elements.getElement('payment')
  // And mount
  payment.mount(stripeContainer)

  // After the mount add the buttons
  payment.on('ready', () => {
    const div = document.createElement('div')
    div.setAttribute('style','position:relative;height:48px')
    div.append(createPayButton())
    div.append(createCloseButton())
    stripeContainer.append(div)
    onStripeReady()
  })
}
