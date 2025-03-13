import { lazy, Suspense, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'

import { MainContext } from '../contexts/MainContext'
import { rowsPerPage } from '../data/constants'

import { classNames } from 'primereact/utils'
import { Button } from 'primereact/button'
import { Dropdown } from 'primereact/dropdown'
import { Badge } from 'primereact/badge'

import { useRecoilState, useRecoilValue } from 'recoil'
import selectorMainFilter from '../recoil/selectors/selectorMainFilter'
import recoilSpa from '../recoil/recoilSpa'
import recoilMainFilter from '../recoil/recoilMainFilter'
import recoilAvailability from '../recoil/recoilAvailability'
import recoilSubfilter from '../recoil/recoilSubfilter'
import recoilConfig from '../recoil/recoilConfig.js'

import Icon from '../molecules/Icon.jsx'
import Loading from '../molecules/Loading.jsx'
import Takeover from '../molecules/Takeover.jsx'
import PoweredBy from '../molecules/PoweredBy.jsx'

import { col, lte } from '../services/buttstrip'
import { getYmd } from '../services/dates'
import scrollIntoViewWithOffset from '../services/scrollIntoViewWithOffset.js'

import MainFilter from '../components/mainfilter/MainFilter.jsx'
import SubFilter from '../components/subfilter/SubFilter.jsx'

const SpaList = lazy(() => import('../components/availability/SpaList.jsx'))
const MapStays = lazy(() => import('../components/maps/MapStays.jsx'))

export default function Spa() {

  const context = useContext(MainContext)
  const refContext = useRef(context)
  const setLoading = useRef(context.setLoading)
  const _t = context._t()
  const [mainFilter, setMainFilter] = useRecoilState(recoilMainFilter)
  const [subFilters, setSubfilters] = useRecoilState(recoilSubfilter)

  const [availability, setAvailability] = useRecoilState(recoilAvailability)
  const [nothingFound, setNothingFound] = useState(false)

  const [showSubFilter, setShowSubFilter] = useState(false)
  const [spa, setSpa] = useRecoilState(recoilSpa)
  const config = useRecoilValue(recoilConfig)
  const ref = useRef()
  const [searchParams] = useSearchParams()
  const [spCategory] = useState(searchParams.get('category'))
  const [run, setRun] = useState(false)

  /**
   * When we have the parameter ?category
   * Set the recoil state for the type filter
   * Always set run to true
   * Run is the so we do not run 2 times
   */
  useEffect(() => {
    if (spCategory) {
      setMainFilter(old => {
        return {
          ...old, type: {
            disabled: false,
            category: spCategory.split(',')
          }
        }
      })
    }
    setRun(true)
  }, [spCategory, setMainFilter])


  const {
    pre_init,
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
    offset,
    sort
  } = useRecoilValue(selectorMainFilter)

  const request = useMemo(() => {

    const r = {
      groupId: 'STAYS',     // This is used for the list
      groupIds: ['STAYS'],  // This is used for the map
      mainFilters: {
        adults: (adults + children),
        babies,
        pets,
        category: [],       // This is used for the list
        stayTypes: category // This is used for the map
      },
      subFilters: subFilters.map(e => e.slug),
      // This one is about the acco's and book etc. locales, and we don't have a template (tp) language there.
      lang: context.hostLocale,
      sort,
      offset,
      limit: rowsPerPage,
      limitMedia: 1
    }

    // WhereContent
    if (regionId === '0' || regionId === null) {     // regionId not selected. must be place
      r.mainFilters.place = destinationZip
      r.mainFilters.range = range
    } else {                                          // regionId === '0' means everything so only when not '0'
      r.mainFilters.region = regionId
    }

    // TypeContent
    r.mainFilters.category = category

    // When
    if (checkIn && checkOut) {
      r.mainFilters.startDate = getYmd(checkIn)
      r.mainFilters.endDate = getYmd(checkOut)
    }

    return r
  }, [context.hostLocale, regionId, destinationZip, adults, babies, children, pets, range, checkIn, checkOut, category, offset, sort, subFilters])

  useEffect(() => {
      /**
       * Default this one is true,
       * Is set to false in App when the config is loaded
       */
      if (pre_init) return

      if (!run) return

      /**
       * Below some 'run once' code (only when the request changes)
       * or list/map switch
       */
      setLoading.current(true)

      // always set this one because it knows the proper bookable count (guess)
      axios.post('/v1/availability/get', request).then(res => {
        if (res.data.total === 0) {
          /**
           * Nothing found, fiddle with the request
           */
          setNothingFound(true)
          const clone = JSON.parse(JSON.stringify(request))
          clone.mainFilters = { adults: request.mainFilters.adults, pets: request.mainFilters.pets }
          axios.post('/v1/availability/get', clone).then(res => {
            setAvailability(res.data)
            setLoading.current(false)
          })
        } else {
          /**
           * Normal filter
           */
          setNothingFound(false)
          setAvailability(res.data)
          setLoading.current(false)

          if (refContext.current.forceScroll) {
            refContext.current.setForceScroll(false)
            scrollIntoViewWithOffset(ref.current, config.offset, config.scroll)
          }
        }
      })
    }, [request, pre_init, setAvailability, setNothingFound, config.offset, config.scroll, run]
  )

  const resetMainFilters = () => {

    setMainFilter(old => {
      return {
        ...old,
        where: {
          disabled: false,
          regionId: '0',
          destinationZip: null,
          range: 2
        },
        when: {
          disabled: false,
          checkIn: null,
          checkOut: null
        },
        type: {
          disabled: false,
          category: []
        }
      }
    })
    setNothingFound(false)
  }

  const MapButton = () => <Button
    icon={<Icon name={spa.mapListMode === 'map' ? 'list' : 'map'} size="1.5em"
                style={{ marginRight: '0.3em' }} />}
    label={_t.page_spa[spa.mapListMode === 'map' ? 'list' : 'map'] || 'Kaart'}
    onClick={() => {
      setSpa({ ...spa, mapListMode: (spa.mapListMode === 'map' ? 'list' : 'map') })
    }}
    outlined
    severity="secondary"
    rounded />


  return <div ref={ref}>
    <Loading />
    {
      showSubFilter ?
        // ============== TAKEPOVER ============
        <Takeover
          onClose={() => setShowSubFilter(false)}
          buttonA={{
            label: 'Reset filters',
            onClick: () => setSubfilters([])
          }}
          buttonB={{
            label: 'Bekijke resultaten',
            onClick: () => setShowSubFilter(false)
          }}>
          <SubFilter nothinFound={nothingFound} />
        </Takeover>
        :
        // ============== ACTUAL PAGE ============
        <>
          <MainFilter />
          <div className="filter-result p-4 text-color">
            <div className="grid padding">
              {/* TOTALS */}
              <div className={col({ sm: 12, md: 6 }, 'pt-5')}>
                {nothingFound ?
                  _t.page_spa.nothing_found_1 :
                  availability.total && _t.page_spa.accos_found.replace('{accos}', availability.totalBookable).replace('{ents}', availability.total)
                }
              </div>
              <div className={col({ def: 0, md: 0, lg: 2, xl: 2 }, 'pt-5')}>
              </div>
              <div className={col({ sm: 6, md: 6 }, 'flex')}>
                <div className="w100">
                  {/* FILTER */}
                  <Dropdown
                    className={lte('sm') ? 'w100' : 'w75'}
                    options={_t.page_spa.filterOptions}
                    value={mainFilter.sort}
                    onChange={e => setMainFilter(old => {
                      return { ...old, sort: e.value }
                    })}
                  />
                </div>
                <div className={classNames({ 'none': lte('sm') }, 'w25 text-center')}>
                  {/* MAP BUTTON LARGE */}
                  <MapButton />
                </div>
              </div>
              <div className={col({ def: 0, xs: 6, sm: 6 }, 'text-right')}>
                {(subFilters.length !== 0) && <Badge value={subFilters.length} style={{
                  position: 'absolute',
                  top: '-0.5em',
                  right: '-0.5em',
                  zIndex: 1
                }} />}
                {/*MAP BUTTON SMALL*/}
                <MapButton />
                {/*FILTERS SMALL*/}
                <Button
                  icon={<Icon name="filter" size="1.5em" />}
                  className="ml-8 mt-3"
                  label="Filters"
                  onClick={() => setShowSubFilter(true)}
                  outlined
                  severity="secondary"
                  rounded />
              </div>

              {spa.mapListMode === 'list' &&
                <Suspense fallback={<Loading />}>
                  <SpaList nothingFound={nothingFound} resetMainFilters={resetMainFilters} />
                </Suspense>
              }

              {spa.mapListMode === 'map' &&
                <Suspense fallback={<Loading />}>
                  <MapStays request={request} width="100%" height="600px" />
                </Suspense>
              }


            </div>
          </div>

        </>
    }
    <PoweredBy />
  </div>
}
