const express = require('express');
const router = express.Router();
const { repository, cache } = require('../config');

/* GET home page. */
router.get('/', async function(req, res, next) {

  let bucketSchema = cache.get('schema');

  if (!bucketSchema) {
    bucketSchema = await repository.get();
    
    cache.set('schema', bucketSchema);

    console.log('MISS: Fetched schemas');
  } else {
    console.log('HIT: Fetched schemas');
  }

  const cookies = req.cookies.key ? req.cookies : null;

  res.render('index', { bucketSchema, cookies, title: 'API documentation' });
});

module.exports = router;
