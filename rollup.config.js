import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-sizes'
import resolve from '@rollup/plugin-node-resolve';

const globals = {}

export default [
  {
    input: 'index.ts',
    output: {
      name: 'GridJs',
      file: 'dist/gridjs.development.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    plugins: [
      resolve(),
      typescript({
        tsconfig: "tsconfig.json",
        tsconfigOverride: { compilerOptions : { module: "es2015" } }
      })
    ],
  },
  {
    input: 'index.ts',
    output: {
      name: 'GridJs',
      file: 'dist/gridjs.production.min.js',
      format: 'umd',
      sourcemap: true,
      globals,
    },
    plugins: [
      resolve(),
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
