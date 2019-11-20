const express = require('express');
const { repository, cache } = require('../config');

const router = express.Router();

/* GET home page. */
router.get('/', async (req, res) => {
  let bucketSchema = cache.get('schema');

  if (!bucketSchema) {
    bucketSchema = await repository.get();
    cache.set('schema', bucketSchema);

    console.log('MISS: Fetched schemas');
  } else {
    console.log('HIT: Fetched schemas');
  }

  const cookies = req.cookies.apiId ? req.cookies : null;

  res.render('index', { bucketSchema, cookies, title: 'API documentation' });
});

module.exports = router;
