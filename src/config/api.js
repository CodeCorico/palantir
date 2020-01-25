const { load } = require('./');

const callback = (req, res) => res.json(load(null, true));

const routes = [{ path: 'config', method: 'GET', callback }];

module.exports = routes;
