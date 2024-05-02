import {atom,persistAtom} from "./persistAtom";

export default atom({
  key: 'spa',
  default: {

    mapListMode: 'list',

    zoom: 8.630829944512346,
    center: [3.8899999999999864, 51.52118016354805],
    mapBoundTopLeft: {lng: 0.82, lat: 50.63},
    mabBoundBottomRight: {lng: 6.76, lat: 52.38},

    heelZeeland: [[4.88, 51.85], [2.90, 51.19]],

    // when an icon is clicked on the map these are filled
    adminIds: null,  // the admin ids[] of the selected icon
    administrations: [], // call to the server to get the admin ids[] data

  },
  effects_UNSTABLE: [persistAtom],
})
