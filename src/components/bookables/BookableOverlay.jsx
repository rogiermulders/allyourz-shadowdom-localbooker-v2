import {forwardRef, useImperativeHandle} from "react";
import {Dialog} from "primereact/dialog";
import {col, wh} from "../../services/buttstrip";
import {useContext, useState} from "react";
import {MainContext} from "../../contexts/MainContext";
import Carousel from "../carousel/Carousel";
import Icon from "../../molecules/Icon.jsx";
import Props from "./Props.jsx";
import zIndex from '../../services/zIndex'

const BookableOverlay = forwardRef((props, ref) => {

  const context = useContext(MainContext)
  const [bookable, setBookable] = useState({})
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    open(bookable) {
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
  return <div className="my-overlay">
    <div style={{
      marginTop: '50px',
      width:wtop(50), height:htop(50), backgroundColor:'white'}}>

    </div>
  </div>


})
BookableOverlay.displayName = 'BookableOverlay'
export default BookableOverlay
