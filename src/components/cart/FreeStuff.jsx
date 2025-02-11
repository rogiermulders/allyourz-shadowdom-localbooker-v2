import Line from "./Line.jsx";
import { useContext } from 'react'
import { MainContext } from '../../contexts/MainContext.tsx'

export default function FreeStuff({cartData, asToolip}) {
  const _t = useContext(MainContext)._t()


  const product = cartData.products[0];
  const { includedOptions } = product

  return <ul className="ul-none p-0 m-0">
    {includedOptions.map((e, i) => {
      return <li key={i}>
        <Line
          text={e.name}
          price={e.price.total === 0 ? '' : e.price.total}
          chargingDescription={e.chargingDescription}
          asTooltip={asToolip}
          includedText={_t.cart.included}
        />
      </li>
    })}
  </ul>

}