import Icon from '../../molecules/Icon.jsx'
import ForwardDialog from '../../molecules/ForwardDialog.jsx'
import { useContext, useRef } from 'react'
import { MainContext } from '../../contexts/MainContext'

export default function CartTermsAndConditions({ admin }) {

  const ref = useRef()
  const context = useContext(MainContext)
  const _t = context._t().page_pdp

  const items = []

  /**
   * Cancellation policies
   */
  if (admin.cancellation && !!admin.cancellationThreshold) {
    const cancelHead = admin.cancellationThreshold === '0_document' ? _t.cancelation_rules : _t.free_cancelation

    const cancelText = () => {
      if (admin.cancellationThreshold.includes('hours')) {
        return _t.cancellation_threshold_hours?.replace('{{hours}}', parseInt(admin.cancellationThreshold).toString())
      }
      if (admin.cancellationThreshold.includes('days')) {
        return _t.cancellation_threshold_days?.replace('{{days}}', parseInt(admin.cancellationThreshold).toString())
      }
      return _t[`cancellation_default_text_STAYS`]
    }
    // Add to items
    items.push({ head: cancelHead, name: cancelText(), content: admin.cancellation })
  }

  /**
   * Pay in advance
   */
  if (admin.depositPercentage < 100 && admin.payInAdvance) {
    const payInAdvance = () => {
      if (admin.depositPercentage) {
        return _t.pay_in_advance_situation_percentage?.replace('{{percentage}}', admin.depositPercentage.toString())
      }
      if (admin.payInAdvanceSituation) {
        return _t.pay_in_advance_situation_email
      }
      if (admin.payInAdvanceSituation === 'arrival') {
        return _t.pay_in_advance_situation_arrival
      }
      return _t.pay_in_advance_situation_default_text
    }

    // Add to items
    items.push({ head: _t.pdp_no_deposit, name: payInAdvance(), content: admin.payInAdvance })
  }


  /**
   * HTML
   */
  return <>
    <ForwardDialog ref={ref} />
    {items.map((item, i) => {
      return <div key={i} className="flex mb-4">
        <div>
          <Icon name="check-circle" size="1.25em" color="#8ccbc8" />
        </div>
        <div className="pl-4">
          <div className="font-bold">{item.head}</div>
          <button
            onClick={() => {
              // Open the popup
              ref.current.open({
                header: item.head,
                content: <div className="p-8" style={{
                  whiteSpace: 'pre-line',
                  lineHeight: '1.2em',
                  fontSize: '1.1em'
                }}>
                  {item.content}
                </div>
              })
            }}
            className="no-style mt-1 flex">
            <span className="">{item.name}</span>
            <i className="pi pi-angle-right mt-1" />
          </button>
        </div>
      </div>
    })}
  </>

}
