import {atom,persistAtom} from "./persistAtom";
export default atom({
  key: 'form',
  default: {
    first_name: '',
    last_name: '',
    email: '',
    phone_number: '',
    zip_code: '',
    house_number: '',
    street: '',
    city: '',
    country: '',
    extra_message: '',
    options: []
  },
  effects_UNSTABLE: [persistAtom],
})
