import Carousel from "../carousel/Carousel"
import {useContext, useEffect, useRef, useState} from "react";
import SpecialFacilities from "../administration/SpecialFacilities.jsx";
import CategoriesCity from "../administration/CategoriesCity.jsx";

import {useNavigate} from "react-router-dom";
import {Button} from "primereact/button";
import {MainContext} from "../../contexts/MainContext";
import {toEuro} from "../../services/money";


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
    paddingTop: '10px',

    position: 'absolute',
    backgroundColor: '#f8f8f8',
    borderRadius: '5px',
    border: '1px solid #ccc',
  }}>
    <div>
      <Carousel
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
      <hr/>
    </div>
    <div className="flex align-center pl-4">
      <div className="w50 pl-4">
        <span className="h02">Vanaf /nacht</span>
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