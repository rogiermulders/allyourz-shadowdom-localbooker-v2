import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from 'react';

let opening = false
const FakeDropdown = forwardRef(function FakeDropdown({placeholder, children, onOpen}, ref) {

  const contentRef = useRef(null)
  const [active, setActive] = useState(false)

  useImperativeHandle(ref, () => ({
    open: () => {
      opening = true
      setActive(true)
    },
    close: () => {
      setActive(false)
    }
  }));

  useEffect(() => {
    if (active && onOpen) {
      onOpen()
    }
  }, [active])

  // Handle clicks outside
  useEffect(() => {
    /**
     * Escape key
     */
    const keyDown = (e) => {
      if (e.key === 'Escape') {
        setActive(false)
        opening = false
      }
    }
    /**
     * Close the fake Dropdowns on outside click
     */
    const mouseDown = (e) => {
      if (contentRef.current) {
        const bc = contentRef.current.getBoundingClientRect()
        if (e.clientX < bc.left || e.clientX > bc.right || e.clientY < bc.top || e.clientY > bc.bottom) {
          if (!opening) {
            setActive(false)
          }
          opening = false
        }
      }
    }
    document.addEventListener("keydown", keyDown, false)
    document.addEventListener("click", mouseDown, false)
    return () => {
      document.removeEventListener("keydown", keyDown, false)
      document.removeEventListener("click", mouseDown, false)
    }
  }, [])

  return <div className="fake-dropdown">
    <div
      className="p-dropdown p-component p-inputwrapper p-inputwrapper-filled"
      style={{width: '100%'}}
      onClick={(e) => {
        e.stopPropagation()
        setActive(old => !old)
      }}>
      <span className="p-dropdown-label p-inputtext">{placeholder}</span>
      <div className="p-dropdown-trigger">
        <span className="p-dropdown-trigger-icon p-clickable pi pi-chevron-down"/>
      </div>
    </div>
    {active && <div style={{position: 'relative'}}>
      <div ref={contentRef} className="content">
        {children}
      </div>
    </div>}

  </div>
})
export default FakeDropdown