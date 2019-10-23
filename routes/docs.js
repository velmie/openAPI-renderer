const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const { repository } = require('../config');
const { buildKeys } = require('../helpers');

const { 
  COOKIE_TTL = 2592000000,
} = process.env;

router.get('/', async function (req, res, next) {
  const apiParam = req.query.api;
  const { service } = buildKeys(apiParam);

  let filePath
  
  try {
    const options = {
      maxAge: COOKIE_TTL,
      httpOnly: true, 
    }

    res.cookie('key', apiParam, options)
      .cookie('service', service, options);

    filePath = await repository.getFilePath(apiParam);

  } catch (err) {
    console.error(err);
    next(err);
  }

  filePath = path.resolve(__dirname + `/../${filePath}`);

  res.set('Content-Type', 'application/x-yaml');
  res.sendFile(filePath);

  res.on('finish', function() {
    try {

      fs.unlinkSync(filePath); 

    } catch(err) {
      console.error(err);
    }
  });
});

module.exports = router;
