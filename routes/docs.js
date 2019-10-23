const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { repo } = require('../config');
const { buildKeys } = require('../helpers');

router.get('/', async function (req, res, next) {

  let filePath
  const apiParam = req.query.api;
  const { serviceKey, sortKey } = buildKeys(apiParam);

  try {
    const options = {
      maxAge: 1000 * 60 * 60 * 24 * 30,
      httpOnly: true, 
    }

    res.cookie('api', apiParam, options)
      .cookie('serviceKey', serviceKey, options)
      .cookie('sortKey', sortKey, options);

    filePath = await repo.getFilePath(apiParam);
  } catch (e) {
    console.error(e);
    next(e);
  }

  filePath = path.resolve(__dirname + `/../${filePath}`);

  res.set('Content-Type', 'application/x-yaml');
  res.sendFile(filePath);

  res.on('finish', function() {
    try {
      fs.unlinkSync(filePath); 
    } catch(err) {
      console.log('Error', err);
    }
  });
});

module.exports = router;
