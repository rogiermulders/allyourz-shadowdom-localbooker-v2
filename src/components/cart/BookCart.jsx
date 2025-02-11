import { toEuro } from '../../services/money'
import { imageResize } from '../../services/imageResize'
import { localeOption } from 'primereact/api'
import { useRecoilValue } from 'recoil'
import selectorMainFilter from '../../recoil/selectors/selectorMainFilter'
import Fees from './Fees.jsx'
import Extras from './Extras.jsx'
import { useContext } from 'react'
import { MainContext } from '../../contexts/MainContext'
import FreeStuff from './FreeStuff.jsx'

export default function BookCart({ administration, bookable, cartData }) {
  const context = useContext(MainContext)
  const _t = context._t()
  const { checkIn, checkOut } = useRecoilValue(selectorMainFilter)
  const monthNames = localeOption('monthNames')

  return <>
    <div className="ar-box-2-1">
      <div className="ar-box-inside-2-1">
        <img alt={administration.name} className="ar-image" src={imageResize(administration.images[0]?.url, 640)} />
      </div>
    </div>

    <div className="grid mt-4 mb-4">
      <div className="col-2">
        <div className="circular--landscape _50px">
          <img alt={bookable.name} src={imageResize(bookable.images[0]?.url, 256)} />
        </div>
      </div>

      <div className="col-10 pl-3">
        <div className="h3">{administration.name}</div>
        <div className="h6 mt-6">{bookable.name}</div>
      </div>
    </div>
    <div className="pl-3 pt-6 pb-6 text-color-secondary">
      {checkIn.getDate() + ' ' +
        monthNames[checkIn.getMonth()] + ' ' +
        checkIn.getFullYear() + ' - ' +
        checkOut.getDate() + ' ' +
        monthNames[checkOut.getMonth()] + ' ' +
        checkOut.getFullYear()
      }
    </div>

    {cartData && <>

      {/* PRIJSINFORMATIE */}
      <hr style={{ borderTop: '1px solid var(--text-secondary)' }} />
      <div className="ml-4 mr-4 mb-6">
        <h4 className="mb-3">Prijsinformatie</h4>
        <Fees cartData={cartData} asToolip />
      </div>


      {/* FREE STUFF */}
      {cartData.products[0].includedOptions.length > 0 && <>
      <hr style={{ borderTop: '1px solid var(--text-secondary)' }} />

      <div className="ml-4 mr-4 mb-6 mt-6">
        <FreeStuff cartData={cartData} asToolip />
      </div>
      </>}

      <hr style={{ borderTop: '1px solid var(--text-secondary)' }} />

      <div className="mr-4 ml-4">
        <div className="grid">
          <div className="h4 w60">
            {_t.cart.total}
          </div>
          <div className="h4 w40 text-bold text-right">
            {toEuro(cartData.totals.total, true)}
          </div>
        </div>
      </div>

      {/* TOU AND TAX COST */}
      {cartData.totals.sumDepositFees > 0 && <>
        <hr style={{ borderTop: '1px solid var(--text-secondary)' }} />
        <div className="col pl-3 pt-6 pb-6 h6">
        </div>
        <div className="ml-4 mr-4">
          <Extras cartData={cartData} asTooltip />
        </div>

        <hr style={{ borderTop: '1px solid var(--text-secondary)' }} />

        {/*TOTAL*/}
        <div className="ml-4 mr-4">
          <div className="grid">
            <div className="h6 w80">
              {_t.cart.total} {_t.cart.deposit_fees}
            </div>
            <div className="h6 w20 text-bold text-right">
              {toEuro(cartData.totals.sumDepositFees, true)}
            </div>
          </div>
        </div>
      </>}

      <hr style={{ borderTop: '1px solid var(--text-secondary)' }} />
    </>}
  </>
}
