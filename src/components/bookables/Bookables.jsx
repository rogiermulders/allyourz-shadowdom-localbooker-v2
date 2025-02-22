import { useRecoilState, useRecoilValue } from 'recoil'
import { useContext, useEffect, useRef, useState } from 'react'
import { getYmd } from '../../services/dates'
import axios from 'axios'
import { col, getBp, gte, lte } from '../../services/buttstrip'
import { imageResize } from '../../services/imageResize'
import { Button } from 'primereact/button'
import { toEuro } from '../../services/money'
import CalendarDialog from '../calendar/CalendarDialog.jsx'
import { MainContext } from '../../contexts/MainContext'
import selectorMainFilter from '../../recoil/selectors/selectorMainFilter'
import { Card } from 'primereact/card'
import Props from './Props.jsx'
import { useNavigate } from 'react-router-dom'
import recoilMainFilter from '../../recoil/recoilMainFilter'
import ForwardDialog from '../../molecules/ForwardDialog.jsx'
import BookableDialogContent from './BookableDialogContent.jsx'
import { Divider } from 'primereact/divider'
import CountAvailable from './CountAvailable.jsx'
import BreakfastIncluded from '../administration/BreakfastIncluded.jsx'


export default function Bookables({ administration }) {
  const context = useContext(MainContext)
  const refContext = useRef(context)
  const navigate = useNavigate()
  const calendarDialogRef = useRef()
  const dialogRef = useRef()
  const { checkIn, checkOut, adults, babies, children, pets } = useRecoilValue(selectorMainFilter)
  const [, setMainFilter] = useRecoilState(recoilMainFilter)
  const [bookables, setBookables] = useState([])
  const _t = context._t()
  const [countActive, setCountActive] = useState(0)

  /**
   * Get all bookables
   */
  useEffect(() => {

    const { current } = refContext

    /** create payload */
    const postData = {
      locale: context.hostLocale,
      administration_id: administration.id,
      guests: (adults + children),
      babies,
      pets
    }

    if (checkIn && checkOut) {
      postData.checkIn = getYmd(checkIn)
      postData.checkOut = getYmd(checkOut)
    }

    axios.post('/v1/booking/objects', postData).then(res => {

      let maxGuests = 0, cheapest = 0
      let count = 0
      res.data.forEach(b => {
        if (b.status === 'available') {
          count++
          let dayPrice = b.price.cost / b.price.days
          if (!cheapest) {
            cheapest = dayPrice
          } else {
            cheapest = dayPrice < cheapest ? dayPrice : cheapest
          }
        }
        maxGuests = b.maxGuests > maxGuests ? b.maxGuests : maxGuests
      })
      current.setCheapest(cheapest)
      current.setMaxGuests(maxGuests)
      setBookables(res.data)
      setCountActive(count)
    })
    return () => {
      current.setMaxGuests(0)
    }
  }, [administration.id, checkIn, checkOut, adults, babies,
    children, pets, context.hostLocale])


  const FromNight = ({ bookable }) => {
    return bookable.status === 'available' && <>
      <div className="h02 text-color-secondary">{_t.labels.from_night}</div>
      <div className="h4 mt-1">

        {toEuro(bookable.price?.cost / bookable.price?.days, true)}
      </div>
    </>
  }

  const MoreInfoButton = ({ bookable }) => {
    return <Button label={_t.labels.more_info}
                   severity="secondary"
                   onClick={() => {
                     dialogRef.current.open({
                       size: 'medium',
                       header: bookable.name,
                       content: <div style={{ height: '60vh' }}>
                         <BookableDialogContent bookable={bookable} />
                       </div>
                     })
                   }}
                   outlined
                   icon="pi pi-chevron-right"
                   iconPos="right" />
  }

  const Image = ({ bookable }) => <div className="ar-box-3-2">
    <div className="ar-box-inside-3-2 relative">
      <img className="ar-image border-radius pointer"
           alt={bookable.name}
           src={imageResize(bookable.images[0]?.url, getImageSize())}
           onClick={() => {
             dialogRef.current.open({
               size: 'medium',
               header: bookable.name,
               content: <div style={{ height: '60vh' }}>
                 <BookableDialogContent bookable={bookable} />
               </div>

             })
           }} />
      {bookable.freeBreakfast === true && <div className="absolute" style={{ bottom: '0.5em', left: '0.3em' }}>
        <BreakfastIncluded/>
      </div>}

    </div>
  </div>

  const BookButton = ({ bookable }) => {

    const available = bookable.status === 'available'
    return <Button
      disabled={!available}
      icon={available ? null : 'pi pi-exclamation-circle'}
      label={available ? (checkIn && checkOut ? _t.labels.go_book : _t.labels.show_pricing) : _t.labels.not_available}
      onClick={() => {
        if (checkIn && checkOut) {
          setMainFilter(
            old => {
              return { ...old, bookable, administration }
            }
          )
          setTimeout(() => navigate('/book'), 0)
        } else {
          calendarDialogRef.current.open(administration.id)
        }
      }}
    />
  }

  const getImageSize = () => {
    switch (getBp()) {
      case 'xs':
        return 1080
      case 'sm':
        return 640
      default:
        return 384
    }
  }

  /*************************************************************************
   *
   *************************************************************************/
  return <>

    {/*DIALOGS*/}
    <CalendarDialog ref={calendarDialogRef} />
    <ForwardDialog ref={dialogRef} />


    <div className="grid text-color mt-8">
      <Divider />

      {/*Number of bookables and calendar butt*/}
      <div className="col-12">
        <CountAvailable
          administration={administration}
          countActive={countActive}
        />
      </div>

      {/*All the bookables*/}
      <div className={col({ def: 12 })}>
        {bookables.map((bookable, i) => {
          return <Card key={i} className="mt-8">
            <div className="grid padding">
              {/*IMAGE*/}
              <div className={col({ def: 4, sm: 5, xs: 12 }, 'p-0')}>
                <Image bookable={bookable} />
              </div>

              <div className={col({ def: 8, sm: 7, xs: 12 })}>
                <div className="grid text-color">
                  {/*NAME*/}
                  <div className="col font-bold text-lg pt-4 pb-4">
                    {bookable.name}
                  </div>

                  <div className={col({ def: 8, xs: 12 })}>
                    <Props bookable={bookable} />
                  </div>

                  {gte('sm') && <div className="col-4 text-right mt-6">
                    <FromNight bookable={bookable} />
                  </div>}

                  <div className={col({ def: 7, xs: 12 })}>
                    <MoreInfoButton bookable={bookable} />
                  </div>

                  {gte('sm') && <div className="col-5 text-right">
                    <BookButton bookable={bookable} />
                  </div>}

                  {lte('xs') && <>
                    <div className="col-6">
                      <FromNight bookable={bookable} />
                    </div>
                    <div className="col-6 text-right mt-6">
                      <BookButton bookable={bookable} />
                    </div>

                  </>}

                </div>
              </div>
            </div>
          </Card>
        })}
      </div>
    </div>

  </>

}
