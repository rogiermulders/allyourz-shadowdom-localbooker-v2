import {useContext, useEffect, useRef, useState} from "react";
import {useRecoilState, useRecoilValue} from 'recoil'
import axios from "axios";
import recoilForm from "../recoil/recoilForm";
import selectorMainFilter from '../recoil/selectors/selectorMainFilter'
import {col} from '../services/buttstrip'
import BookCart from '../components/cart/BookCart.jsx'
import FormNaw from "../components/forms/FormNaw.jsx";
import {getYmd} from "../services/dates";
import {MainContext} from "../contexts/MainContext";
import recoilConfig from "../recoil/recoilConfig";
import {useNavigate} from "react-router-dom";
import recoilCartData from "../recoil/recoilCartData";
import PowerdBy from "../molecules/PowerdBy.jsx";
import scrollIntoViewWithOffset from "../services/scrollIntoViewWithOffset";

export default function PageForm() {
  const context = useContext(MainContext)
  const navigate = useNavigate()
  const config = useRecoilValue(recoilConfig)
  const _t = context._t()
  const srollInViewRef = useRef(null)
  const {
    bookable,
    administration,
    checkIn,
    checkOut,
    adults,
    children,
    babies,
    pets
  } = useRecoilValue(selectorMainFilter)
  const [form, setForm] = useRecoilState(recoilForm)
  const [options, setOptions] = useState(null)

  // The data
  const [optionalFees, setOptionalFees] = useState(null)
  const [cartData, setCartData] = useRecoilState(recoilCartData)

  /**
   * Set the options from the recoilForm
   */
  useEffect(() => {
    setOptions(form.options)
  }, [form.options])


  /**
   * Gets all the bookable optional fees
   */
  useEffect(() => {

    scrollIntoViewWithOffset(srollInViewRef.current, config.offset, config.scroll)

    axios.post('/v1/booking/options',
      {
        locale: context.hostLocale,
        id: bookable.id,
        bookable_id: bookable.id,
        guests: adults + children,
        quantity: 1,
        checkIn: getYmd(checkIn),
        checkOut: getYmd(checkOut),
      }
    ).then(res => {
      setOptionalFees(res.data.optionalFees)
    })
  }, [])

  /**
   * Get the cart data
   */
  useEffect(() => {

    if (!options) return

    const products = [
      {
        id: bookable.id,
        guests: {
          adults,
          children,
          babies,
          pets
        },
        quantity: 1,  // This is the ROOM quantity
        startDate: getYmd(checkIn),
        endDate: getYmd(checkOut),
        options
      }
    ]
    
    axios.post('/v1/booking/cart', {
      locale: context.hostLocale,
      checkSource: false,
      cart: {
        id: administration.id,
        products
      }
    }).then(res => {

      setCartData(res.data)
      // setCartData(res.data.basket[0])
    })
  }, [options])

  /**
   * BUTTONS
   */
  const onFormSubmit = (formData) => {

    // Move in the formdata and the options (recoil)
    setForm({...formData, options})
    setTimeout(() => {
      navigate('/check')
    }, 0)

  }

  return <>
    <div ref={srollInViewRef} className="grid padding text-color">
      <div className={col({md: 8, sm: 12})}>
        <div className="h6">{_t.page_form.labels.almost_ready}</div>
        <div className="h4">{_t.page_form.labels.travel_company}</div>
        <div className="mt-4">
          {_t.page_form.labels.occupancy} <span
          className="font-bold">{adults}</span> {_t.labels[adults > 1 ? 'adults' : 'adult']}
          {children > 0 && <>, <span
            className='font-bold'>{children}</span> {_t.labels[children > 1 ? 'children' : 'child']}</>}
          {babies > 0 && <>, <span className='font-bold'>{babies}</span> {_t.labels[babies > 1 ? 'babys' : 'baby']}</>}
          {pets > 0 && <>, <span className='font-bold'>{pets}</span> {_t.labels[pets > 1 ? 'pets' : 'pet']}</>}
        </div>
        <div className="h4">{_t.page_form.labels.fill_the_form}
        </div>
        {/* THE FORM */}
        {optionalFees && <FormNaw
          optionalFees={optionalFees}
          onFormSubmit={onFormSubmit}
          options={options}
          setOptions={setOptions}
        />}
        {/* THE FORM */}
      </div>

      {/*CART PART*/}
      <div className={col({md: 4, sm: 12})}>
        <div style={{position: "sticky", top: (config.offset + 8)}}>
          <BookCart
            administration={administration}
            bookable={bookable}
            cartData={cartData}
          />
        </div>
      </div>
    </div>
    <PowerdBy/>
  </>

}
