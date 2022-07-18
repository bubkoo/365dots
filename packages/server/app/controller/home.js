const { generate } = require('@365dots/svg')
const { Controller } = require('egg')
const camelCase = require('lodash.camelcase')

class HomeController extends Controller {
  async index() {
    const { ctx, app } = this

    let cache = app.cache[ctx.search]
    if (!cache) {
      const qs = ctx.request.query
      const options = {}
      Object.keys(qs).forEach((key) => {
        options[camelCase(key)] = qs[key]
      })
      cache = generate(options)
      app.cache(ctx.search, cache)
    }

    ctx.type = 'image/svg+xml'
    ctx.body = cache
  }
}

module.exports = HomeController
