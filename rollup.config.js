import typescript from 'rollup-plugin-typescript2';
import autoprefixer from 'autoprefixer'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-sizes'
import resolve from '@rollup/plugin-node-resolve';

const globals = {}

export default [
  {
    input: 'index.ts',
    output: {
      name: 'Grid',
      file: 'dist/gridjs.development.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    plugins: [
      resolve(),
      postcss({
        use: ['sass'],
        plugins: [
          autoprefixer,
        ],
        sourceMap: true,
        extract: 'dist/theme/mermaid.css',
        extensions: ['.sass','.css', '.scss']
      }),
      typescript({
        tsconfig: "tsconfig.json",
        tsconfigOverride: {
          compilerOptions : {
            module: "es2015"
          }
        }
      })
    ],
  },
  {
    input: 'index.ts',
    output: {
      name: 'Grid',
      file: 'dist/gridjs.production.min.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    plugins: [
      resolve(),
      postcss({
        use: ['sass'],
        plugins: [
          autoprefixer,
        ],
        extract: 'dist/theme/mermaid.min.css',
        extensions: ['.sass','.css', '.scss'],
        minimize: true
      }),
      typescript({
        tsconfig: "tsconfig.release.json",
        tsconfigOverride: {
          compilerOptions: {
            module: "es2015",
            declaration: false
          }
        }
      }),
      terser(),
      size({
        writeFile: false,
      }),
    ],
  },
]
