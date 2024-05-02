import {atom,persistAtom} from "./persistAtom";

export default atom({
  key: 'mainFilter',
  default: {
    administration: null,
    bookable: null,
    where: {
      disabled: false,
      regionId: '0', // Its a string cuz when we have data its a uuid
      destinationZip: null,
      range: 2
    },
    when: {
      disabled: false,
      checkIn: null,
      checkOut: null
    },
    type: {
      disabled: false,
      category: []
    },
    who: {
      disabled: false,
      adults: 2,
      children : 0,
      babies: 0,
      pets: 0
    },
    offset: 0,
    sort: 'score',
  },
  effects_UNSTABLE: [persistAtom],
})
