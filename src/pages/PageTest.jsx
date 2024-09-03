import { Fieldset } from 'primereact/fieldset'
import { Checkbox } from 'primereact/checkbox'
import { useState } from 'react'
import { breakpoints } from '../data/constants';

export default function PageTest() {

  // console.log(breakpoints)
  // console.log(window.innerWidth)

  const bp = breakpoints.find((el) => window.innerWidth >= el.w)
  console.log(bp.s)
  
  const [checked, setChecked] = useState(false)
  return <div>
    <Fieldset legend="Test">
      <Checkbox  checked={checked} onChange={e=>setChecked(e.checked)}  />
    </Fieldset>
  </div>
}