import {Swiper, SwiperSlide} from "swiper/react";
import {Lazy} from "swiper";
import {imageResize} from "../../services/imageResize";
import React, {useRef, FC} from "react";
import {Button} from "primereact/button";

type Image = {
    alt: string
    description: string
    url: string
}
type CarouselProps = {
    images: Image[],
    aspectRadio?: '3-2' | '5-2' | '2-1' | '1-1',
    size?: 640 | 750 | 828 | 1080 | 1200 | 1920 | 2048 | 3840,
    onImageClick?: any
}

const buttStyle = {
    fontSize: '1.5em',
    width:'2em',
    height:'2em',
    fontWeight: 'bold',
    marginTop: '-1.25em',
    opacity: '1',
    color:'white',
    border: '0px'
}
const Carousel: FC<CarouselProps> = ({images, aspectRadio, size, onImageClick}) => {

    const swiperRef = useRef(null)

    size = size || 1080

    return <div className="w100">

        
        <Swiper
            onSwiper={(swiper) => {
                swiperRef.current = swiper;
            }}

            modules={[Lazy]}
            spaceBetween={1}
            navigation={true}
            lazy={{
                loadPrevNext: true,
                checkInView: true,
            }}
            slidesPerView={1}>
            {images.map((e, i) => {
                return <SwiperSlide key={i}>
                    <div className={'ar-box-' + aspectRadio}>
                        <div className={'ar-box-inside-' + aspectRadio}>
                            <img className="ar-image swiper-lazy"
                                 alt=""
                                 data-src={imageResize(e.url, size)}
                                 onClick={onImageClick}
                            />
                        </div>
                    </div>
                </SwiperSlide>
            })}
            <Button className="swiper-button-prev" outlined rounded style={buttStyle} icon="pi pi-caret-left" onClick={() => swiperRef.current.slidePrev()}/>
            <Button className="swiper-button-next" outlined rounded style={buttStyle} icon="pi pi-caret-right" onClick={() => swiperRef.current.slideNext()}/>
        </Swiper>
    </div>
}
export default Carousel
