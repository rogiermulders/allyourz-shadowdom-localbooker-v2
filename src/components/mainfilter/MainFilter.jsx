import {useContext, useEffect, useRef} from "react";
import WhereContent from "./WhereContent.jsx";
import WhenContent from "./WhenContent.jsx";
import TypeContent from "./TypeContent.jsx";
import {useRecoilState, useRecoilValue} from "recoil";
import {format} from "../../services/dates";
import {accomodationMap, destinationMap, rangeOptions, regionMap} from "../../data/constants";
import WhoContent from "./WhoContent.jsx";
import {col, lte} from "../../services/buttstrip";
import {Button} from "primereact/button";
import selectorMainFilter from "../../recoil/selectors/selectorMainFilter";
import Overlay from "../../molecules/Overlay.jsx";
import Icon from "../../molecules/Icon.jsx";

import {classNames} from "primereact/utils";
import recoilMainFilter from "../../recoil/recoilMainFilter";
import {Dropdown} from "primereact/dropdown";
import {MainContext} from "../../contexts/MainContext";
import recoilSpa from "../../recoil/recoilSpa";

let whenButtonWidth = null

export default function MainFilter() {
  const context = useContext(MainContext)
  const _t = context._t()
  const [, setMainFilter] = useRecoilState(recoilMainFilter)
  const refWhenButton = useRef()
  const refs = {where: useRef(), when: useRef(), who: useRef(), type: useRef()}
  const [spa, setSpa] = useRecoilState(recoilSpa)

  const {
    regionId,
    destinationZip,
    adults,
    children,
    babies,
    pets,
    range,
    checkIn,
    checkOut,
    category,
    whereDisabled
  } = useRecoilValue(selectorMainFilter)

  // Debugging
  // useEffect(() => {
  //   if (refs.where.current && process.env.REACT_APP_ENV === 'DEV') {
  //     refs.where.current.open()
  //   }
  // }, [refs.where])

  useEffect(() => {
    if (refWhenButton.current) {
      whenButtonWidth = refWhenButton.current.clientWidth
    }
  }, [refWhenButton])

  const closeOthers = (refName) => {
    for (const [key, ref] of Object.entries(refs)) {
      if (refName !== key && ref.current) {
        ref.current.close()
      }
    }
  }

  const WhereButton = () => {

    // Guess this one works to prevent the overlay to open when we do dropdown
    let dropdownActive = false

    // region or city
    let destName = destinationZip !== null ? destinationMap(destinationZip) : regionMap(regionId)
    // filthy hack to get Some stuff translated
    destName = _t.mainFilter[destName] || destName


    return <Button
      icon={<Icon size="1.5em" name="map-pin" light/>}
      className="w100"
      onClick={() => {
        if (!dropdownActive) {
          if (!whereDisabled) {
            refs.where.current.open()
          }
        }
      }}>
      <div className={classNames((destinationZip ? 'w70' : 'w100'))}>
        <div className="h02 mb-2">{_t.mainFilter.where}</div>
        <div>{destName}</div>
      </div>
      {destinationZip &&
        <Dropdown appendTo={context.shadowRoot}
                  options={rangeOptions}
                  value={range}
                  onMouseDown={() => dropdownActive = true}
                  onChange={e => {
                    setMainFilter(old => {
                      return {...old, where: {...old.where, range: e.value}}
                    })
                  }}/>
      }
    </Button>
  }

  const WhenButton = () => {
    return <Button icon={<Icon size="1.5em" name="calendar" light/>}
                   ref={refWhenButton} // used to get the width of the button (see useEffect)
                   className="w100"
                   onClick={() => {
                     if (refs.when.current) {
                       refs.when.current.open()
                     }
                   }}>
      <div className="w100">
        <div className="h02 mb-2">{_t.mainFilter.when}</div>
        <div>{
          (checkIn && checkOut) ?
            (format(checkIn, 'nl', 'short', false) + ' - ' + format(checkOut, 'nl', 'short', false)) :
            _t.mainFilter.selectdate
        }</div>
      </div>
    </Button>
  }
  const TypeButton = () => {
    // Just a func to put '…' after a string
    const truncate = (str, n) => str.length > n ? str.slice(0, n - 1) + '…' : str;
    // Create string out of the selected category array

    const names = truncate(category.map(e => accomodationMap(e, context.hostLocale)).join(', '), 25)

    return <Button icon={<Icon name="bed" size="1.5em" light/>} className="w100"
                   onClick={() => refs.type.current.open()}>
      <div className="w100">
        <div className="h02 mb-2">{_t.mainFilter.type}</div>
        <div>{category.length ? names : _t.mainFilter.selecttype}</div>
      </div>
    </Button>
  }
  const WhoButton = () => {
    const tot = adults + babies + children
    const whoTitle = tot + ' ' + _t.labels[tot > 1 ? 'guests' : 'guest'] +
      (pets ? `, ${pets} ${_t.labels[pets > 1 ? 'pets' : 'pet']}` : '')

    return <Button icon={<Icon size="1.5em" name="users" light/>} className="w100"
                   onClick={() => refs.who.current.open()}>
      <div className="w100">
        <div className="h02 mb-2">{_t.mainFilter.who}</div>
        <div>{whoTitle}</div>
      </div>
    </Button>
  }

  const filterCol = {def: 3, sm: 6, xs: 12}

  return <div className="main-filter grid padding text-color" onClick={() => {
    // Now this one is UGLY...
    // It is for the map to close the popup when the user clicks on the filter
    // It should be closed so the auto centering of the map is not disturbed
    if(spa.adminIds){
      setSpa({...spa, adminIds: null, administrations: []})
    }
  }}>
    {/* WHERE */}
    <div className={col(filterCol)}>
      <WhereButton/>
      <Overlay ref={refs.where} width={lte('xs') ? '100%' : '800px'} onOpen={() => closeOthers('where')}>
        <WhereContent onSelected={() => refs.where.current.close()}/>
      </Overlay>
    </div>
    {/* WHEN */}
    <div className={col(filterCol)}>
      <WhenButton/>
      {/*Overlay content is calendar. When md or up we have 2 cals so the width = 2 * the buttwidth*/}
      {whenButtonWidth &&
        <Overlay ref={refs.when} width={whenButtonWidth * (lte('sm') ? 1 : 2.5)}
                 onOpen={() => closeOthers('when')}>
          {/*<div style={{height:'400px',backgroundColor:'gainsboro'}}></div>*/}
          <WhenContent
            onSelected={() => refs.when.current.close()}
            onClose={() => refs.when.current.close()}
          />
        </Overlay>}
    </div>
    {/* TYPE */}
    <div className={col(filterCol)}>
      <TypeButton/>
      <Overlay ref={refs.type} onOpen={() => closeOthers('type')}>
        <TypeContent/>
      </Overlay>
    </div>
    {/* WHO */}
    <div className={col(filterCol)}>
      <WhoButton/>
      <Overlay ref={refs.who} onOpen={() => closeOthers('who')}>
        <WhoContent usedIn={'MainFilter'}/>
      </Overlay>
    </div>
  </div>

}
