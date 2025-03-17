import { DESTINATIONS, REGIONS } from '../data/constants.js'


const mergeParamsWithMainFilterAndChangeSlugsToCodes = (params, mainFilter, spa) => {

  /**
   * Merge the params with the mainFilter start with category
   * hotel,b-b
   * or hotel,b-b|disabled/enabled to explicitly enable (overrule the attribute)
   */
  if (params.category) {
    const split = params.category.split('|') // Split for disabled
    const disabled = (split.length > 1) ? (split[1] === 'disabled') : (mainFilter?.type.disabled || false)
    const category = split[0].split(',')
    mainFilter = {
      ...mainFilter, type: {
        disabled,
        category
      }
    }
  }

  /**
   * city=domburg
   * city=domburg|disabled/enabled to explicitly enable (overrule the attribute)
   */
  if (params.city) {
    const split = params.city.split('|')
    const disabled = (split.length > 1) ? (split[1] === 'disabled') : (mainFilter?.where.disabled || false)
    mainFilter = {
      ...mainFilter, where: {
        disabled,
        regionId: '0',
        destinationZip: split[0],
        range: mainFilter?.where.range || 2
      }
    }
  }

  /**
   * regio=walcheren
   * regio=walcheren|disabled/enabled to explicitly enable (overrule the attribute)
   */
  if (params.regio) {
    const split = params.regio.split('|')
    const disabled = (split.length > 1) ? (split[1] === 'disabled') : (mainFilter?.where.disabled || false)
    mainFilter = {
      ...mainFilter, where: {
        disabled,
        regionId: split[0],
        destinationZip: null,
        range: 2 // regio has no range so set to default
      }
    }
  }

  /**
   * range=10
   */
  if(params.range) {
    mainFilter = {
      ...mainFilter, where: {
        ...mainFilter.where,
        range: parseInt(params.range)
      }
    }
  }

  /**
   * mode=map|list
   */
  if(params.mode) {
    spa.mapListMode = params.mode
  }

  /**
   * Change possible slugs to id's
   * Both for the attributes as wel as for the params
   */
  mainFilter = slugToId(mainFilter)

  return mainFilter
}


/**
 * Change slugs to id's
 * @param mainFilter
 * @returns {*}
 */
const slugToId = (mainFilter) => {
  /**
   * Check if the regionId is a slug and change it to it's id
   */
  const where = mainFilter?.where || {}

  /**
   * regionId is a slug (not a uuid) and not '0' (heel-zeeland)
   */
  if (where.regionId && !isUuid(where.regionId) && where.regionId !== '0') {
    // create map from slug to id
    let slugToId = {}
    REGIONS.forEach(e => slugToId[e.slug] = e.value)
    // Debug info
    if (!slugToId[where.regionId]) console.log(where.regionId, 'not valid as slug')

    // alter the filter
    mainFilter.where = {
      disabled: where.disabled || false,
      regionId: slugToId[where.regionId],
      destinationZip: where.destinationZip || null,
      range: where.range || 2
    }
  }

  /**
   * destinationZip is a slug
   */
  if (where.destinationZip && !isZip(where.destinationZip)) {
    const slugToId = {}
    DESTINATIONS.forEach(e => slugToId[e.slug] = e.value)
    // Debug info
    if (!slugToId[where.destinationZip]) console.log(where.destinationZip, 'not valid as slug')


    mainFilter.where = {
      disabled: where.disabled || false,
      regionId: '0',
      destinationZip: slugToId[where.destinationZip],
      range: where.range || 2
    }
  }
  return mainFilter
}

const isZip = (str) => {
  return /^[0-9]{4}[a-f]{2}$/i.test(str)
}

const isUuid = (str) => {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str)
}

export default mergeParamsWithMainFilterAndChangeSlugsToCodes
