import typescript from 'rollup-plugin-typescript2';
import autoprefixer from 'autoprefixer'
import postcss from 'rollup-plugin-postcss'
import { terser } from 'rollup-plugin-terser'
import size from 'rollup-plugin-sizes'
import resolve from '@rollup/plugin-node-resolve';

const lib = 'gridjs';

const path = (env, postfix) => `dist/${lib}.${env}${postfix ? '.' + postfix : ''}.js`;

export default [
  {
    input: 'index.ts',
    output: [
      { file: path('development'), name: lib, format: 'umd', sourcemap: true },
      { file: path('development', 'es5'), format: 'es', sourcemap: true },
    ],
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
    output: [
      { file: path('production'), name: lib, format: 'umd', sourcemap: true },
      { file: path('production', 'es5'), format: 'es', sourcemap: true },
    ],
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
