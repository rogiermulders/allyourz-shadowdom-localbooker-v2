import { DESTINATIONS, REGIONS } from '../data/constants.js'


const mergeParamsWithMainFilterAndChangeSlugsToCodes = (params, mainFilter) => {

  /**
   * Merge the params with the mainFilter start with category
   */
  if (params.category) {
    const split = params.category.split(':disabled')
    const disabled = split.length > 1
    const category = split[0].split(',')
    mainFilter.type = { disabled, category }
  }

  /**
   * Change possible slugs to id's
   * Both for the attributes as wel as for the params
   */
  mainFilter = slugToId(mainFilter)

  return mainFilter
}

const slugToId = (mainFilter) => {
  /**
   * Check if the regionId is a slug and change it to it's id
   */
  const where = mainFilter?.where || {}

  /**
   * regionId is a slug
   */
  if (where.regionId && !isUuid(where.regionId)) {
    // create map from slug to id
    let slugToId = {}
    REGIONS.forEach(e => slugToId[e.slug] = e.value)
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
