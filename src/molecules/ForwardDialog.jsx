import { forwardRef, useEffect, useImperativeHandle } from 'react'
import { Dialog } from 'primereact/dialog'
import { w } from '../services/buttstrip'
import { useContext, useState } from 'react'
import { MainContext } from '../contexts/MainContext'
import { freeze, unFreeze } from '../services/hostscroll'
import zIndex from '../services/zIndex'

const ForwardDialog = forwardRef((props, ref) => {

  const context = useContext(MainContext)
  const [content, setContent] = useState('')
  const [header, setHeader] = useState('')
  const [visible, setVisible] = useState(false)
  const [size, setSize] = useState(undefined)
  const [closable, setClosable] = useState(true)
  const [position, setPosition] = useState('center')

  useImperativeHandle(ref, () => ({
    open({ header, content, size, closable, position }) {


      freeze()
      setHeader(header)
      setContent(content)
      if(size) setSize(size)
      if(typeof closable !== 'undefined') setClosable(closable)
      if(position) setPosition(position)
      setVisible(true)
    }
  }))

  useEffect(() => {
    return () => {
      if (visible){
        setHeader('')
        setContent(null)
        setSize(undefined)
        setClosable(true)
        setPosition('center')
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


  let style
  switch (size) {
    case 'small':
      style = w(
        { def: wtop(30), md: wtop(40), sm: wtop(50), xs: wtop(100) }
      )
      break
    default:
      style = w(
        { def: wtop(50), md: wtop(70), sm: wtop(80), xs: wtop(100) },
      )
  }

  if (!visible) return null
  return <>
    <Dialog
      onMaskClick={() => {
        setContent(null)
        setVisible(false)
      }}
      header={header}
      onShow={() => {
        zIndex.tempFix()
      }}
      draggable={true}
      closable={closable}
      visible={visible}
      onHide={() => {
        setContent(null)
        setVisible(false)
      }}
      position={position}
      contentStyle={{ padding: 0 }}
      style={style}>
      <div className="m-0 text-color">
        {content}
      </div>
    </Dialog>

  </>

})
ForwardDialog.displayName = 'ForwardDialog'
export default ForwardDialog
