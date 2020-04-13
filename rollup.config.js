import typescript from 'rollup-plugin-typescript2';
import scss from 'rollup-plugin-scss'
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
      scss(),
      typescript({
        tsconfig: "tsconfig.json",
        tsconfigOverride: { compilerOptions : { module: "es2015" } }
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
      scss(),
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
