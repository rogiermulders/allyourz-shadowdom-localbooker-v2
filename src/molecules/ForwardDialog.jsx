import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Dialog } from 'primereact/dialog'
import { wh } from '../services/buttstrip'
import { useContext, useState } from 'react'
import { MainContext } from '../contexts/MainContext'
import { freeze, unFreeze } from '../services/hostscroll'
import zIndex from '../services/zIndex'

const ForwardDialog = forwardRef(({ size, closable }, ref) => {

  const context = useContext(MainContext)
  const [content, setContent] = useState(null)
  const [header, setHeader] = useState('')
  const [visible, setVisible] = useState(false)
  closable = closable === undefined ? true : closable

  useImperativeHandle(ref, () => ({
    open(header, content) {
      freeze()
      setHeader(header)
      setContent(content)
      setVisible(true)
    }
  }))

  useEffect(() => {
    return () => {
      if (visible){
        unFreeze()
        zIndex.removeTempFix()
      }

    }
  }, [visible])

  /**
   * Calcs the width in pix
   */
  const wtop = (perc) => {
    return ((perc / 100) * context.breakpoint.sw) + 'px'
  }
  const htop = (perc) => {
    return (((perc / 100) * context.breakpoint.ih)) + 'px'
  }


  switch (size) {
    case 'small':
      size = wh(
        { def: wtop(30), md: wtop(40), sm: wtop(50), xs: wtop(100) },
        { def: htop(30), md: htop(40), sm: htop(50), xs: htop(100) }
      )
      break
    default:
      size = wh(
        { def: wtop(50), md: wtop(70), sm: wtop(80), xs: wtop(100) },
        { def: htop(50), md: htop(70), sm: htop(80), xs: htop(100) }
      )
  }


  if (!visible) return null
  return <>
    <Dialog
      header={header}
      onShow={() => {
        zIndex.tempFix()
      }}
      draggable={true}
      closable={closable}
      visible={visible}
      onHide={() => {
        setVisible(false)
      }}
      contentStyle={{ padding: 0 }}
      style={size}>
      <div className="m-0 text-color">
        {content}
      </div>
    </Dialog>

  </>

})
ForwardDialog.displayName = 'ForwardDialog'
export default ForwardDialog
