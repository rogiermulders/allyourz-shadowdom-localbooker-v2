import { Fieldset } from 'primereact/fieldset'
import { OverlayPanel } from 'primereact/overlaypanel';
import { useRef } from 'react'

export default function PageTest() {
  const op = useRef(null);
  return <div>
    <Fieldset legend="Test">

      <div onClick={(e) => op.current.toggle(e)}>
        DIT IS ME DIV
      </div>
      <OverlayPanel ref={op} className="debby">
        WEE WAA
      </OverlayPanel>
    </Fieldset>
  </div>
}