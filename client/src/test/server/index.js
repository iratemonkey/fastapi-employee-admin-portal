// dynamically export the server based on the environment
// using CommonJS in this file because it's a bit simpler
// even though mixing CJS and ESM is not typically recommended
// It is possible to do this with ESM using `codegen.macro`

if (process.env.NODE_ENV === 'development') {
  module.exports = require('./dev-server')
} else if (process.env.NODE_ENV === 'test') {
  module.exports = require('./test-server')
} else {
  module.exports = ''
}
