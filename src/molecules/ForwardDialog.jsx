import React, {forwardRef, useImperativeHandle} from "react";
import {Dialog} from "primereact/dialog";
import {wh} from "../services/buttstrip";
import {useContext, useState} from "react";
import {MainContext} from "../contexts/MainContext";
import {freeze, unFreeze} from "../services/hostscroll";
import zIndex from '../services/zIndex'
const ForwardDialog = forwardRef((props, ref) => {

  const context = useContext(MainContext)
  const [content, setContent] = useState(null)
  const [header, setHeader] = useState('')
  const [visible, setVisible] = useState(false)

  useImperativeHandle(ref, () => ({
    open(header, content) {
      freeze()
      setHeader(header)
      setContent(content)
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
      header={header}
      onShow={() => {zIndex.tempFix()}}
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
        {content}
      </div>
    </Dialog>

  </>

})
ForwardDialog.displayName = 'ForwardDialog'
export default ForwardDialog
