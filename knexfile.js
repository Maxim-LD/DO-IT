require('ts-node').register();
require('dotenv').config();

module.exports = require('./src/config/knexfile.ts').default;
