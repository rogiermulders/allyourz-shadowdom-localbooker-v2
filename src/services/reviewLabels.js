/**
 *
 * @param rating
 * @param labels are coming from the BE translate module
 * @returns {*}
 */
export const getReviewsLabel = (rating, labels) => {
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
