import {atom,persistAtom} from "./persistAtom";

export default atom({
  key: 'subFilter',
  default: [],
  effects_UNSTABLE: [persistAtom],
})
