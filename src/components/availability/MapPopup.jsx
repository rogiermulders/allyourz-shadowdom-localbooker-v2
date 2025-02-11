import Carousel from "../carousel/Carousel"
import {useContext, useEffect, useRef, useState} from "react";
import SpecialFacilities from "../administration/SpecialFacilities.jsx";
import CategoriesCity from "../administration/CategoriesCity.jsx";

import {useNavigate} from "react-router-dom";
import {Button} from "primereact/button";
import {MainContext} from "../../contexts/MainContext";
import {toEuro} from "../../services/money";
import BreakfastIncluded from '../administration/BreakfastIncluded.jsx'


export default function MapPopup({administration}) {
  const ref = useRef()
  const nav = useNavigate()
  const [media, setMedia] = useState([])
  const context = useContext(MainContext)
  const _t = context._t()

  useEffect(() => {
    setMedia(administration.media.map(e => {
      return {url: e}
    }))
  }, [administration]);

  return <div style={{
    width: '250px',
    paddingBottom: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    left: '10px',
    paddingTop: '0px',
    overflow:'hidden',
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: '5px',
    border: '1px solid #ccc',
  }}>
    <div>
      <Carousel
        style={{borderRadius: '5px 5px 0px 0px'}}
        images={media}
        aspectRadio={'3-2'}
        size={640}
        onImageClick={() => {
          ref.current.click()
        }}
      />
    </div>
    {/*NAME*/}
    <div className="p-4 h6">
      <a ref={ref} onClick={(e) => {
        e.preventDefault()
        nav('/' + administration.slug)
      }} className="text-none" href={'/' + administration.slug} style={{color: 'var(--text-color)'}}>
        {administration.name}
      </a>
    </div>
    <div className="pl-4" style={{fontSize: '1.0em', color: 'var(--text-color)'}}>
      <CategoriesCity categories={administration.categories} city={administration.address.city}/>
    </div>
    <div className="pl-2 pt-5">
      <SpecialFacilities specialFacilities={administration.usps}/>
    </div>
    <div className="p-4 pt-2 pb-2">
      {administration.freeBreakfast !== 0 ?
      <hr/> :
      <BreakfastIncluded width="100%" border="solid 1px var(--gray-100)"/>}
    </div>
    <div className="flex align-center pl-4">
      <div className="w50 pl-4">
        <span className="h02">{_t.labels.from_night}</span>
        <div className="mt-2 font-bold h5">
          € {toEuro(administration.minPrice / administration.days)}
        </div>
      </div>
      <div className="w50 text-center">
        <Button label={_t.labels.go_to} onClick={() => nav('/' + administration.slug)}/>
      </div>
    </div>
  </div>
}