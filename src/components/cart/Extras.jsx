import {chargeModesThatNeedADropdown} from "../../data/constants";
import Line from "./Line.jsx";

export default function Extras({cartData, asTooltip}) {

  const product = cartData.products[0];
  const depositFees = product.depositOptions;

  return <ul className="ul-none p-0 m-0">
    {depositFees.map((e, i) => {
      return <li key={i}>
        <Line
          text={(chargeModesThatNeedADropdown.includes(e.chargeMode) ? e.price.count + ' x ' : '') + e.name}
          price={e.price.total === 0 ? '' : e.price.total}
          chargingDescription={e.chargingDescription}
          asTooltip={asTooltip}
        />
      </li>
    })}
  </ul>

}