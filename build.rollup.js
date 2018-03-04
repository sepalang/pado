import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  input: 'dist/commonjs/pado.js',
  output: {
    name: "pado",
    file: 'dist/pado.js',
    format: 'umd'
  },
  plugins: [
    nodeResolve({
      jsnext: true,
      main: true
    }),
    commonjs({
      ignoreGlobal: false,  // Default: false
      sourceMap: false,  // Default: true
      //namedExports: { './train.packed.js': ['train'] },  // Default: undefined
    })
  ]
};