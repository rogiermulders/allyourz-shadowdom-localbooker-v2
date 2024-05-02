import React, {forwardRef, useImperativeHandle} from "react";
import {Dialog} from "primereact/dialog";
import {col, wh} from "../../services/buttstrip";
import {useContext, useState} from "react";
import {MainContext} from "../../contexts/MainContext";
import {freeze, unFreeze} from "../../services/hostscroll";
import Carousel from "../carousel/Carousel";
import Icon from "../../molecules/Icon.jsx";
import Props from "./Props.jsx";
import zIndex from '../../services/zIndex'
const BookableDialog = forwardRef((props, ref) => {

  const context = useContext(MainContext)
  const [bookable, setBookable] = useState({})
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    open(bookable) {
      freeze()
      setBookable(bookable)
      setVisible(true)
    }
  }));

  /**
   * Calcs the width in pix
   */
  const wtop = (perc) => {
    return ((perc / 100) * context.breakpoint.sw) + 'px'
  }
  const htop = (perc) => {
    return (((perc / 100) * context.breakpoint.ih)) + 'px'
  }

  if (!visible) return null
  return <>
    <Dialog
      header={bookable.name}
      // onShow={() => {zIndex.tempFix()}}
      draggable={true}
      
      visible={visible}
      onHide={() => {
        setVisible(false)
        zIndex.removeTempFix()
        setTimeout(() => unFreeze(), 250) // Give it a tad... just cosmetic
      }}
      contentStyle={{padding: 0}}
      style={wh(
        {def: wtop(50), md: wtop(70), sm: wtop(80), xs: wtop(100)},
        {def: htop(50), md:  htop(70), sm: htop(80), xs: htop(100)},
      )}>
      <div className="m-0 text-color">
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
    </Dialog>

  </>

})
BookableDialog.displayName = 'BookableDialog'
export default BookableDialog
