export const toDate = (d) => {

  if (!d || d.constructor.name === 'Date') return d

  if (typeof d === 'string' || d instanceof String) {
    return new Date(d)
  }

}
export const getYmd = (d) => {

  if (!d) return d

  if (d.constructor.name === 'Date') {
    const new_d = {
      year: d.getFullYear(),
      month: d.getMonth(),
      day: d.getDate(),
    }
    d = new_d
  }
  const m = d.month + 1
  return d.year + '-' + (m < 10 ? 0 : '') + m + '-' + (d.day < 10 ? 0 : '') + d.day

}
export const format = (d, locale, monthType, showYear) => {
  if (!d) return d

  return `${d.getDate()} ${d.toLocaleString(locale, {month: monthType})}${showYear ? ` ${d.getFullYear()}` : ''}`
}

export const getDays = (start,end ) => {
  const diffTime = Math.abs(end - start);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
export const createRange = (start, end) => {

  const sd = []

  if (!start || !end) return []

  const workend = new Date(end.getTime()) // clone!!

  workend.setDate(workend.getDate() + 1)
  for (let d = new Date(); d <= workend; d.setDate(d.getDate() + 1)) {
    if (d >= start && d <= workend) {
      sd.push(new Date(d.getTime()))
    }
  }

  return sd
}

