import { Fieldset } from 'primereact/fieldset'
import { Checkbox } from 'primereact/checkbox'
import { useState } from 'react'

export default function PageTest() {

  const [checked, setChecked] = useState(false)
  return <div>
    <Fieldset legend="Test">
      <Checkbox  checked={checked} onChange={e=>setChecked(e.checked)}  />
    </Fieldset>
  </div>
}