import { useEffect, useRef } from 'react'
import 'mapbox-gl/dist/mapbox-gl.css'
import mapboxgl from 'mapbox-gl'
import { mapboxConfig } from './mapboxConfig.js'
import { addMarkerToTheMap } from '../../data/markers.js'

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY

export default function MapAdminLocation({lat, long}) {

  const mbRef = useRef(null)

    // Init the map and the layers
  useEffect(() => {
    // CREATE THE MAPBOX INSTANCE
    const mc = new mapboxgl.Map({
      center: [3.8899999999999864, 51.52118016354805],
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
      style: 'mapbox://styles/platform-allyourz/ckkxt1llb5ide18mhjuk2ldc3',
      zoom: 8.630829944512346,
    })

    addMarkerToTheMap(115, 'stay', 'stay-marker', mc)

    mc.on('load', () => {
      mc.addSource('my-single-point', {
        'type': 'geojson',
        'data': {
          'type': 'FeatureCollection',
          'features': [
            {
              'type': 'Feature',
              'geometry': {
                'type': 'Point',
                'coordinates': [long,lat]
              }
            }
          ]
        }
      });
      mc.addLayer({
        'id': 'points',
        'type': 'symbol',
        'source': 'my-single-point',
        'layout': {
          'icon-image': 'stay-marker',
          'icon-size': 0.55
        }
      });

      mc.easeTo({ center: [long, lat], zoom: 11 })
    })
    return () => {
      mc.remove()
    }
  }, [lat,long])

  return <div style={{width:'100%', height:'450px'}} ref={mbRef}></div>

}