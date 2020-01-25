const axios = require('axios');

module.exports = axios.create({
  baseURL: 'https://api.github.com',
  withCredentials: false,
});
