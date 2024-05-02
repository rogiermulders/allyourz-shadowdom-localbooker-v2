import {useRecoilState} from "recoil";
import recoilMainFilter from "../../recoil/recoilMainFilter";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {useContext} from "react";
import {MainContext} from "../../contexts/MainContext";

export default function WhoContent({usedIn}) {

  const context = useContext(MainContext)
  const _t = context._t()
  const [mainFilter, setMainFilter] = useRecoilState(recoilMainFilter);
  const {adults, children, babies, pets} = mainFilter.who


  const plusMinusClicked = (type, direction) => {
    const o = {}
    o[type] = eval(type) + direction
    setMainFilter(old => {
      return {...old, who: {...old.who, ...o}}
    })
  }

  const InpNumber = ({name, type}) => {

    const minusDisabled = (type === 'babies' && babies === 0)
      || (type === 'children' && children === 0)
      || (type === 'adults' && adults === 1)
      || (type === 'pets' && pets === 0)

    const plusDisabled = (usedIn === 'PdpCart')
      && (
        (['adults', 'children'].includes(type) && (children + adults) >= context.maxGuests)
        || (type === 'pets' && pets >= context.maxPets)
      )

    return <div className="grid grid-valign mt-2 mb-2">
      <div className="w40 pl-4">
        {name}
      </div>
      <div className="w20 text-center">
        {/*THE MINUS BUTT*/}
        <Button
          onClick={() => {
            plusMinusClicked(type, -1)
          }}
          icon="pi pi-minus"
          severity="secondary"
          disabled={minusDisabled}
          outlined rounded/>
      </div>
      <div className="w20">
        <InputText className="w100 text-center" readOnly value={eval(type)}/>
      </div>
      <div className="w20 text-center">
        {/*THE PLUS BUTT*/}
        <Button
          onClick={() => {
            plusMinusClicked(type, 1)
          }}
          icon="pi pi-plus"
          severity="secondary"
          disabled={plusDisabled}
          outlined rounded/>
      </div>
    </div>
  }

  return <div style={{backgroundColor: '#ffffff'}}>
    <InpNumber name={_t.labels.adults} type="adults"/>
    <InpNumber name={_t.labels.children} type="children"/>
    <InpNumber name={_t.labels.babys} type="babies"/>
    <InpNumber name={_t.labels.pets} type="pets"/>
  </div>

}
