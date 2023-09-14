/**
 * @type {import('rollup').RollupOptions}
 */

import { readFile } from 'node:fs/promises'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import json from '@rollup/plugin-json'
import clear from 'rollup-plugin-clear'
import alias from '@rollup/plugin-alias'
import replace from '@rollup/plugin-replace'
import commonjs from '@rollup/plugin-commonjs'
import eslint from '@rollup/plugin-eslint'
import { babel } from '@rollup/plugin-babel'

const fileUrl = new URL('../package.json', import.meta.url)
// import packageJson from '../package.json' assert { type: 'json' }
const packageJson = JSON.parse(await readFile(fileUrl, 'utf8'))

const { name, version, author } = packageJson

const pkgName = 'timeChannel'
const banner =
  '/*!\n' +
  ` * ${name} ${version}\n` +
  ` * ${author}\n` +
  ' * Released under the MIT License.\n' +
  ' */'

export default {
  input: 'src/index.js',
  output: [
    {
      file: `dist/${pkgName}.umd.js`,
      format: 'umd',
      name: pkgName,
      banner,
    },
    {
      file: `dist/${pkgName}.umd.min.js`,
      format: 'umd',
      name: pkgName,
      banner,
      plugins: [terser()],
    },
    {
      file: `dist/${pkgName}.cjs.js`,
      format: 'cjs',
      name: pkgName,
      banner,
      plugins: [terser()],
    },
    {
      file: `dist/${pkgName}.esm.js`,
      format: 'es',
      name: pkgName,
      banner,
      plugins: [terser()],
    },
    {
      file: `dist/${pkgName}.js`,
      format: 'iife',
      name: pkgName,
      banner,
      plugins: [terser()],
    },
  ],
  plugins: [
    json(),
    clear({
      targets: ['dist'],
    }),
    alias(),
    replace({
      'process.env.NODE_ENV': JSON.stringify(
        process.env.NODE_ENV || 'development',
      ),
      preventAssignment: true,
    }),
    nodeResolve(),
    commonjs({
      include: 'node_modules/**',
    }),
    eslint({
      throwOnError: true, // 抛出异常并阻止打包
      include: ['../src/**'],
      exclude: ['../node_modules/**'],
    }),
    babel({
      babelHelpers: 'bundled',
    }),
  ],
}
