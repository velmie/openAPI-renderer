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

  const cookies = req.cookies.api ? req.cookies : null;

  res.render('index', { schemas, cookies, title: 'API documentation' });
});

module.exports = router;
