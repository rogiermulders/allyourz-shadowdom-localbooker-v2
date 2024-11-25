import {col, gte, lte} from "../../services/buttstrip";
import SubFilter from "../subfilter/SubFilter.jsx";
import {Paginator} from "primereact/paginator";
import {rowsPerPage} from "../../data/constants";
import Administrations from "../administration/Administrations.jsx";
import {useRecoilState, useRecoilValue} from "recoil";
import recoilMainFilter from "../../recoil/recoilMainFilter";
import recoilAvailability from "../../recoil/recoilAvailability";

export default function SpaList({nothingFound}) {

  const [mainFilter, setMainFilter] = useRecoilState(recoilMainFilter)
  const avail = useRecoilValue(recoilAvailability);

  return <>
    <div className={lte('xs') ? 'grid' : 'grid padding'}>
      {gte('md') && <div className={col({def: 3, sm: 12})}>
        <SubFilter nothinFound={nothingFound}/>
      </div>}

      <div className={col({def: 9, xs: 12, sm: 12})}>


        {nothingFound &&
          <div className="text-center">
            <div>
              <svg style={{ width: '2em', height: '2em' }}>
                <use xlinkHref={`#icon-sign-alt`} />
              </svg>
            </div>
            <div className="text-center text-bold p-2">Verleg je grenzen</div>
            <div className="p-2">Er zijn geen resultaten gevonden, probeer het via ons totaaloverzicht of bekijk onze beste keuzes hieronder. </div>
          </div>
        }


        <Paginator className="mt-4"
                   first={mainFilter.offset}
                   rows={rowsPerPage}
                   pageLinkSize={lte('xs') ? 3 : 5}
                   totalRecords={avail.total}
                   onPageChange={(e) => {
                     setMainFilter(old => {
                       return {...old, offset: e.first}
                     })
                   }}/>



        <Administrations/>

        <Paginator className="mt-4"
                   first={mainFilter.offset}
                   rows={rowsPerPage}
                   pageLinkSize={lte('xs') ? 3 : 5}
                   totalRecords={avail.total}
                   onPageChange={(e) => {
                     setMainFilter(old => {
                       return {...old, offset: e.first}
                     })
                   }}/>
      </div>
    </div>
  </>
    }