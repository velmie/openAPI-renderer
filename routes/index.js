var express = require('express');
var router = express.Router();
const { repo, cache } = require('../config');

/* GET home page. */
router.get('/', async function(req, res, next) {

  let schemas = cache.get('schemas');

  if (!schemas) {
    schemas = await repo.get();

    cache.set('schemas', schemas);
    console.log('MISS: Fetched schemas');
  } else {
    console.log('HIT: Fetched schemas');
  }

const currentSchema = req.cookies.api ? req.cookies.api : null;

  res.render('index', { schemas, currentSchema, title: 'API documentation' });
});

module.exports = router;
