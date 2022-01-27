const { build } = require('esbuild');
const { Generator } = require('npm-dts');
const args = process.argv.slice(2)

if ( !['prod', 'dev'].includes(args[0]) ) {
  console.error(`argument to build script expected to be "prod" or "dev". received ${args[0]} instead.`)
  process.exit(1)
}

new Generator({
  entry: 'src/FrostFlake.ts',
  output: 'dist/frostflake.d.ts'
}).generate()

const shared = {
  entryPoints: ['src/FrostFlake.ts'],
  bundle: true,
  minify: args[0] == 'prod' ? true : false,
  sourcemap: args[0] == 'prod' ? false : 'inline'
}

build({
 ...shared,
 outfile: 'dist/frostflake.min.js'
})

build({
  ...shared,
  outfile: 'dist/frostflake.esm.min.js',
  format: 'esm'
})
