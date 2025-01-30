import { MainContext } from '../../contexts/MainContext.tsx'
import { useContext } from 'react'

const LBurl = (window.localbooker.domain || document.location.origin )

const usps = {
  banContact: {
    alt: 'Bancontact',
    height: 30,
    src: `${LBurl}/assets/images/payment/bancontact.svg`,
    width: 57
  },
  giroPay: {
    alt: 'Giropay',
    height: 30,
    src: `${LBurl}/assets/images/payment/giropay.svg`,
    width: 60
  },
  iDeal: {
    alt: 'iDeal',
    height: 35,
    src: `${LBurl}/assets/images/payment/ideal.svg`,
    width: 40
  },
  mastercard: {
    alt: 'Mastercard',
    height: 35,
    src: `${LBurl}/assets/images/payment/mastercard.svg`,
    width: 46
  },
  visa: {
    alt: 'Visa',
    height: 30,
    src: `${LBurl}/assets/images/payment/visa.svg`,
    width: 70
  }
}

const PaymentUsps = ({ requiresDeposit }) => {
  const context = useContext(MainContext)
  const _t = context._t()

  const imageUsps = (context.hostLocale === 'de') ?
    [usps.giroPay, usps.visa, usps.mastercard, usps.iDeal, usps.banContact] :
    [usps.iDeal, usps.visa, usps.mastercard, usps.banContact, usps.giroPay]

  const lines = [
    { usp: _t.page_pdp.usp_1 },
    { usp: _t.page_pdp.usp_2 },
    { usp: _t.page_pdp.usp_3 },
    { usp: (requiresDeposit ? _t.page_pdp.usp_4_pay_now : _t.page_pdp.usp_4) }
  ]

  return <>
    {lines.map((usp, i) => {
      return <div key={i} className="flex mb-3">
        <div>
          <i className="pi pi-check mt-1" style={{ color: '#8ccbc8' }}></i>
        </div>
        <div className="pl-4">
          <div className="mt-0">{usp.usp}</div>
        </div>
      </div>
    })}

    {requiresDeposit &&
      <div className="flex justify-center mt-8">
        {imageUsps.map((imageUsp, i) =>
          <img className="mr-1 ml-1"
               key={i}
               alt={imageUsp.alt}
               src={imageUsp.src}
               style={{
                 height: imageUsp.height * 0.8,
                 width: imageUsp.width * 0.8
               }} />
        )}
      </div>

    }

  </>
}

export default PaymentUsps
