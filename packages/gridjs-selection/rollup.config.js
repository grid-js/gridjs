import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import size from 'rollup-plugin-sizes';

const lib = 'gridjs-selection';

const path = (env, postfix) =>
  `dist/${lib}.${env}${postfix ? '.' + postfix : ''}.js`;
const external = ['gridjs'];

export default [
  {
    input: 'index.ts',
    external: external,
    output: [
      {
        file: path('development'),
        name: 'gridjs.selection',
        format: 'umd',
        sourcemap: true,
      },
      { file: path('development', 'es'), format: 'es', sourcemap: true },
    ],
    plugins: [
      typescript({
        tsconfig: 'tsconfig.json',
        tsconfigOverride: {
          exclude: ['tests/**/*'],
          compilerOptions: {
            module: 'es2015',
          },
        },
      }),
    ],
  },
  {
    input: 'index.ts',
    external: external,
    output: [
      {
        file: path('production', 'min'),
        name: 'gridjs.selection',
        format: 'umd',
        sourcemap: true,
      },
      { file: path('production', 'es.min'), format: 'es', sourcemap: true },
    ],
    plugins: [
      typescript({
        tsconfig: 'tsconfig.release.json',
        tsconfigOverride: {
          compilerOptions: {
            module: 'es2015',
            declaration: false,
          },
        },
      }),
      terser(),
      size({
        writeFile: false,
      }),
    ],
  },
];
