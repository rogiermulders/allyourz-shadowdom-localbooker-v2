import {atom} from "recoil";
import {recoilPersist} from "recoil-persist";


const { persistAtom } = recoilPersist(
  {
    storage: sessionStorage,
    key: 'localbooker-persist'
  }
)
export {atom,persistAtom}
