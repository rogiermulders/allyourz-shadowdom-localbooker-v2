import { Fieldset } from 'primereact/fieldset'
import { Checkbox } from 'primereact/checkbox'
import { useState } from 'react'
import Layout from './Layout.jsx'

export default function PageTest() {
  const [checked, setChecked] = useState(false)
  return <Layout>
    <Fieldset legend="Test">
      <Checkbox  checked={checked} onChange={e=>setChecked(e.checked)}  />
    </Fieldset>
  </Layout>
}