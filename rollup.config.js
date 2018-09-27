'use strict'

import path from 'path'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import license from 'rollup-plugin-license'

export default {
  format: 'umd',
  entry: 'bubble-hearts.js',
  dest: 'bubble-hearts.min.js',
  moduleName: 'BubbleHearts',
  plugins: [
    babel({
      presets: ['es2015-rollup']
    }),
    uglify(),
    license({
      banner: {
        file: path.join(__dirname, 'banner')
      }
    })
  ]
}
