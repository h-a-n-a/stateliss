module.exports = {
  external: ['react'],
  input: 'lib/es/index.js',
  output: {
    name: 'unshaped',
    globals: {
      react: 'React',
      'react-dom': 'ReactDOM',
    },
    file: 'lib/umd/unshaped.js',
    format: 'umd',
  },
}
