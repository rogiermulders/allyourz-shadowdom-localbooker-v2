import {atom,persistAtom} from "./persistAtom";
export default atom({
  key: 'reservation',
  default: {
    paymentStarted:false,
    reservationId:null,
    reservationNumber:null,
    stripeClientSecret:null
  },
  effects_UNSTABLE: [persistAtom],
})
