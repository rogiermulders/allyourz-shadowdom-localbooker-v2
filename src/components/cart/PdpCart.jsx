import { useContext, useRef } from 'react'
import FakeDropdown from '../../molecules/FakeDropdown.jsx'
import AdministrationCalendar from '../calendar/AdministrationCalendar.jsx'
import { useRecoilState, useRecoilValue } from 'recoil'
import selectorMainFilter from '../../recoil/selectors/selectorMainFilter'
import { localeOption } from 'primereact/api'
import WhoContent from '../mainfilter/WhoContent.jsx'
import { MainContext } from '../../contexts/MainContext'
import { toEuro } from '../../services/money'
import { Button } from 'primereact/button'
import CalendarDialog from '../calendar/CalendarDialog.jsx'
import { lte } from '../../services/buttstrip'
import { useNavigate } from 'react-router-dom'
import recoilConfig from '../../recoil/recoilConfig.js'
import CartTermsAndConditions from './CartTermsAndConditions.jsx'
import HelpButton from '../administration/HelpButton.jsx'
import PaymentUsps from './PaymentUsps.jsx'
import Icon from '../../molecules/Icon.jsx'
import recoilMainFilter from '../../recoil/recoilMainFilter.js'

export default function PdpCart({ administration, pdpScrollToFirstBookabe, countBookables }) {

  const calendarDialogRef = useRef(null)
  const context = useContext(MainContext)
  const config = useRecoilValue(recoilConfig)
  const [, setMainFilter] = useRecoilState(recoilMainFilter)
  const navigate = useNavigate()
  const _t = context._t()
  const refWhen = useRef(null)
  const refWho = useRef(null)

  const { checkIn, checkOut, adults, children, babies, pets } = useRecoilValue(selectorMainFilter)

  // Wait for the bookables to be loaded
  if (countBookables === null) return

  const monthNames = localeOption('monthNames')

  const whenTitle = (checkIn && checkOut) ?
    checkIn.getDate() + ' ' + monthNames[checkIn.getMonth()] + ' - ' + checkOut.getDate() + ' ' + monthNames[checkOut.getMonth()] :
    _t.labels.select_dates


  const tot = adults + children + babies
  const whoTitle = tot + ' ' + _t.labels[tot > 1 ? 'guests' : 'guest'] +
    (pets ? `, ${pets} ${_t.labels[pets > 1 ? 'pets' : 'pet']}` : '')

  const butt = () => <Button
    style={{ backgroundColor: 'var(--surface-a)' }}
    iconPos="lef"
    className="w100"
    outlined
    label={
      _t.labels.search_and_book || 'Terug naar ZOEK & BOEK'
    }
    onClick={() => {
      context.setForceScroll(true)
      navigate('/')
    }}
  />


  /**
   * Return
   */
  return <>

    <CalendarDialog ref={calendarDialogRef} />

    <div className="text-color pl-8 pr-8 pb-2" style={{ position: 'relative' }}>

      {countBookables === 0 ?
        <>
          {/* Geen bookables */}
          <div className="mt-8" style={{ border: 'solid 1px var(--surface-b)', padding: '1em', borderRadius: '0.5em' }}>
            <div className="font-bold h6">
              <Icon name="exclamation-circle" size="1.3em" style={{ verticalAlign: 'middle' }} className="mr-2" />
              {_t.cart.no_availability}
            </div>
            <Button className="w100 mt-8"
                    label={`${_t.cart.nav_to_zip} ${administration.address.search.name}`}
                    onClick={() => {
                      setMainFilter(old => {
                        return { ...old, where: {
                            disabled: old.where.disabled,
                            regionId: '0',
                            destinationZip: administration.address.search.zip,
                            range: 2
                          } }
                      })
                      navigate('/')
                    }}
            />
          </div>
        </> :
        <>
          {/* Selecteer Datums */}
          {lte('sm') && <div className="p-4"></div>}
          <div className="grid">
            <div className="col-6 pl-0">
              <div className="h5">{_t.page_pdp.select_dates}</div>
            </div>
            <div className="col-6 pr-0">
              <HelpButton />
            </div>
          </div>

          {/*Aankomst & vertrek*/}
          <div className="font-bold h01 mt-4 mb-1">{_t.page_pdp.checkin_checkout}</div>
          <FakeDropdown ref={refWhen} placeholder={whenTitle} onOpen={() => refWho.current.close()}>
            <div style={{ margin: 'auto', width: 'max-content', marginTop: '0.2em' }}>
              <AdministrationCalendar
                administration_id={administration.id}
                onClose={() => refWhen.current.close()}
              />
            </div>
          </FakeDropdown>

          {/*Hoeveel personen*/}
          <div className="font-bold h01 mt-6 mb-1">{_t.page_pdp.how_many}</div>
          <FakeDropdown ref={refWho} placeholder={whoTitle} onOpen={() => refWhen.current.close()}>
            <WhoContent administration={administration} usedIn={'PdpCart'} />
          </FakeDropdown>

          {/*Vanaf /nacht*/}
          <div className="flex-center mt-4">
            <div className="text-sm-4 mt-2">{_t.labels.from_night}</div>
            <div className="text-sm-8 ml-2">{toEuro(context.cheapest, true)}</div>
          </div>

          {/*Button*/}
          <div className="text-center mt-4">
            <Button label={checkIn && checkOut ? _t.labels.choose_your_room : _t.labels.select_dates}
                    onClick={() => {
                      if (checkIn && checkOut) {
                        pdpScrollToFirstBookabe()
                      } else {
                        calendarDialogRef.current.open(administration.id)
                      }
                    }}
                    style={{ width: '60%' }} />
          </div>


          {/*Terms and conditions*/}
          <div className="mt-12 text-center">
            <div className="text-left inline-block -ml-6">
              <CartTermsAndConditions admin={administration} />
            </div>
          </div>
        </>}

      {/*Payment usps*/}
      <div className="mt-8">
        <div className="text-bold mb-4">{_t.page_pdp.usp_0}</div>
        <PaymentUsps requiresDeposit={administration.depositPercentage > 0} />
      </div>

      {/*Back to home only when SPA*/}
      {config.page === 'spa' && <div className="mt-12 mb-8">
        {butt()}
      </div>}

    </div>
  </>
}
