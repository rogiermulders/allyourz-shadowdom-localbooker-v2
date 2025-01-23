import Icon from '../../molecules/Icon.jsx'
import ForwardDialog from '../../molecules/ForwardDialog.jsx'
import { useRef } from 'react'

export default function CartTermsAndConditions({ admin }) {

  const ref = useRef()


  const cancelHead = admin.cancellationThreshold === '0_document' ? 'pdp_cancelation_rules' : 'pdp_free_cancelation'

  const cancelText = () => {
    if(admin.cancellationThreshold.includes('hours')) {
      return 'cancellation_threshold_hours'?.replace('{{hours}}', parseInt(admin.cancellationThreshold).toString())
    }
    if(admin.cancellationThreshold.includes('days')){
      return 'cancellation_threshold_days'?.replace('{{days}}', parseInt(admin.cancellationThreshold).toString())
    }
    return `pdp_cancellation_default_text_${admin.type}`
  }


  const tc = [
    {
      head: cancelHead,
      name: cancelText(),
      content: admin.cancellation
    },
    {
      head: 'Betaal later',
      name: 'Bekijk voorwaarden',
      content: admin.payInAdvance
    }
  ]


  const content = (text) => <div className="p-8" style={{
    whiteSpace: 'pre-line',
    lineHeight: '1.2em',
    fontSize: '1.1em'
  }}>
    {text}
  </div>

  return tc.map((item, i) => {
    return <>
      <ForwardDialog ref={ref} />
      <div key={i} className="flex mb-4">
        <div>
          <Icon name="check-circle" size="1.25em" color="#8ccbc8" />
        </div>
        <div className="pl-4">
          <div className="font-bold">{item.head}</div>
          <button
            onClick={() => {
              ref.current.open({
                header: item.head,
                content: content(item.content)
              })
            }}
            className="no-style mt-1 flex">
            <span className="">{item.name}</span>
            <i className="pi pi-angle-right mt-1" />
          </button>
        </div>
      </div>
    </>
  })
}
