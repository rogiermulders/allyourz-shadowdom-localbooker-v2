import { Fieldset } from 'primereact/fieldset'
import { Checkbox } from 'primereact/checkbox'
import { useState } from 'react'
import NeedHelp from '../components/help/NeedHelp.jsx'

export default function PageTest() {
  const [checked, setChecked] = useState(false)
  return <div>
    <Fieldset legend="Test">
      <NeedHelp />
    </Fieldset>
  </div>
}