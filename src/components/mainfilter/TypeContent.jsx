
import {ACCOMMODATION_TYPES} from "../../data/constants";
import {Checkbox} from 'primereact/checkbox';
import {useRecoilState} from "recoil";
import recoilMainFilter from "../../recoil/recoilMainFilter";
import {useContext} from "react";
import {MainContext} from "../../contexts/MainContext";


export default function TypeContent() {
  const context = useContext(MainContext)
  const [mainFilter, setMainFilter] = useRecoilState(recoilMainFilter);
  const {category} = mainFilter.type

  return <ul className="ul-none m-0 p-0">
    {ACCOMMODATION_TYPES.map(data => {
      return <li className="mt-3" key={data.value}>
        <Checkbox
          inputId={data.value}
          name="type"
          value={data.value}
          onChange={(e) => {
            const clone = [...category]
            const i = category.indexOf(e.value)
            i === -1 ? clone.push(e.value) : clone.splice(i, 1)
            setMainFilter(old => {return {...old, type: {category: clone}}})
          }}
          checked={category.includes(data.value)}/>

        {/*Yuk.. tp (template) is the template used when managing locales from the backend.*/}
        {/*Here we have the locales hard coded so no tp*/}
        <label className="ml-2" htmlFor={data.value}>{data.label[context.hostLocale === 'tp' ? 'nl' : context.hostLocale]}</label>
      </li>})}
  </ul>

}
