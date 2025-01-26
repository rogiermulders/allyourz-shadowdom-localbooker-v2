import { getBp, lte, gte, gt } from '../../services/buttstrip'
import Carousel from '../carousel/Carousel'
import Usps from './Usps.jsx'
import SpecialFacilities from './SpecialFacilities.jsx'
import { lazy, useContext, useRef, Suspense } from 'react'
import { MainContext } from '../../contexts/MainContext'
import Icon from '../../molecules/Icon.jsx'
import ForwardDialog from '../../molecules/ForwardDialog.jsx'
import LiContent from './LiContent.jsx'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue } from 'recoil'
import RecoilConfig from '../../recoil/recoilConfig.js'
import { classNames } from 'primereact/utils'
import Loading from '../../molecules/Loading.jsx'
import AdministrationTopReview from './AdministrationTopReview.jsx'
import CharacteristicItems from './CharacteristicItems.jsx'
import { Button } from 'primereact/button'
import AdministrationFacilities from './AdministrationFacilities.jsx'
import AdministrationsReview from './AdministrationsReview.jsx'

const MapAdminLocation = lazy(() => import('../maps/MapAdminLocation.jsx'))

export default function Administration({ administration }) {
  const _t = useContext(MainContext)._t()
  const dialogRef = useRef()
  const { address, properties } = administration
  const navigate = useNavigate()
  const context = useContext(MainContext)
  const config = useRecoilValue(RecoilConfig)

  return <>

    <ForwardDialog ref={dialogRef} />

    <div className="text-color pl-8 pr-8">
      <div className={classNames('grid', { 'mt-6': lte('sm') })}>
        {/*Back to search and book  */}
        <div className="col-8 mb-3">
          {config.page === 'spa' && <>
            <span
              onClick={() => {
                context.setForceScroll(true)
                navigate('/')
              }}
              style={{
                cursor: 'pointer',
                textDecoration: 'none',
                color: 'var(--primary-color)'
              }}>
              {_t.labels.search_and_book || 'Terug naar ZOEK & BOEK'}
            </span>
          </>}
        </div>

        {/*REVIEWS greater XS (you need the relative here) */}
        {gt('xs') && <div className="col-4 pr-8 relative text-right">
          {administration.rating && <AdministrationTopReview administration={administration} />}
        </div>}
      </div>

      {/*The name of the administration*/}
      <div className="grid">
        <div className={classNames('col-12', { '-mt-9': gte('md') })}>
          <span className="h3">{administration.name}</span>
        </div>
      </div>

      {/* The location, opens the map! */}
      <div className="grid">
        <div className={classNames('col-12 pt-0 pb-4', { 'mt-2': lte('sm') })} style={{ marginTop: '-8px' }}>
          <ul className="ul-none flex-wrap m-0 p-0 mt-4 nowrap">
            {!!properties.length &&
              <LiContent
                className="mr-6"
                icon={properties[0].icon}
                label={properties[0].label}
              />}
            <LiContent
              className="pointer text-underline"
              icon="map-pin"
              label={`${address.city}, ${address.region}`}
              onClick={() => {
                dialogRef.current.open(
                  {
                    header: administration.name,
                    content: <Suspense fallback={<Loading />}>
                      <MapAdminLocation
                        lat={address.latitude}
                        long={address.longitude}
                        admin_id={administration.id} />
                    </Suspense>
                  })
              }} />
          </ul>

        </div>
      </div>

      {/*REVIEWS*/}
      {getBp() === 'xs' && <div className="flex-wrap -mt-4 pb-6">
        {administration.rating && <AdministrationsReview accomodation={administration} />}
      </div>}

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

      {/*USPS*/}
      <div className="mt-8 m-4">
        <Usps usps={administration.usps} />
      </div>

      {/*Speciale kenmerken*/}
      {!lte('xs') && <div className="mt-8 ml-4 mr-4">
        <hr />
        <h4 className="mb-4 mt-8">{_t.page_pdp.characteristics}</h4>
        <CharacteristicItems facilityGroups={administration.facilityGroups} />
      </div>}
      <div className="mt-8 m-4">
        <Button outlined label={_t.page_pdp.show_all_facilities} onClick={() => {
          dialogRef.current.open(
            {
              size: 'medium',
              header: administration.name,
              content: <div className="p-10" style={{ height: '60vh' }}>
                <AdministrationFacilities administration={administration} />
              </div>
            })
        }} />
      </div>


    </div>
  </>

}
