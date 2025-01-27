import Icon from '../../molecules/Icon.jsx'
import { getReviewsLabel,ratingToString } from '../../services/reviewLabels.js'
import { useContext, useRef } from 'react'
import { MainContext } from '../../contexts/MainContext'
import { OverlayPanel } from 'primereact/overlaypanel'

export default function AdministrationTopReview({ administration }) {
  const op = useRef(null)
  const _t = useContext(MainContext)._t()

  return <>
    <OverlayPanel ref={op} className="h01">
      {_t.reviews.i_google}
    </OverlayPanel>

    <div className="absolute" style={{ right: 0 }}>
      <div className="flex justify-end">
        <div className="ml-4 mr-3 pt-1 text-bold">
          <div>{ratingToString(administration.rating)}</div>
        </div>
        <Icon name="star-full" size="1.2em" color="#8ccbc8" />

      </div>
      <div className="h02 mt-1 text-bold">
        {getReviewsLabel(administration.rating, _t.reviews)}
      </div>
      <div className="h02 mt-2 flex justify-end pointer" onClick={(e) => op.current.toggle(e)}>
        <div className="pr-2">
          {administration.userRatingsTotal} reviews
        </div>
        <Icon name="info-circle" size="1.2em" color="#8ccbc8" />
      </div>
    </div>
  </>

}