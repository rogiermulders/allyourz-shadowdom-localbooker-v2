import {atom, persistAtom} from "./persistAtom";

export default atom({
  key: 'mapAvailability',
  default: null,
  effects_UNSTABLE: [persistAtom],
})
