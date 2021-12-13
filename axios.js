const axios = require('axios')

const instance = axios.create({
    baseURL: 'https://api.withmono.com/',
    // timeout: 1000,
  });

module.exports = instance