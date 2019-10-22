const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { repo } = require('../config');

router.get('/', async function (req, res, next) {

  let filePath
  const apiParam = req.query.api;
  try {

    let options = {
      maxAge: 1000 * 60 * 60 * 24 * 30, // would expire after 15 minutes
      httpOnly: true, // The cookie only accessible by the web server
      signed: false // Indicates if the cookie should be signed
  }


    res.cookie('api',apiParam, options);
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
