import { Button } from 'primereact/button'
import { useContext, useRef } from 'react'
import ForwardDialog from '../../molecules/ForwardDialog.jsx'
import { MainContext } from '../../contexts/MainContext.tsx'
import { useRecoilValue } from 'recoil'
import recoilConfig from '../../recoil/recoilConfig.js'


export default function HelpButton() {
  const _t = useContext(MainContext)._t()
  const dialogRef = useRef()
  const config = useRecoilValue(recoilConfig)
  let email = config.pid === 'zeeland.com' ? 'helpdesk@localbooker.nl' : 'helpdesk@allyourz.nl'
  return <>
    <ForwardDialog ref={dialogRef} />

    <Button
      className="float-r"
      label={_t.page_pdp.need_help || 'Hulp nodig?'}
      size="small"
      outlined
      onClick={() => dialogRef.current.open(
        {
          size: 'small',
          header: _t.page_pdp.need_help || 'Hulp nodig?',
          content: <div className="p-10">
            {_t.page_pdp.help_txt_1}
            <br />
            <br />
            {_t.page_pdp.help_txt_2}
            <br />
            <br />
            <a href={`mailto:${email}`}>
              <Button
                icon="pi pi-envelope"
                outlined
                label={_t.page_pdp.send_mail}
              />
            </a>
          </div>

        }
      )}
    />
  </>
}
