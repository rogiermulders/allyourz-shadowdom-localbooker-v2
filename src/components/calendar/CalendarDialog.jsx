import React, { forwardRef, useImperativeHandle } from "react";
import {Dialog} from "primereact/dialog";
import {lte} from "../../services/buttstrip";
import {useContext, useState} from "react";
import {MainContext} from "../../contexts/MainContext";
import {freeze,unFreeze} from "../../services/hostscroll";
import AdministrationCalendar from "./AdministrationCalendar.jsx";
import zIndex from '../../services/zIndex';

const CalendarDialog = forwardRef( (props, ref) => {

  const context = useContext(MainContext)

  const _t = context._t()
  const [administrationId, setAdministrationId] = useState({})
  const [visible,setVisible] = useState(false)


  useImperativeHandle(ref, () => ({
    open(administrationId) {
      freeze()
      setAdministrationId(administrationId)
      setVisible(true)
    },
  }));

  return <>
    <Dialog
      header={_t.labels.select_dates}
      pt={{
        content: {
          style: {overflow: 'hidden'}
        }
      }}
      contentStyle={{padding: 0}}
      onShow={() => {zIndex.tempFix()}}
      appendTo={context.shadowRoot}
      visible={visible}
      onHide={() => {
        setVisible(false)
        zIndex.removeTempFix()
        setTimeout(() => unFreeze(),250) // Give it a tad... just cosmetic
      }}
      // style={wh(
      //   {def: '400px',xs:'300px'},
      //   {def: '550px',xs:'440px'},
      // )}
    >
      <div className="m-0" style={{width:'100%'}}>
        <AdministrationCalendar
          width={lte('sm') ? '80vw' : '375px'}
          fontSize={lte('sm') ? '1.4em' : '1.2em'}
          administration_id={administrationId}
          onClose={() => {
            setVisible(false)
            setTimeout(() => unFreeze(),250) // Give it a tad... just cosmetic
          }}
        />
      </div>
    </Dialog>
  </>
})
CalendarDialog.displayName = 'CalendarDialog'
export default CalendarDialog
