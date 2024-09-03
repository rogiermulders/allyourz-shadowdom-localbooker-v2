import {Card} from "primereact/card";
import {classNames} from "primereact/utils";
import {Button} from "primereact/button";
import {col, getBp, lte, gte} from "../../services/buttstrip";
import {imageResize} from "../../services/imageResize";
import {toEuro} from "../../services/money";
import {useRecoilValue} from "recoil";
import recoilAvailability from "../../recoil/recoilAvailability";
import Icon from "../../molecules/Icon.jsx";
import {imageNotFound} from "../../data/constants";
import {useContext} from "react";
import {MainContext} from "../../contexts/MainContext";
import {useNavigate} from "react-router-dom";


export default function Administrations() {
  const navigate = useNavigate()
  const context = useContext(MainContext)
  const avail = useRecoilValue(recoilAvailability);
  const _t = context._t()
  if (!avail.accomodations) return null

  const LiContent = ({icon, label}) => {
    return <>
      <div>
        <Icon name={icon} size="1.25em" color="text-color-secondary"/>
      </div>
      <div className="ml-4 mr-3 text-color-secondary">
        {label}
      </div>
    </>
  }

  const doNavigate = (accomodation) => {
    navigate('/' + accomodation.slug)
  }

  const PricePart = ({accomodation}) => <>
    <div className={classNames('grid', {'mt-4': lte('xs')})}>
      <div className={col({xs: 6, def: 12})}>
        <span className="h02">Vanaf /nacht</span>
        <div className="mt-2 font-bold h5">
          € {toEuro(accomodation.minPrice / accomodation.days)}
        </div>

      </div>
      <div className={col({xs: 6, def: 12}, 'text-right', 'mt-4')}>
        <Button label={_t.labels.go_to} onClick={() => doNavigate(accomodation)}/>
      </div>
    </div>
  </>

  return <div className="administrations">

    {avail.accomodations.map((accomodation, i) => {
      return <Card key={i} className="mt-8">

        <div className={lte('xs') ? 'grid' : 'grid padding'}>
          {/*IMAGE PART*/}
          <div className={col({xs: 12, def: 4})}>
            <div className="ar-box-3-2">
              <div className="ar-box-inside-3-2">
                <img className="ar-image pointer"
                     src={imageResize(accomodation.media[0], {xs: 828}[getBp()] || 384)}
                     onClick={() => doNavigate(accomodation)}
                     onError={(e) => e.target.src = imageNotFound}
                     alt=""/>
              </div>
            </div>
          </div>

          {/*DATA PART*/}
          <div className={col({xs: 12, def: 6}, 'text-color')} style={{position: lte('xs') ? "static" : 'relative'}}>
            {/*Accom Name*/}
            <div className="h4 font-bold">
              <span className="pointer" onClick={() => doNavigate(accomodation)}>{accomodation.name}</span>
            </div>

            {/*LINE WITH NICE ICONS*/}
            <ul className="ul-none m-0 p-0 nowrap">
              <li className="mt-4 flex-wrap">
                {/*Hotel, Camping etc*/}
                {accomodation.categories.map((e, i) => <LiContent key={i} icon={e.icon} label={e.label}/>)}
                {/*Location*/}
                <LiContent icon="map-pin" label={accomodation.city}/>
              </li>
            </ul>

            {/*LINE WITH MAX NUMBER OF GUESTS*/}
            <ul className="ul-none m-0 p-0 nowrap">
              <li className="mt-4 flex-wrap">
                {accomodation.properties.maxPersons &&
                  <LiContent icon="users" label={accomodation.properties.maxPersons + ' pers.'}/>
                }
                {accomodation.properties.bedrooms &&
                  <LiContent icon="bed" label={accomodation.properties.bedrooms + ' slaapk.'}/>
                }
                {accomodation.properties.surfaceArea &&
                  <LiContent icon="arrows-h" label={accomodation.properties.surfaceArea + ' m2'}/>
                }
                {accomodation.usps.map((e, i) => {
                  return <div key={i} className="lb-tooltip pl-4">
                    <LiContent icon={e.icon}/>
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
            <PricePart accomodation={accomodation}/>
          </div>}

          {lte('xs') && <div className="col-12">
            <PricePart accomodation={accomodation}/>
          </div>}

        </div>
      </Card>
    })}
  </div>
}
