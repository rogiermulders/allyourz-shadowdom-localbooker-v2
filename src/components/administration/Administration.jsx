import {col, getBp} from "../../services/buttstrip";
import Carousel from "../carousel/Carousel";
import Usps from "./Usps.jsx";
import SpecialFacilities from "./SpecialFacilities.jsx";
import {useContext, useRef} from "react";
import {MainContext} from "../../contexts/MainContext";
import Icon from "../../molecules/Icon.jsx";
import ForwardDialog from "../../molecules/ForwardDialog.jsx";

export default function Administration({administration}) {
  const context = useContext(MainContext)
  const _t = context._t()
  const ref = useRef()

  return <>

    <ForwardDialog ref={ref}/>

    <div className="grid text-color">
      <div className={col({def: 12})}>
        <div className="p-8">
          <span className="h3"> {administration.name}</span>
        </div>

        <div className="location"></div>

        <div className="carousel">
          <Carousel images={administration.images} aspectRadio={{xs: '2-1', sm: '5-2'}[getBp()] || '2-1'}/>
        </div>

        <div className="mt-8 m-4">
          <SpecialFacilities specialFacilities={administration.specialFacilities}/>
        </div>

        <div className="h5 m-4">
          {administration.oneLiner}
        </div>

        <div className="mt-8 m-6 text-pre-wrap">
          {administration.shortDescription}
          <div
            onClick={() => ref.current.open(
              administration.name,
              <div
                className="p-10"
                dangerouslySetInnerHTML={{
                  __html: administration.description.replaceAll("\n", "<br/>")
                }}/>

            )}
            className="mt-8
              text-underline
              flex pointer
              hover_highlight">
            {_t.page_pdp.full_description || 'Uitgebreide omschrijving'}
            <Icon name="chevron-right" size="1.3em" style={{marginLeft: '0.3em'}}/>

          </div>
        </div>


        <div className="mt-8 m-4">
          <Usps usps={administration.usps}/>
        </div>
      </div>
    </div>
  </>

}
