import {col} from "../../services/buttstrip";
import {Checkbox} from "primereact/checkbox";
import {toEuro} from "../../services/money";
import {Dropdown} from 'primereact/dropdown'
import {useContext, useEffect, useState} from "react";
import {MainContext} from "../../contexts/MainContext";
import {useRecoilValue} from "recoil";
import selectorMainFilter from "../../recoil/selectors/selectorMainFilter";
import {chargeModesThatNeedADropdown} from "../../data/constants";

export default function FormOptions({optionalFees, setOptions, options}) {

  const context = useContext(MainContext)
  const _t = context._t()
  const mainFilter = useRecoilValue(selectorMainFilter)
  const [feeOptions, setFeeOptions] = useState([])

  useEffect(() => {
    const fop = []
    for (let i = 0; i <= mainFilter.bookable.maxGuests; i++) {
      fop.push({label: ( i === 0 ? (_t.labels.none || 'Geen') : i ), value: i})
    }
    setFeeOptions(fop)
  }, [mainFilter.bookable.maxGuests])


  return <>
    <div className="h3 pt-4 pb-2 pl-2">Toevoegingen</div>
    <div className="grid">
      <div className={col({xl: 6, lg: 8, md: 10, sm: 12})}>
        <ul className="m-0 p-0 ul-none">
          {optionalFees.map((fee, i) => {
            // Prijs per huisdier per nacht enkel ter info
            if(['PET','POR'].includes(fee.code)){
              return null
            }
            // The other stuff
            return <li key={i} className="flex flex-center pt-2 pb-2">
              <div className="text-center" style={{width: '15%'}}>
                {chargeModesThatNeedADropdown.includes(fee.chargeMode) ?
                  <Dropdown className="w100"
                            placeholder="Kies"
                            options={feeOptions}
                            onChange={(e) => {
                              setOptions(old => {
                                // Always remove
                                old = [...old.filter(item => item.id !== fee.id)]
                                if (e.value === 0) {
                                  // removed already so:
                                  return old
                                } else {
                                  // add or replace
                                  return [...old, {id: fee.id, quantity: e.value}]
                                }
                              })
                            }}
                            value={
                              options.filter(item => item.id === fee.id)[0]?.quantity
                            }
                            appendTo={context.shadowRoot}/> :
                  <Checkbox
                    inputId={fee.id}
                    checked={!!options.filter(item => item.id === fee.id).length}
                    onChange={(e) => {
                      setOptions(old => {
                        return e.checked ? [...old, {id: fee.id, quantity: 1}] : old.filter(item => item.id !== fee.id)
                      })
                    }}/>
                }
              </div>
              <div className="w60">
                <label className="ml-4 pointer" htmlFor={fee.id}>
                  {fee.name} <span className="text-secondary">{fee.chargingDescription}</span>
                </label>
              </div>
              <div className="w20 text-right">
                <span>{toEuro(fee.price.unit, true)}</span>
              </div>

            </li>
          })}
        </ul>
      </div>
    </div>
  </>

}
