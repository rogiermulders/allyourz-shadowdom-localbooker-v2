const loadfonts = async () => {

  const path = (window.localbooker.domain || document.location.origin ) + '/fonts'

  // PRIMEICONS
  let primeicons = [
    {p: 'primeicons.eot', f: null},
    {p: 'primeicons.eot?#iefix', f: 'embedded-opentype'},
    {p: 'primeicons.woff2', f: 'woff2'},
    {p: 'primeicons.woff', f: 'woff'},
    {p: 'primeicons.ttf', f: 'truetype'},
    {p: 'primeicons.svg?#primeicons', f: 'svg'},
  ].map(e => {
    return `url('${path}/${e.p}')${e.f ? (" format('" + e.f + "')") : ''}`
  }).join(',')


  const fonts = [
    new FontFace('primeicons', primeicons),

    // LARA THEME FONTS
    new FontFace('Inter var', `url('${path}/Inter-roman-var.woff2?v=3.19') format('woff2')`),
    // new FontFace('Inter var', `url('${path}/Inter-italic-var-woff2?v=3.19') format('woff2')`),
  ];

  // Load all
  await Promise.all(fonts.map(e=>e.load()))

  // and append to the HOST(!)
  fonts.forEach(e => {
    document.fonts.add(e);
  })

}

export default loadfonts