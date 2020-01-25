const { load } = require('./');

const callback = async (req, res) => {
  const config = load();

  res.json(config);
};

const routes = [{ path: 'config', method: 'GET', callback }];

module.exports = routes;
