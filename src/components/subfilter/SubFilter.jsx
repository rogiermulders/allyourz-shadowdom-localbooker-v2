import {useRecoilState, useRecoilValue} from "recoil";
import recoilAvailability from "../../recoil/recoilAvailability";
import {Checkbox} from 'primereact/checkbox';
import recoilSubfilter from "../../recoil/recoilSubfilter";
import {useContext, useState} from "react";

import {classNames} from "primereact/utils";
import {MainContext} from "../../contexts/MainContext";

const categoryFoldAt = 5
const facilityFoldAt = 3
const facilityThreshold = 5

export default function SubFilter({nothinFound}) {
  const context = useContext(MainContext)
  const _t = context._t()
  const avail = useRecoilValue(recoilAvailability);
  // This one is there for the API
  const [subfilter, setSubfilter] = useRecoilState(recoilSubfilter)
  const [foldStatus, setFoldStatus] = useState({})
  const [showAll, setShowAll] = useState(false)

  const checkboxChanged = (item) => {
    const clone = [...subfilter]

    if (subfilter.find(f => f.slug === item.slug)) {
      // Remove
      clone.splice(subfilter.findIndex(f => f.slug === item.slug), 1)
    } else {
      // Add
      clone.push(item)
    }

    clone.sort()
    setSubfilter(clone)
  }

  const YourFilters = () => {

    return subfilter.map((facility, j) => {
      return <div key={j}>
        <div className="flex">
          <div className="pt-2 pb-2 nowrap">
            <Checkbox inputId={facility.slug}

                      value={facility.slug}
                      onChange={() => checkboxChanged(facility)}
                      checked={!!subfilter.find(k => k.slug === facility.slug)}
            />
            <label
              htmlFor={facility.slug}
              className="ml-4 pointer">
              {facility.name}
            </label>
          </div>
        </div>
      </div>
    })
  }

  const MoreOrLess = ({name, dir}) => <><span className="text-underline font-bold">{name}</span> <i className={`pi pi-chevron-${dir}`}/></>
  const moreOrLessCliced = i => {
    const old = {...foldStatus}
    old['i' + i] ? delete old['i' + i] : old['i' + i] = true
    setFoldStatus(old)
  }

  const FilterItem = ({facility}) => {
    return <>

      <div className="pt-2 pb-2  nowrap">
        <Checkbox inputId={facility.slug}
                  value={facility.slug}
                  onChange={() => checkboxChanged(facility)}
                  checked={!!subfilter.find(k => k.slug === facility.slug)}
        />
        <label
          htmlFor={facility.slug}
          className="ml-4 pointer">
          {facility.name} ({facility.count})
        </label>
      </div>
    </>
  }
  const Facilities = ({filter, i}) => {
    return <>
      {/*Always visible*/}
      <div className="facility">
        {filter.facilities.map((facility, j) => {
          if ((j < facilityFoldAt) || (filter.facilities.length <= facilityThreshold)) {
            return <FilterItem key={facility.slug} facility={facility}/>
          }
        })}
      </div>

      {/*Default hidden but shown when foldStatus[i] === true*/}
      <div className={classNames('hidden-facilities', {none: !foldStatus['i' + i]})}>
        {filter.facilities.map((facility, j) => {
          if (!(j < facilityFoldAt) || (filter.facilities.length <= facilityThreshold)) {
            return <FilterItem key={facility.slug} facility={facility}/>
          }
        })}
      </div>
    </>
  }

  const AllSubfilters = () => {
    if (avail.filters) {
      return <>
        {avail.filters.map((filter, i) => {
          if ((i < categoryFoldAt) || showAll) {
            return <div key={i} style={{display: 'block'}}>

              {/*CATEGORY*/}
              <div className="font-bold h6 pb-2">{filter.name}</div>

              {/*FACILITIES*/}
              <Facilities filter={filter} i={i}/>

              {/*Meer Minder*/}
              {(filter.facilities.length > facilityThreshold) &&
                <div className="pointer pt-2 pb-2" onClick={() => moreOrLessCliced(i)}>
                  {foldStatus['i' + i] ? <MoreOrLess name={_t.subFilter.less} dir="up"/> : <MoreOrLess name={_t.subFilter.more} dir="down"/>}
                </div>
              }

              {/*HR*/}
              <hr/>
            </div>
          }
        })
        }
        <div className="pointer pt-2 pb-2"
             onClick={() => {
               setShowAll(old => !old)
             }}>
          {showAll ? <MoreOrLess name={_t.subFilter.less} dir="up"/> : <MoreOrLess name={_t.subFilter.more} dir="down"/>}
        </div>

      </>
    }
  }
  return <>
    <div className="pb-2">
      {!nothinFound && _t.subFilter.find_the_perfect_spot}
      <hr className="mt-8"/>
    </div>
    {!!subfilter.length && <div>
      <div className="font-bold h6 pb-2">{_t.subFilter.your_filters}</div>
      <YourFilters/>
      <hr className="mt-8"/>
    </div>}
    {!nothinFound && <div>
      <AllSubfilters/>
    </div>}
  </>
}
