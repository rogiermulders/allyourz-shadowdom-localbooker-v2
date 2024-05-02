import {RadioButton} from "primereact/radiobutton";
import {DESTINATIONS, REGIONS} from '../../data/constants'
import recoilMainFilter from '../../recoil/recoilMainFilter'
import {useRecoilState} from "recoil";
import {classNames} from "primereact/utils";
import {lte} from "../../services/buttstrip";
import {useContext} from "react";
import {MainContext} from "../../contexts/MainContext";


export default function WhereContent({onSelected}) {
  const context = useContext(MainContext)
  const _t = context._t()
  const [mainFilter, setMainFilter] = useRecoilState(recoilMainFilter);

  // REGION
  let Item = ({item, className}) => {
    return <li className={classNames('mt-3', className)}>
      <RadioButton inputId={item.value}
                   name="radio"
                   value={item.value}
                   onChange={(e) => update(e.value)}
                   checked={mainFilter.where[item.value.length === 6 ? 'destinationZip' : 'regionId'] === item.value}/>
      <label className="ml-2 pointer" htmlFor={item.value}>{_t.mainFilter[item.label] || item.label}</label>
    </li>
  }

  // Helper
  const update = (value) => {

    let name = value.length === 6 ? 'destinationZip' : 'regionId'
    let clear = value.length === 6 ? 'regionId' : 'destinationZip'

    const prop = {}
    prop[name] = value
    prop[clear] = null
    setMainFilter(old => {
      return {...old, where: {...old.where, ...prop}}
    })
    onSelected()
  }

  // RETURN
  return lte('xs') ?
    <div className="mobile p-4" style={{overflowY: 'auto', height:'60vh'}}>
      <div className="regions">
        <span className="text-bold">{_t.mainFilter.regions}</span>
        <ul className="ul-none p-0 m-0">
          {REGIONS.map((item, i) => <Item key={i} item={item}/>)}
        </ul>
      </div>
      <div className="cities mt-8">
        <span className="text-bold">{_t.mainFilter.destinations}</span>
        <ul className="ul-none p-0 m-0">
          {DESTINATIONS.map((item, i) => <Item key={i} item={item}/>)}
        </ul>
      </div>
      <div className="mt-8" style={{height:'1em', backgroundColor:'var(--surface-b)'}}>

      </div>
    </div>
    :
    <div className="desktop grid p-4">
      <div className="w30">
        <div className="text-bold">
          {_t.mainFilter.regions}
        </div>
        <div className="pt-2">
          <ul className="ul-none p-0 m-0">
            {REGIONS.map((item, i) => <Item key={i} item={item}/>)}
          </ul>
        </div>
      </div>
      <div className="w70">

        {/*ALL CITIES*/}
        <div className="text-bold">
          {_t.mainFilter.destinations}
        </div>
        <div className="pt-2">
          <ul className="ul-none p-0 m-0 grid">
            {DESTINATIONS.map((item, i) => <Item key={i} className="w33" item={item}/>)}
          </ul>
        </div>
      </div>
    </div>
}
