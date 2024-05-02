// DAU = Prijs per dag per stuk en
// PEN = Prijs per huisdier per nacht
// STA = Prijs per verblijf
// PAC = Prijs per set
export const chargeModesThatNeedADropdown = ['DAU', 'PEN', 'STA', 'PAC','UNI'];

export const imageNotFound = import.meta.env.VITE_APP_URL + '/assets/images/not-found.png'

export const rangeOptions = [
  {label: '1 km', value: 1},
  {label: '2 km', value: 2},
  {label: '5 km', value: 5},
  {label: '10 km', value: 10},
  {label: '15 km', value: 15},
  {label: '20 km', value: 20}
]
export const rowsPerPage = 10

export const ACCOMMODATION_TYPES = [
  {
    icon: 'home',
    label: {
      nl: 'Appartementen',
      de: 'Ferienwohnungen'
    },
    slug: {
      nl: 'appartementen',
      de: 'ferienwohnungen'
    },
    value: 'apartment',
    accommodationType: {
      nl: 'appartementen',
      de: 'Ferienwohnungen'
    }
  },
  {
    icon: 'home-alt',
    label: {
      nl: 'B&B\'s',
      de: 'B&B'
    },
    slug: {
      nl: 'bed-and-breakfast',
      de: 'bed-and-breakfast'
    },
    value: 'b-b',
    accommodationType: {
      nl: 'kamers',
      de: 'Zimmer'
    },
    providerType: {
      nl: 'B&B\'s',
      de: 'B&B'
    }
  },
  {
    icon: 'luggage-cart',
    label: {
      nl: 'Campings',
      de: 'Campingplätze'
    },
    slug: {
      nl: 'campings',
      de: 'campingplaetze'
    },
    value: 'camping',
    providerType: {
      nl: 'campings',
      de: 'Campingplätze'
    }
  },
  {
    icon: 'building',
    label: {
      nl: 'Hotels',
      de: 'Hotels'
    },
    slug: {
      nl: 'hotels',
      de: 'hotels'
    },
    value: 'hotel',
    accommodationType: {
      nl: 'hotelkamers',
      de: 'Hotelzimmer'
    },
    providerType: {
      nl: 'hotels',
      de: 'Hotels'
    }
  },
  {
    icon: 'store',
    label: {
      nl: 'Vakantiehuizen',
      de: 'Ferienhäuser'
    },
    slug: {
      nl: 'vakantiehuizen',
      de: 'ferienhaeuser'
    },
    value: 'vacation-home',
    accommodationType: {
      nl: 'vakantiehuizen',
      de: 'Ferienhäuser'
    }
  },
  {
    icon: 'store-alt',
    label: {
      nl: 'Vakantieparken',
      de: 'Ferienparks'
    },
    slug: {
      nl: 'vakantieparken',
      de: 'ferienparks'
    },
    value: 'holiday-resort',
    accommodationType: {
      nl: 'vakantiehuizen',
      de: 'Ferienhäuser'
    },
    providerType: {
      nl: 'vakantieparken',
      de: 'Ferienparks'
    }
  }
]


export const REGION_DESTINATION_MAPPING = [
  {
    label: 'Heel Zeeland',
    slug: 'heel-zeeland',
    value: '0',
    hide: false, // Turned off for now, because we first need acco's in this new region
    destinations: []
  },

  {
    label: 'Goeree-Overflakkee',
    slug: 'goeree-overflakkee',
    value: '6138FCBE-FF4F-4ABE-86B2-DEB3B9A50070',
    hide: true, // Turned off for now, because we first need acco's in this new region
    destinations: [
      {
        label: 'Ouddorp',
        slug: 'ouddorp',
        value: '3253AR',
        radius: 0,
        hideDiscoverZeeland: true
      },
      {
        label: 'Herkingen',
        slug: 'herkingen',
        value: '3249BA',
        radius: 0,
        hideDiscoverZeeland: true
      },
      {
        label: 'Goedereede',
        slug: 'goedereede',
        value: '3252BZ',
        radius: 0,
        hideDiscoverZeeland: true
      }
    ]
  },
  {
    label: 'Noord-Beveland',
    slug: 'noord-beveland',
    value: 'FDCC48AA-2771-431D-9C77-1236BDEA6056',
    destinations: [
      {
        label: 'Colijnsplaat',
        slug: 'colijnsplaat',
        value: '4486AA',
        radius: 3
      },
      {
        label: 'Geersdijk',
        slug: 'geersdijk',
        value: '4494NS',
        radius: 0,
        hideDiscoverZeeland: true
      },
      {
        label: 'Kamperland',
        slug: 'kamperland',
        value: '4493PG',
        radius: 4
      },
      {
        label: 'Kortgene',
        slug: 'kortgene',
        value: '4484CV',
        radius: 1.5
      }
    ]
  },
  {
    label: 'Schouwen-Duiveland',
    slug: 'schouwen-duiveland',
    value: 'B0BA847B-D0A7-4106-AD60-132C43BBAD21',
    destinations: [
      {
        label: 'Brouwershaven',
        slug: 'brouwershaven',
        value: '4318EB',
        radius: 2,
        hideDiscoverZeeland: true
      },
      {
        label: 'Bruinisse',
        slug: 'bruinisse',
        value: '4311AS',
        radius: 1.9
      },
      {
        label: 'Burgh-Haamstede',
        slug: 'burgh-haamstede',
        value: '4328AE',
        radius: 2.7
      },
      {
        label: 'Renesse',
        slug: 'renesse',
        value: '4325AA',
        radius: 2.1
      },
      {
        label: 'Scharendijke',
        slug: 'scharendijke',
        value: '4322BP',
        radius: 1,
        hideDiscoverZeeland: true
      },
      {
        label: 'Zierikzee',
        slug: 'zierikzee',
        value: '4301JD',
        radius: 2
      }
    ]
  },
  {
    label: 'Tholen & Sint Philipsland',
    slug: 'tholen-sint-philipsland',
    value: '8EE7A816-5100-43B7-8909-4F5AC09A3311',
    destinations: [
      {
        label: 'Stavenisse',
        slug: 'stavenisse',
        value: '4696BZ',
        radius: 10
      },
      {
        label: 'Tholen',
        slug: 'tholen',
        value: '4691BX',
        radius: 10
      }
    ]
  },
  {
    label: 'Walcheren',
    slug: 'walcheren',
    value: '62201A77-E505-452A-BFDF-DB1CCD834469',
    destinations: [
      {
        label: 'Aagtekerke',
        slug: 'aagtekerke',
        value: '4363AC',
        radius: 0,
        hideDiscoverZeeland: true
      },
      {
        label: 'Arnemuiden',
        slug: 'arnemuiden',
        value: '4341EP',
        radius: 0,
        hideDiscoverZeeland: true
      },
      {
        label: 'Dishoek',
        slug: 'dishoek',
        value: '4371PW',
        radius: 0
      },
      {
        label: 'Domburg',
        slug: 'domburg',
        value: '4357BG',
        radius: 2
      },
      {
        label: 'Koudekerke',
        slug: 'koudekerke',
        value: '4371AB',
        radius: 0,
        hideDiscoverZeeland: true
      },
      {
        label: 'Middelburg',
        slug: 'middelburg',
        value: '4331LK',
        radius: 3.1
      },
      {
        label: 'Oostkapelle',
        slug: 'oostkapelle',
        value: '4356BJ',
        radius: 4
      },
      {
        label: 'Veere',
        slug: 'veere',
        value: '4351AG',
        radius: 2
      },
      {
        label: 'Vlissingen',
        slug: 'vlissingen',
        value: '4381CK',
        radius: 2.5
      },
      {
        label: 'Vrouwenpolder',
        slug: 'vrouwenpolder',
        value: '4354AE',
        radius: 3
      },
      {
        label: 'Westkapelle',
        slug: 'westkapelle',
        value: '4361AE',
        radius: 4
      },
      {
        label: 'Zoutelande',
        slug: 'zoutelande',
        value: '4374AX',
        radius: 4
      }
    ]
  },
  {
    label: 'Zeeuws-Vlaanderen',
    slug: 'zeeuws-vlaanderen',
    value: '6BAB4CCF-C0E8-4B99-A5E0-02FD4B7EFD35',
    destinations: [
      {
        label: 'Breskens',
        slug: 'breskens',
        value: '4511AN',
        radius: 2
      },
      {
        label: 'Cadzand',
        slug: 'cadzand', // @TODO add redirect for ontdek zeeland from /cadzand
        value: '4506JK',
        radius: 2.6
      },
      {
        label: 'Groede',
        slug: 'groede',
        value: '4503AG',
        radius: 5
      },
      {
        label: 'Hulst',
        slug: 'hulst',
        value: '4561AS',
        radius: 7.5
      },
      {
        label: 'Nieuwvliet',
        slug: 'nieuwvliet',
        value: '4504PR',
        radius: 0,
        hideDiscoverZeeland: true
      },
      {
        label: 'Retranchement',
        slug: 'retranchement',
        value: '4525AH',
        radius: 0,
        hideDiscoverZeeland: true
      },
      {
        label: 'Sluis',
        slug: 'sluis',
        value: '4524CV',
        radius: 1
      },
      {
        label: 'Terneuzen',
        slug: 'terneuzen',
        value: '4531EP',
        radius: 3
      }
    ]
  },
  {
    label: 'Zuid-Beveland',
    slug: 'zuid-beveland',
    value: '4519714F-EC6C-4A5E-86E4-F6ED52401246',
    destinations: [
      {
        label: 'Goes',
        slug: 'goes',
        value: '4461AJ',
        radius: 2.8
      },
      {
        label: 'Yerseke',
        slug: 'yerseke',
        value: '4401ED',
        radius: 5.5
      },
      {
        label: 'Wemeldinge',
        slug: 'wemeldinge',
        value: '4424CA',
        radius: 5
      },
      {
        label: 'Wolphaartsdijk',
        slug: 'wolphaartsdijk',
        value: '4471NC',
        radius: 1
      }
    ]
  }
]

export const REGIONS = REGION_DESTINATION_MAPPING.filter(region => !region.hide)

const getDestinations = () => {
  const destinations = []
  REGION_DESTINATION_MAPPING.forEach(region => {
    destinations.push(...region.destinations)
  })

  destinations.sort((a, b) => (a.label > b.label) ? 1 : -1)

  return destinations
}

export const DESTINATIONS = getDestinations()


export const accomodationMap = (slug, locale) => {

  // euh... when managing locales on the server there is a locale tp (template) but here we don't know that one,
  locale = (locale === 'tp' ? 'nl' : locale)

  const map = {}
  ACCOMMODATION_TYPES.forEach(e => map[e.value] = e.label[locale])
  return map[slug]
}
export const destinationMap = (index) => {
  const map = {}
  DESTINATIONS.forEach(e => map[e.value] = e.label)
  return map[index]
}
export const regionMap = (index) => {
  const map = {}
  REGIONS.forEach(e => map[e.value] = e.label)
  return map[index]
}
// @TODO: test if these validations work correctry for all possible countries
export const VALIDATIONS = {
  first_name: /^[a-zA-ZÀ-ſ][a-zA-ZÀ-ſ .-]*(?:_[a-zA-ZÀ-ſ .-]+)*$/,
  last_name: /^[a-zA-ZÀ-ſ][a-zA-ZÀ-ſ .-]*(?:_[a-zA-ZÀ-ſ .-]+)*$/,
  email: /(^$|^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)/,
  phone_number: /^\s*([0+])(?:\s*-*\d){5,20}$/, // Roughly because multiple countries can order
  zip_code: /^[A-Za-z0-9 ]{2,20}$/, // Roughly because multiple countries can order
  house_number: /^([a-zA-Z1-9]|0.[1-9])[a-zA-Z0-9 .-]*$/,
  street: /^[A-Za-zÀ-ſ' .-]+$/,
  city: /^[a-zA-ZÀ-ſ' .-]*$/,
  iban: /^([A-Z]{2}[ -]?[0-9]{2})(?=(?:[ -]?[A-Z0-9]){9,30}$)((?:[ -]?[A-Z0-9]{3,5}){2,7})([ -]?[A-Z0-9]{1,3})?$/
}


