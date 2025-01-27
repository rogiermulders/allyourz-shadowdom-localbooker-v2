import Carousel from '../carousel/Carousel'
import Props from './Props.jsx'
import Icon from '../../molecules/Icon.jsx'
import { col } from '../../services/buttstrip.ts'

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

        {/*<Divider type="solid" color="#ff0000">@todo</Divider>*/}

        {/* Facilities */}
        <div className="col p-10 facilities">
          {/*GROUP*/}
          {bookable.facilityGroups.map((fg, i) => {
            return <div key={i}>
              <div key={i} className="flex mt-8 h6 font-bold">
                <Icon name={fg.icon} size={'1.4em'}/>
                <div className="ml-6">{fg.name}</div>
              </div>
              {/*FACILITY*/}
              <div className="grid padding mt-8 h6" >
                {fg.facilities.map((f, j) => {
                  return <div key={j} className={col({def: 4, sm: 6, xs: 12})}>
                    <i className="pi pi-check"/> {f.name}
                  </div>
                })}
              </div>
            </div>
          })}
        </div>

      </div>
    </div>
  </div>
}