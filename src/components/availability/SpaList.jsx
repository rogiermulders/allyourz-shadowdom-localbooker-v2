import { col, gte, lte } from '../../services/buttstrip'
import SubFilter from '../subfilter/SubFilter.jsx'
import { Paginator } from 'primereact/paginator'
import { rowsPerPage } from '../../data/constants'
import Administrations from '../administration/Administrations.jsx'
import { useRecoilState, useRecoilValue } from 'recoil'
import recoilMainFilter from '../../recoil/recoilMainFilter'
import recoilAvailability from '../../recoil/recoilAvailability'
import { MainContext } from '../../contexts/MainContext'
import { useContext } from 'react'

export default function SpaList({ nothingFound, resetMainFilters }) {
  const context = useContext(MainContext)
  const _t = context._t().page_spa
  const [mainFilter, setMainFilter] = useRecoilState(recoilMainFilter)
  const avail = useRecoilValue(recoilAvailability)

  return <>
    <div className={lte('xs') ? 'grid' : 'grid padding'}>
      {gte('md') && <div className={col({ def: 3, sm: 12 })}>
        <SubFilter nothinFound={nothingFound} />
      </div>}

      <div className={col({ def: 9, xs: 12, sm: 12 })}>


        {nothingFound &&
          <div className="text-center" style={{marginTop:'3em'}}>
            <div>
              <svg style={{ width: '2em', height: '2em', fill:'var(--primary-color)' }}>
                <use xlinkHref={`#icon-sign-alt`} />
              </svg>
            </div>
            <div className="text-center text-bold p-2 mt-10" style={{color:'var(--primary-color)'}}>
              {_t.nothing_found_2}
            </div>
            <div className="p-2 pb-4 mt-20">
              {_t.nothing_found_3} <a
              href="."
              onClick={e=> {
                e.preventDefault()
                resetMainFilters()
              }}
            >{_t.nothing_found_4}</a> {_t.nothing_found_5}
            </div>
          </div>
        }
        <Paginator className="mt-4"
                   first={mainFilter.offset}
                   rows={rowsPerPage}
                   pageLinkSize={lte('xs') ? 3 : 5}
                   totalRecords={avail.total}
                   onPageChange={(e) => {
                     setMainFilter(old => {
                       return { ...old, offset: e.first }
                     })
                   }} />


        <Administrations />

        <Paginator className="mt-4"
                   first={mainFilter.offset}
                   rows={rowsPerPage}
                   pageLinkSize={lte('xs') ? 3 : 5}
                   totalRecords={avail.total}
                   onPageChange={(e) => {
                     setMainFilter(old => {
                       return { ...old, offset: e.first }
                     })
                   }} />
      </div>
    </div>
  </>
}