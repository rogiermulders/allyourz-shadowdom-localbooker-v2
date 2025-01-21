import { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { mapboxConfig } from './mapboxConfig.js'

const lat=52.07295719906651
const lon=5.330204999999978

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY

export default function MapAdminLocation() {
  const mbRef = useRef(null)
  const map = useRef(null)
  const markerRef = useRef(null)

  // Init the map and the layers
  useEffect(() => {
    // CREATE THE MAPBOX INSTANCE
    const mc = new mapboxgl.Map({
      // center: [5.330204999999978, 52.07295719906651],
      container: mbRef.current,
      cooperativeGestures: true,
      dragRotate: false,
      locale: {
        'ScrollZoomBlocker.CtrlMessage':
          mapboxConfig['ScrollZoomBlocker.CtrlMessage']['nl'],
        'ScrollZoomBlocker.CmdMessage':
          mapboxConfig['ScrollZoomBlocker.CmdMessage']['nl'],
        'TouchPanBlocker.Message':
          mapboxConfig['TouchPanBlocker.Message']['nl'],
      },
      zoom: 7.549041327160497,
    })

    map.current = mc // Save the map instance

    markerRef.current = new mapboxgl.Marker({ color: 'red' })
      .setLngLat([lon, lat])
      .addTo(map.current)

    map.current.easeTo({ center: [lon, lat], zoom: 9 })

    return () => {
      map.current.remove()
      map.current = null
    }
  }, [lat,lon])

  return <div style={{width:'100%', height:'600px'}} ref={mbRef}></div>

}