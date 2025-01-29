import Carousel from '../carousel/Carousel'
import Props from './Props.jsx'
import Facilities from '../facilities/Facilities.jsx'

export default function BookableDialogContent({bookable}) {
  return <div className="m-0 text-color">
    <div>

      <Carousel images={bookable.images} aspectRadio={"2-1"}/>

      <div className="grid">
        <div className="col p-10 text-pre-wrap">
          {bookable.description}
        </div>

        <div className="col p-10">
          <Props bookable={bookable}/>
        </div>

        <div className="col p-10">
          <Facilities facilityGroups={bookable.facilityGroups}/>
        </div>
      </div>
    </div>
  </div>
}