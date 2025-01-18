import { col, getBp } from '../../services/buttstrip'
import Carousel from '../carousel/Carousel'
import Usps from './Usps.jsx'
import SpecialFacilities from './SpecialFacilities.jsx'
import { useContext, useRef } from 'react'
import { MainContext } from '../../contexts/MainContext'
import Icon from '../../molecules/Icon.jsx'
import ForwardDialog from '../../molecules/ForwardDialog.jsx'
import { Button } from 'primereact/button'
import { useRecoilValue } from 'recoil'
import recoilConfig from '../../recoil/recoilConfig.js'

export default function Administration({ administration }) {
  const _t = useContext(MainContext)._t()
  const dialogRef = useRef()
  const config = useRecoilValue(recoilConfig)

  let email = config.pid === 'zeeland.com' ? 'helpdesk@localbooker.nl' : 'helpdesk@allyourz.nl'

  return <>

    <ForwardDialog ref={dialogRef} />

    <div className="text-color pl-8 pr-8">
      <div className="grid">
        <div className={col({ def: 10, xs: 9 })}>
          <span className="h3"> {administration.name}</span>
        </div>
        <div className={col({ def: 2, xs: 3 })}>

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
        </div>
      </div>

      <div className="location"></div>

      <div className="carousel">
        <Carousel images={administration.images} aspectRadio={{ xs: '2-1', sm: '5-2' }[getBp()] || '2-1'} />
      </div>

      <div className="mt-8 m-4">
        <SpecialFacilities specialFacilities={administration.specialFacilities} />
      </div>

      <div className="h5 m-4">
        {administration.oneLiner}
      </div>

      <div className="mt-8 m-6 text-pre-wrap">
        {administration.shortDescription}
        <div
          onClick={() => dialogRef.current.open(
            {
              header: administration.name,
              content: <div
                className="p-10"
                dangerouslySetInnerHTML={{
                  __html: administration.description.replaceAll('\n', '<br/>')
                }} />
            })}
          className="mt-8
              text-underline
              flex pointer
              hover_highlight">
          {_t.page_pdp.full_description || 'Uitgebreide omschrijving'}
          <Icon name="chevron-right" size="1.3em" style={{ marginLeft: '0.3em' }} />

        </div>
      </div>


      <div className="mt-8 m-4">
        <Usps usps={administration.usps} />
      </div>

    </div>
  </>

}
