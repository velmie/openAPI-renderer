const express = require('express');
const router = express.Router();
const { repo, cache } = require('../config');

router.get('/', async (req, res, next) => {
  try {
    let schemas = cache.get('schemas');

    if (!schemas) {
      schemas = await repo.get();

      cache.set('schemas', schemas);
      console.log('MISS: Fetched schemas');
    } else {
      console.log('HIT: Fetched schemas');
    }
    res.json(schemas);
  } catch (e) {
    next(e);
  }
});
  
router.post('/document', async (req, res, next) => {
  const { release } = req.body;
    try {
      const filePath = await repo.getFilePath(release);
      res.send(filePath);
    } catch (e) {
      next(e);
    }
  });

module.exports = router;
