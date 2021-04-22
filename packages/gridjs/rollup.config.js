import typescript from 'rollup-plugin-typescript2';
import autoprefixer from 'autoprefixer';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import size from 'rollup-plugin-sizes';
import resolve from '@rollup/plugin-node-resolve';
import pathlib from 'path';

const lib = 'gridjs';

const path = (env, postfix) =>
  `dist/${lib}.${env}${postfix ? '.' + postfix : ''}.js`;

function build(input, name, minified) {
  return {
    input: input,
    output: [
      { file: path(name, (minified ? 'min' : '')), name: lib, format: 'umd', sourcemap: minified },
      { file: path(name, 'es' + (minified ? '.min' : '')), format: 'es', sourcemap: minified },
    ],
    plugins: [
      resolve(),
      postcss({
        use: ['sass'],
        plugins: [autoprefixer],
        sourceMap: minified,
        minimize: minified,
        extract: pathlib.resolve('./dist/theme/mermaid' + (minified ? '.min' : '') + '.css'),
        extensions: ['.sass', '.css', '.scss'],
      }),
      typescript({
        tsconfig: minified ? 'tsconfig.release.json' : 'tsconfig.json',
        tsconfigOverride: {
          exclude: ['tests/**/*'],
          compilerOptions: {
            module: 'es2015',
            declaration: !minified,
          },
        },
      }),
      minified && terser(),
      minified && size({
        writeFile: false,
      }),
    ],
  };
}

export default [
  build('index.ts', 'development', false),
  build('index.ts', 'production', true),
  build('./src/i18n/index.ts', 'lang', false),
  build('./src/i18n/index.ts', 'lang', true),
];
