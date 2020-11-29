function proxy(app) {
  app.get(/^\/$/, (req, res) => res.redirect('/employees'))
}

module.exports = proxy
