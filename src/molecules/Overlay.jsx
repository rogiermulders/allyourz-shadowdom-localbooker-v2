import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {CSSTransition} from 'react-transition-group';
import {classNames} from "primereact/utils";

let preventClose = false
const Overlay = forwardRef((
  {
    style,
    className,
    children,
    onOpen,
    onClose,
    width
  }, ref) => {

  const nodeRef = useRef()
  const [active, setActive] = useState(false)
  const [closing, setClosing] = useState(false)

  // Handle clicks outside
  useEffect(() => {
    function handleClickOutside() {
      if (preventClose && nodeRef.current) {
        preventClose = false
      } else {
        if (!closing) {
          setActive(false)
        }
      }
    }

    const bodyKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (!closing) {
          setActive(false)
        }
      }
    }
    document.body.addEventListener("mousedown", handleClickOutside)
    document.body.addEventListener("keydown", bodyKeyDown)
    return () => {
      document.body.removeEventListener("mousedown", handleClickOutside)
      document.body.removeEventListener("keydown", bodyKeyDown)
    }
  }, [nodeRef])

  useImperativeHandle(ref, () => ({
    open() {
      if (!closing) {
        setActive(true)
        if (onOpen) {
          onOpen()
        }
      }
    },
    close() {
      setActive(false)
      if (onClose) {
        onClose()
      }
    }
  }));

  style = style || {}
  width = width ? {width} : {width:'100%'}
  style = {...style,...width}

  return <>
    <CSSTransition
      in={active}
      nodeRef={nodeRef}
      timeout={300}
      classNames="overlay transition"
      onExit={() => setClosing(true)}
      onExited={() => setClosing(false)}
      unmountOnExit>

      {/*CONTAINER*/}
      <div ref={nodeRef}
           className="overlay container"
           onMouseDown={() => {
             preventClose = true
           }}>

        {/*ARROW*/}
        <div className="box-arrow-border">
          <div className="box-arrow-background"></div>
        </div>

        {/*CONTENT CONTAINER*/}
        <div className={classNames("content-container", className)} style={style}>
          {/*CONTENT*/}
          {children}
        </div>

      </div>

    </CSSTransition>
  </>

})
Overlay.displayName = 'Overlay'
export default Overlay
