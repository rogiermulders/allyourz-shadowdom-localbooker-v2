import Administration from '../components/administration/Administration.jsx'
import Bookables from '../components/bookables/Bookables.jsx'
import { useContext, useEffect, useRef, useState } from 'react'
import PdpCart from '../components/cart/PdpCart.jsx'
import { col, lte, gte } from '../services/buttstrip'
import axios from 'axios'
import { useRecoilValue } from 'recoil'
import { MainContext } from '../contexts/MainContext'
import recoilConfig from '../recoil/recoilConfig'
import { useNavigate, useParams } from 'react-router-dom'
import PoweredBy from '../molecules/PoweredBy.jsx'
import scrollIntoViewWithOffset from '../services/scrollIntoViewWithOffset'
import { Accordion, AccordionTab } from 'primereact/accordion'
import Icon from '../molecules/Icon.jsx'
import { Button } from 'primereact/button'

export default function Pdp({ administration_slug }) {
  const navigate = useNavigate()
  const params = useParams()
  const context = useContext(MainContext)
  const refContext = useRef(context)
  const _t = context._t()
  const srollInViewRef = useRef()
  const bookablesRef = useRef()
  const config = useRecoilValue(recoilConfig)

  const [administration, setAdministration] = useState(null)
  const [accordionStatus, setAccordionStatus] = useState(null)

  useEffect(() => {
    if (config.page !== 'pdp') {
      // When the localbooker TAG is a pdp we do not want a scroll
      scrollIntoViewWithOffset(srollInViewRef.current, config.offset, config.scroll)
    }
  }, [config.offset, config.page, config.scroll])

  useEffect(() => {
    const slug = administration_slug || params.administration_slug
    axios.post('/v1/administration/get', {
      locale: context.hostLocale,
      slug,
      preview: window.localbooker_preview // You can set this one in your console
    }).then(res => {
      refContext.current.setMaxPets(res.data.max_pets)
      setAdministration(res.data)
    })
  }, [administration_slug, context.hostLocale, params.administration_slug])

  return <>

    <div ref={srollInViewRef} style={{ position: 'relative' }} className={lte('sm') ? 'grid' : 'grid padding'}>

      <div className={col({ def: 8, xs: 12, sm: 12 })}>
        {/*Naar Zoek & Boek*/}
        {(gte('md')) && false &&
          <div style={{ position: 'absolute', marginTop: '-1.5em', width: '300px', left: '1em' }}>
          {/*<div style={{ position: 'absolute', marginTop: '-1.5em', width: '200px', textAlign:'right', right: '1em' }}>*/}
            <Button
              outlined
              style={{ backgroundColor: 'var(--surface-a)' }}
              icon="pi pi-angle-double-left"
              iconPos="left"
              label={
                _t.labels.search_and_book || 'Terug naar ZOEK & BOEK'
              }
              // This one should work (navigate('/') cuz of the router basename
              onClick={() => navigate('/')}
            />
          </div>}

        {administration && <>

          {/*THE ADMIN WHEN HOST ASKS FOR CONTENT*/}
          {config.content && <Administration administration={administration} />}

          {/*THE CART WHEN SMALL*/}
          {lte('sm') && <PdpCart
            administration={administration}
            pdpScrollToFirstBookabe={() => scrollIntoViewWithOffset(bookablesRef, config.offset, config.scroll)} />}
          {/*THE BOOKABLES (ALWAYS)*/}
          <div ref={bookablesRef}>
            {administration && <Bookables administration={administration} />}
          </div>

          <div className="mt-8 ml-4 mr-4">
            <Accordion activeIndex={accordionStatus} onTabChange={(e) => setAccordionStatus(e.index)}>
              {administration.cancellation &&
                <AccordionTab header={_t.page_pdp.cancel_conditions || 'Annuleringsvoorwaarden'}>
                  <p dangerouslySetInnerHTML={{ __html: administration.cancellation.replaceAll('\n', '<br/>') }} />
                </AccordionTab>}
              {administration.payInAdvance &&
                <AccordionTab header={_t.page_pdp.payment_conditions || 'Betalingsvoorwaarden'}>
                  <p dangerouslySetInnerHTML={{ __html: administration.payInAdvance.replaceAll('\n', '<br/>') }} />
                </AccordionTab>}
              {administration.checkInStartTime && administration.checkInEndTime && administration.checkOutEndTime &&
                <AccordionTab header={_t.page_pdp.check_in_out_info || 'Check-in & Check-out info'}>
                  <div className="grid">
                    <div className="col-1">
                      <Icon name={'log-in'} size={'1.50em'} />
                    </div>
                    <div className="col-11">
                      <div className="text-bold">{_t.page_pdp.check_in || 'Inchekken'}</div>
                      {_t.page_pdp.between || 'Tussen'} {administration.checkInStartTime} {_t.page_pdp.uur_en || 'uur en'} {administration.checkInEndTime} {_t.page_pdp.hour || 'uur'}
                    </div>
                  </div>
                  <div className="grid">
                    <div className="col-1">
                      <Icon name={'log-out'} size={'1.50em'} />
                    </div>
                    <div className="col-11">
                      <div className="text-bold">{_t.page_pdp.check_out || 'Uitchekken'}</div>
                      {_t.page_pdp.before || 'Voor'} {administration.checkOutEndTime} {_t.page_pdp.hour || 'uur'} </div>
                  </div>
                </AccordionTab>}
              {administration.houseRules && <AccordionTab header={_t.page_pdp.house_rules || 'Huisregels'}>
                <p dangerouslySetInnerHTML={{ __html: administration.houseRules.replaceAll('\n', '<br/>') }} />
              </AccordionTab>}

              {administration.termsAndConditionsDocument?.url &&
                <AccordionTab header={_t.page_pdp.tc_admin_label}>
                  <p>
                    {_t.page_pdp.tc_admin_body} <a href={administration.termsAndConditionsDocument.url} target="_blank"
                                                   rel="noreferrer">{_t.page_pdp.tc_admin_link_label}</a>
                  </p>
                </AccordionTab>}
            </Accordion>
          </div>

        </>
        }
      </div>

      {/*THE CART*/}
      {gte('md') && <div className={col({ def: 4 })}>
        {/*THE STICKY PART OF IT ALL*/}
        {administration &&
          // + 8 cuz we have a padding 8
          <div style={{ position: 'sticky', top: (config.offset + 8 + 32) }}>

            <PdpCart
              administration={administration}
              pdpScrollToFirstBookabe={() => {
                scrollIntoViewWithOffset(bookablesRef, config.offset, config.scroll)
              }}
            />
          </div>
        }
      </div>
      }
    </div>
    <PoweredBy />
  </>


}
