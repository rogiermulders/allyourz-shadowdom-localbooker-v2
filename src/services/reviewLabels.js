/**
 *
 * @param rating
 * @param labels are coming from the BE translate module
 * @returns {*}
 */
const getReviewsLabel = (rating, labels) => {
  let labelKey = 'label_'

  if (rating >= 9) {
    labelKey += 9
  } else if (rating >= 8) {
    labelKey += 8
  } else if (rating >= 7) {
    labelKey += 7
  } else if (rating >= 6) {
    labelKey += 6
  } else {
    labelKey += 1
  }
  return labels[labelKey]
}

const ratingToString = (rating) => {
  // 8 => 8,0 7.3 => 7,3 and 10 => 10
  const s = (rating+ '').replace('.', ',')
  return s + (s.length === 1 ? ',0' : '')
}

export {getReviewsLabel,ratingToString}