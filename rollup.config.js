import typescript from "rollup-plugin-typescript2"

module.exports = {
  external: ['react'],
  input: 'src/index.ts',
  output: {
    name: 'unshaped',
    file: 'lib/index.js',
    format: 'commonjs',
  },
  plugins: [
    typescript()
  ]
}
