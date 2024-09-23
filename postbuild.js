import fs from 'fs/promises'
// Import Terser so we can use it
import { minify } from 'terser'

const terser_config = {
  compress: {
    dead_code: true,
    drop_console: false,
    drop_debugger: true,
    keep_classnames: false,
    keep_fargs: true,
    keep_fnames: false,
    keep_infinity: false
  },
  mangle: {
    eval: false,
    keep_classnames: false,
    keep_fnames: false,
    toplevel: false,
    safari10: false
  },
  module: false,
  sourceMap: false,
  output: {
    comments: 'some'
  }
}

export default async function runPostbuild() {

  console.log('Postbuild start.')

  const __dirname = process.cwd()
  const buildPath = __dirname + '/build'

  // 1) Now we need to change some paths in the index.html file AND get the name of the css file
  const indexFile = buildPath + '/index.html'
  let index_html = await fs.readFile(indexFile, { encoding: 'utf8' })
  const jsFileName = index_html.substring(index_html.indexOf('.js') - 14, index_html.indexOf('.js') + 3)

  const launchFile = buildPath + '/localbooker.js'
  let shadow_launch_js = await fs.readFile(launchFile, { encoding: 'utf8' })

  shadow_launch_js = shadow_launch_js.replaceAll('$index_js', '/assets/' + jsFileName)
  shadow_launch_js = shadow_launch_js.replaceAll('$root', process.env.VITE_APP_ROOT)

  // Default is minify
  if(!process.env.DO_NOT_MINIFY_LOCALBOOKER_JS){
    shadow_launch_js = (await minify(shadow_launch_js, terser_config)).code;
  }
  await fs.writeFile(launchFile, shadow_launch_js)

  console.log('Postbuild done.')

}


