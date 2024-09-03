import {col, gte, lte} from "../../services/buttstrip";
import SubFilter from "../subfilter/SubFilter.jsx";
import {Paginator} from "primereact/paginator";
import {rowsPerPage} from "../../data/constants";
import Administrations from "../administration/Administrations.jsx";
import {useRecoilState, useRecoilValue} from "recoil";
import recoilMainFilter from "../../recoil/recoilMainFilter";
import recoilAvailability from "../../recoil/recoilAvailability";

export default function SpaList() {

  const [mainFilter, setMainFilter] = useRecoilState(recoilMainFilter)
  const avail = useRecoilValue(recoilAvailability);

  return <>
    <div className={lte('xs') ? 'grid' : 'grid padding'}>
      {gte('md') && <div className={col({def: 3, sm: 12})}>
        <SubFilter/>
      </div>}

      <div className={col({def: 9, xs: 12, sm: 12})}>
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