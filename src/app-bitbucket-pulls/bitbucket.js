const axios = require('axios');

module.exports = axios.create({
  baseURL: 'https://api.bitbucket.org/2.0',
  withCredentials: false,
});
