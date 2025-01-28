import { getReviewsLabel, ratingToString } from '../../services/reviewLabels.js'
import Icon from '../../molecules/Icon.jsx'
import { useContext, useRef } from 'react'
import { MainContext } from '../../contexts/MainContext.tsx'
import { OverlayPanel } from 'primereact/overlaypanel'


export default function AdministrationsReview({ accomodation }) {
  const _t = useContext(MainContext)._t()
  const op = useRef()
  if (!accomodation.rating) return null
  return <>
    <OverlayPanel ref={op} className="h01">
      {_t.reviews.i_google}
    </OverlayPanel>

    <div className="mt-2 mr-2 flex pointer" onClick={(e) => op.current.toggle(e)}>
      <div className="text-center" style={{
        width: '1.4em',
        height: '1.4em',
        borderRadius: '0.7em',
        backgroundColor: '#8ccbc8'
      }}>
        <span className="h03">{ratingToString(accomodation.rating)}</span>
      </div>
      <div className="h01 ml-4 mr-2  mt-2 text-color-secondary">
        {getReviewsLabel(accomodation.rating, _t.reviews)}
      </div>
      <Icon className="mt-1 mr-2" name="info-circle" size="1.2em" color="#8ccbc8" />
    </div>
  </>


}