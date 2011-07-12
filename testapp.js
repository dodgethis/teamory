var express = require('express'),
    app = module.exports = express.createServer(),
    RedisStore = require('connect-redis')(express);
    console.log(RedisStore);
    store = new RedisStore;
