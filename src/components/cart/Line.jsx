import {toEuro} from "../../services/money";
import {classNames} from "primereact/utils";

export default function Line({text, price, chargingDescription, asTooltip}) {
    return <div className="grid">
      <div className={classNames({"lb-tooltip pointer-default grey-on-hover": asTooltip},'w80')}>
        {/*WHEN TOOLTIP*/}
        {asTooltip && <span className="tooltiptext">{chargingDescription}</span>}

        {text}

        {/*WHEN !TOOLTIP*/}
        {!asTooltip && <span className="h03">
          {chargingDescription ? ' - ' : ''}{chargingDescription}{chargingDescription ? '' : ''}
        </span>}
      </div>
      {price && <div className="w20 text-right text-color text-bold">
        {toEuro(price, true)}
      </div>}
    </div>

}


