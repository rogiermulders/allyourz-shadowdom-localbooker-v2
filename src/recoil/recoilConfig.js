import {atom,persistAtom} from "./persistAtom";

export default atom({
  key: 'config',
  default: {
    pid: null,
    device: null,
    offset: 0,
    page: null,
    basename: null,
    slug: null,
    content: null,
    locale:null,
    scroll:true
  },
  effects_UNSTABLE: [persistAtom],
})
