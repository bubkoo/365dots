import config from '@bubkoo/rollup-config'

export default config({
  output: [
    {
      name: '365dots',
      format: 'umd',
      file: 'dist/365dots.js',
      sourcemap: true,
    },
  ],
})
