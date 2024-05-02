import {Button} from "primereact/button";
import Icon from "./Icon.jsx";

export default function Takeover({onClose, buttonA, buttonB, children}) {

  return <>

    <div className="takeover">
      <div className="header flex" style={{backgroundColor: 'var(--surface-a)'}}>
        <div className="w50 h4 pt-4 pb-4 pl-2">
          Kies filters
        </div>
        <div className="w50 text-right p-4 pt-5">
          <Button rounded
                  outlined
                  severity="secondary"
                  icon={<Icon name="x"/>}
                  onClick={() => onClose()}/>
        </div>
      </div>

      <div className="content p-8" style={{backgroundColor: 'var(--surface-c)'}}>
        {children}
      </div>

      <div className="footer p-4 text-right" style={{backgroundColor: 'var(--surface-a)'}}>
        {buttonA && <Button className="mr-4"
                            label={buttonA.label}
                            outlined
                            onClick={buttonA.onClick}/>}

        {buttonB && <Button label={buttonB.label}
                            onClick={buttonB.onClick}/>}

      </div>

    </div>
  </>
}
