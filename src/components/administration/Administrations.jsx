import { Card } from 'primereact/card'
import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'
import { col, getBp, lte, gte } from '../../services/buttstrip'
import { imageResize } from '../../services/imageResize'
import { toEuro } from '../../services/money'
import { useRecoilValue } from 'recoil'
import recoilAvailability from '../../recoil/recoilAvailability'
import { imageNotFound } from '../../data/constants'
import { useContext, useRef } from 'react'
import { MainContext } from '../../contexts/MainContext'
import { useNavigate } from 'react-router-dom'
import LiContent from './LiContent.jsx'
import { getReviewsLabel } from '../../services/reviewLabels.js'
import Icon from '../../molecules/Icon.jsx'
import { OverlayPanel } from 'primereact/overlaypanel'

export default function Administrations() {
  const op = useRef(null)
  const navigate = useNavigate()
  const context = useContext(MainContext)
  const avail = useRecoilValue(recoilAvailability)
  const _t = context._t()
  if (!avail.accomodations) return null

  const doNavigate = (accomodation) => {
    navigate('/' + accomodation.slug)
  }

  const PricePart = ({ accomodation }) => <>
    <div className={classNames('grid', { 'mt-4': lte('xs') })}>
      <div className={col({ xs: 6, def: 12 })}>
        <span className="h02">{_t.labels.from_night}</span>
        <div className="mt-2 font-bold h5">
          € {toEuro(accomodation.minPrice / accomodation.days)}
        </div>

      </div>
      <div className={col({ xs: 6, def: 12 }, 'text-right', 'mt-4')}>
        <Button label={_t.labels.go_to} onClick={() => doNavigate(accomodation)} />
      </div>
    </div>
  </>

  return <>
    <OverlayPanel ref={op} className="h01">
      {_t.reviews.i_google}
    </OverlayPanel>

    <div className="administrations">

      {avail.accomodations.map((accomodation, i) => {
        return <Card key={i} className="mt-8">

          <div className={lte('xs') ? 'grid' : 'grid padding'}>
            {/*IMAGE PART*/}
            <div className={col({ xs: 12, def: 4 })}>
              <div className="ar-box-3-2">
                <div className="ar-box-inside-3-2">
                  <img className="ar-image pointer"
                       src={imageResize(accomodation.media[0], { xs: 828 }[getBp()] || 384)}
                       onClick={() => doNavigate(accomodation)}
                       onError={(e) => e.target.src = imageNotFound}
                       alt="" />
                </div>
              </div>
            </div>

            {/*DATA PART*/}
            <div className={col({ xs: 12, def: 6 }, 'text-color')}
                 style={{ position: lte('xs') ? 'static' : 'relative' }}>

              {/*Accom Name*/}
              <div className="h4 font-bold">
                <span className="pointer" onClick={() => doNavigate(accomodation)}>{accomodation.name}</span>
              </div>

              {/*LINE WITH NICE ICONS*/}
              <div className="ul-none m-0 p-0 nowrap">
                <div className="flex-wrap">
                  {/*Rating*/}
                  {accomodation.rating && <div className="mt-2 mr-2 flex pointer" onClick={(e) => op.current.toggle(e)}>
                    <div className="text-center" style={{
                      width: '1.4em',
                      height: '1.4em',
                      borderRadius: '0.7em',
                      backgroundColor: '#8ccbc8'
                    }}>
                      <span className="h03">{(accomodation.rating + '').replace('.', ',')}</span>
                    </div>
                    <div className="h01 ml-4 mr-2  mt-2 text-color-secondary">
                      {getReviewsLabel(accomodation.rating, _t.reviews)}
                    </div>
                    <Icon className="mt-1 mr-2" name="info-circle" size="1.2em" color="primary-color" />
                  </div>
                  }

                  {/*Hotel, Camping etc*/}
                  {accomodation.categories.map((e, i) => <LiContent className="mt-2" key={i} icon={e.icon} label={e.label} />)}

                  {/*Location*/}
                  <LiContent className="mt-2" icon="map-pin" label={accomodation.city} />
                </div>
              </div>

              {/*LINE WITH MAX NUMBER OF GUESTS*/}
              <ul className="ul-none m-0 p-0 nowrap">
                <li className="mt-4 flex-wrap">
                  {accomodation.properties.maxPersons &&
                    <LiContent icon="users" label={accomodation.properties.maxPersons + ' pers.'} />
                  }
                  {accomodation.properties.bedrooms &&
                    <LiContent icon="bed" label={accomodation.properties.bedrooms + ' ' + _t.labels.bedroom} />
                  }
                  {accomodation.properties.surfaceArea &&
                    <LiContent icon="arrows-h" label={accomodation.properties.surfaceArea + ' m2'} />
                  }
                  {accomodation.usps.map((e, i) => {
                    return <div key={i} className="lb-tooltip pl-4">
                      <LiContent icon={e.icon} />
                      <span className="tooltiptext">{e.name}</span>
                    </div>
                  })}
                </li>
              </ul>

              {/*Oneliner*/}
              <div className="mt-5"
                // style={!lte('xs') ? {position: 'absolute', bottom: '0.5em'} : {}}
              >
                {accomodation.oneLiner}
              </div>
            </div>

            {/*PRICE PART*/}
            {gte('sm') && <div className="col-2 text-right pr-4">
              <PricePart accomodation={accomodation} />
            </div>}

            {lte('xs') && <div className="col-12">
              <PricePart accomodation={accomodation} />
            </div>}

          </div>
        </Card>
      })}
    </div>
  </>
}
