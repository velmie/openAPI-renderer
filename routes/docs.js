const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

router.get('/', function (req, res, next) {
  const filepath = __dirname + `/../${req.query.filepath}`;
  
  res.set('Content-Type', 'application/x-yaml');
  res.sendFile(path.resolve(filepath));

  res.on('finish', function() {
    try {
      fs.unlinkSync(filepath); 
    } catch(err) {
      console.log('Error', err);
    }
  });
});

module.exports = router;
