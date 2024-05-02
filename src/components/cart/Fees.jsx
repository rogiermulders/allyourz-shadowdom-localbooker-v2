import {toEuro} from "../../services/money";
import {chargeModesThatNeedADropdown} from "../../data/constants";
import Line from "./Line.jsx";

export default function Fees({cartData, asToolip}) {

  const product = cartData.products[0];
  const mandatoryFees = product.mandatoryOptions;
  const optionalFees = product.optionalOptions;
  const cartRemark = product.cartRemark;
  const {stay} = product.price

  const fees = [...mandatoryFees, ...optionalFees]

  return <ul className="ul-none p-0 m-0">
    <li>
      <Line
        text={stay.days + ' x ' + toEuro(stay.cost / stay.days, true)}
        price={stay.cost}
        chargingDescription={'per nacht'}
        asTooltip={asToolip}
      />
    </li>
    {fees.length > 0 && fees.map((e, i) => {
      return <li key={i}>
        <Line
          text={(chargeModesThatNeedADropdown.includes(e.chargeMode) ? e.price.count + ' x ' : '') + e.name}
          price={e.price.total === 0 ? '' : e.price.total}
          chargingDescription={e.chargingDescription}
          asTooltip={asToolip}
        />
      </li>
    })}
    {cartRemark && <li className="pt-4">
      <Line text={cartRemark}/>
    </li>}
  </ul>

}