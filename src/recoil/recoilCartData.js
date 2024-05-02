import {atom,persistAtom} from "./persistAtom";

export default atom({
  key: 'cartData',
  default: null,
  effects_UNSTABLE: [persistAtom],
})
