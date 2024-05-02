import {selector} from "recoil";
import recoilMainFilter from "../recoilMainFilter";
import {toDate} from "../../services/dates";

const selectorMainFilter = selector({
  key: 'selectorMainFilter',
  get: ({get}) => {

    const atom = get(recoilMainFilter);

    const checkIn = toDate(atom.when.checkIn)
    const checkOut = toDate(atom.when.checkOut)

    return {
      bookable: atom.bookable,
      administration: atom.administration,

      checkIn,
      checkOut,

      adults: atom.who.adults,
      children: atom.who.children,
      babies: atom.who.babies,
      pets: atom.who.pets,

      destinationZip: atom.where.destinationZip,
      range: atom.where.range,
      regionId: atom.where.regionId,

      category: atom.type.category,
      offset: atom.offset,
      sort: atom.sort,

      whereDisabled: atom.where.disabled,
      typeDisabled: atom.type.disabled,
      duration: checkIn && checkOut ? Math.round((checkOut - checkIn) / (1000 * 60 * 60 * 24)) : null,

    };
  },
});

export default selectorMainFilter
