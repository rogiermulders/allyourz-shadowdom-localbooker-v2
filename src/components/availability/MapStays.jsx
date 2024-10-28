import {useEffect, useRef, useContext} from 'react'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import {MainContext} from "../../contexts/MainContext";
import axios from "axios";
import {useRecoilState, useRecoilValue} from "recoil";
import selectorMainFilter from "../../recoil/selectors/selectorMainFilter";
import MapPopup from "./MapPopup.jsx";
import recoilSpa from "../../recoil/recoilSpa";

const mapboxConfig = {
  'ScrollZoomBlocker.CtrlMessage': {
    nl: 'Gebruik ctrl + scroll om in te zoomen op de kaart',
    de: 'Verwenden Sie Strg + Scrollen, um die Karte zu vergrößern',
    en: 'Use ctrl + scroll to zoom in on the map'
  }, 'ScrollZoomBlocker.CmdMessage': {
    nl: 'Gebruik ⌘ + scrollen om in te zoomen op de kaart',
    de: 'Verwenden Sie ⌘ + Scrollen, um die Karte zu vergrößern',
    en: 'Use ⌘ + scroll to zoom in on the map'
  }, 'TouchPanBlocker.Message': {
    nl: 'Gebruik twee vingers om de kaart te verplaatsen',
    de: 'Verschieben Sie die Karte mit zwei Fingern',
    en: 'Use two fingers to move the map'
  }
}

mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_API_KEY

// request si the same that is used for the list
function MapStays({width, height, request}) {
  const context = useContext(MainContext)
  const mbRef = useRef(null)
  const map = useRef(null)
  const spaRef = useRef(null)

  const [spa, setSpa] = useRecoilState(recoilSpa)

  const {adminIds, administrations} = spa

  // Do not show when not available for the amount of persons pets
  const {adults, pets, regionId} = useRecoilValue(selectorMainFilter)

  // So can use it inside the useEffect
  spaRef.current = spa


  // Init the map and the layers
  useEffect(() => {
    // CREATE THE MAPBOX INSTANCE
    const mc = new mapboxgl.Map({
      center: spa.center,
      container: mbRef.current,
      cooperativeGestures: true,
      dragRotate: false,
      locale: {
        'ScrollZoomBlocker.CtrlMessage': mapboxConfig['ScrollZoomBlocker.CtrlMessage'][context.hostLocale],
        'ScrollZoomBlocker.CmdMessage': mapboxConfig['ScrollZoomBlocker.CmdMessage'][context.hostLocale],
        'TouchPanBlocker.Message': mapboxConfig['TouchPanBlocker.Message'][context.hostLocale]
      },
      maxBounds: new mapboxgl.LngLatBounds(spa.mapBoundTopLeft, spa.mabBoundBottomRight),
      style: 'mapbox://styles/platform-allyourz/ckkxt1llb5ide18mhjuk2ldc3',
      zoom: spa.zoom
    })

    map.current = mc // Save the map instance

    // Add the markers to the map
    const marker = (window.localbooker.domain || document.location.origin ) + '/mapbox/STAYS/marker-'
    mc.loadImage(marker + 'default@2x.png', (error, image) => {
      mc.addImage('stay-marker', image);
    });
    mc.loadImage(marker + 'cluster@2x.png', (error, image) => {
      mc.addImage('stay-cluster', image);
    });

    // Once the map is loaded, add the layers
    mc.on('load', () => {

      mc.addSource('places_to_stay', {
        type: 'geojson',
        data: {
          "type": "FeatureCollection",
          "features": []
        },
        cluster: true,
        clusterMaxZoom: 14, // Max zoom to cluster points on
        clusterRadius: 50 // Radius of each cluster when clustering points (defaults to 50)
      });

      // ADDING THE CLUSTERS (clustered points)
      mc.addLayer({
        id: 'clusters', type: 'symbol', source: 'places_to_stay', filter: ['has', 'point_count'], layout: {
          'icon-image': 'stay-cluster', // reference the image
          'icon-size': ['step', ['get', 'point_count'], 0.6, 50, 0.7, 300, 0.8],
          'icon-allow-overlap': true,
          'text-allow-overlap': true,
          'icon-ignore-placement': true,
          'text-ignore-placement': true
        },
      });

      // ADDING THE CLUSTER NUMBERS (inside the clustered points)
      mc.addLayer({
        id: 'cluster-count', type: 'symbol', source: 'places_to_stay', filter: ['has', 'point_count'], layout: {
          'text-field': ['get', 'point_count_abbreviated'],
          'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
          'text-size': ['step', ['get', 'point_count'], 14, 50, 16, 300, 17],
          'text-offset': [-0.00, -0.15]
        }
      });

      // ADDING THE STAYS (unclustered points, the BED icons)
      mc.addLayer({
        id: 'unclustered-point',
        type: 'symbol',
        source: 'places_to_stay',
        filter: ['!', ['has', 'point_count']],
        layout: {
          'icon-image': 'stay-marker', // reference the image
          'icon-size': 0.55,
          'icon-allow-overlap': true,
          'text-allow-overlap': true,
          'icon-ignore-placement': true,
          'text-ignore-placement': true
        },
      });

      // SETTING THE MOUSE CURSOR TO POINTER PER LAYER
      mc.on('mouseenter', 'clusters', () => {
        mc.getCanvas().style.cursor = 'pointer'
      })
      mc.on('mouseleave', 'clusters', () => {
        mc.getCanvas().style.cursor = ''
      })
      mc.on('mouseenter', 'unclustered-point', () => {
        mc.getCanvas().style.cursor = 'pointer'
      })
      mc.on('mouseleave', 'unclustered-point', () => {
        mc.getCanvas().style.cursor = ''
      })

      // STORE ZOOM AND CENTER ON ZOOM OR MOVE
      mc.on('zoom', () => {
          const center = mc.getCenter()
          setSpa({...spaRef.current, zoom: mc.getZoom(), center: [center.lng, center.lat], adminIds: null, administrations: []})
        }
      )
      mc.on('move', () => {
          const center = mc.getCenter()
          setSpa({...spaRef.current, zoom: mc.getZoom(), center: [center.lng, center.lat], adminIds: null, administrations: []})
        }
      )

      // When cursor is renesseaanzee ('') we're clicking on the map (and not on something else)
      mc.on('click', () => {
        if (mc.getCanvas().style.cursor === '') {
          setSpa({...spaRef.current, adminIds: null, administrations: []})
        }
      })

      // inspect a cluster on click
      mc.on('click', 'clusters', (e) => {

        const features = mc.queryRenderedFeatures(e.point, {
          layers: ['clusters']
        });
        const clusterId = features[0].properties.cluster_id;
        mc.getSource('places_to_stay').getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err) return;
          mc.easeTo({
            center: features[0].geometry.coordinates, zoom: zoom
          });
        });
        // hide the popup
        setSpa({...spaRef.current, adminIds: null, administrations: []})
      });

      // INSPECT A STAY ON CLICK
      mc.on('click', 'unclustered-point', (e) => {

        const features = mc.queryRenderedFeatures(e.point, {
          layers: ['unclustered-point']
        });

        setSpa({
          ...spaRef.current,
          adminIds: features.map(e => e.properties.id),
          administrations: []
        })
      });
    })

    return () => {
      map.current.remove()
      map.current = null
    }

  }, []);

  /////////////////////////////////////////////////////////////
  //               THIS ONE HANDLES THE MAP DATA             //
  /////////////////////////////////////////////////////////////
  useEffect(() => {

    axios.post('/v1/availability/map', request).then(res => {
      // Wait for the map to be loaded

      // How to detect a navigation

      const handler = setInterval(() => {
        if (map.current.loaded()) {
          clearInterval(handler)

          // MAKING THEM DATA
          const features = createFeatureArray(res.data)
          // MOVE THE DATA IN
          map.current.getSource('places_to_stay').setData({
            "type": "FeatureCollection",
            "features": features
          })

          // FIT THE BOUNDS (but only when no popup is open)
          if (!spa.adminIds) {
            mapFitBounds(map.current, features, regionId === '0' ? spa.heelZeeland : null)
          }

        }
      }, 40)
    })
  }, [request])

  /////////////////////////////////////////////////////////////
  //               THIS ONE HANDLES THE POPUP DATA           //
  /////////////////////////////////////////////////////////////
  useEffect(() => {
    if (!adminIds) return // Are set when click on a bed icon (is array!)

    axios.post('/v1/availability/get-hints', {
      administration_ids: adminIds,
      lang: context.hostLocale,
      limitMedia: 10,
      mainFilters: {adults, pets}
    }).then(res => {
      setSpa({...spa, administrations: res.data.accomodations})
    })
  }, [adminIds])


  /////////////////////////////////////////////////////////////
  //                  Below the HTML                         //
  /////////////////////////////////////////////////////////////
  return <div
    style={{
      position: 'relative',
      width: width,
      height: height,
      border: 'solid 1px gainsboro',
      borderRadius: '5px'
    }}>

    {/*MAP*/}
    <div style={{width: '100%', height: '100%'}} ref={mbRef}></div>

    {/*POPUP*/}
    {adminIds && (administrations.length > 0) && <MapPopup administration={administrations[0]}/>}
  </div>

}

export default MapStays

/////////////////////////////////////////////
//           HELPER FUNCTIONS              //
/////////////////////////////////////////////
const createFeatureArray = (availability) => {
  const features = []
  for (const el of availability) {
    features.push({
      type: 'Feature', geometry: {
        type: 'Point', coordinates: [el.lon, el.lat]
      }, properties: {
        id: el.id, slug: el.slug
      }
    })
  }
  return features
}

const mapFitBounds = (map, features, heelZeeland) => {

  // When we select heelZeeland, we zoom to the heelZeeland coordinates
  if (heelZeeland) {
    map.fitBounds(heelZeeland)
    return
  }

  if (features.length === 0) {
    return
  }

  const coordinates = []

  features.forEach(feature => {
    const c = feature.geometry.coordinates
    if (c[0] && c[1]) {
      coordinates.push(c)
    }

  })

  const bounds = coordinates.reduce((bounds, coord) => {
      return bounds.extend(coord)
    },
    new mapboxgl.LngLatBounds(coordinates[0], coordinates[0])
  )

  map.fitBounds(bounds, {padding: 50})
}
