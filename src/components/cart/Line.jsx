import {toEuro} from "../../services/money";
import {classNames} from "primereact/utils";

export default function Line({text, price, chargingDescription, asTooltip, includedText}) {


    return <div className="flex pb-1">
      <div className={classNames({"lb-tooltip pointer-default grey-on-hover": asTooltip && !includedText},'w80')}>
        {/*WHEN TOOLTIP*/}
        {asTooltip && !includedText && <span className="tooltiptext">{chargingDescription}</span>}

        {text}

        {/*WHEN !TOOLTIP*/}
        {!asTooltip && !includedText && <span className="h03">
          {chargingDescription ? ' - ' : ''}{chargingDescription}{chargingDescription ? '' : ''}
        </span>}
      </div>

      {price && !includedText && <div className="w20 text-right text-color text-bold">
        {toEuro(price, true)}
      </div>}

      {includedText &&
        <div className="text-right text-color w100 h01">
          {includedText}
        </div>
      }
    </div>

}


