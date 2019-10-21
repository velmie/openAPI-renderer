const express = require('express');
const router = express.Router();
const path = require('path');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.set('Content-Type', 'application/x-yaml');
  res.sendFile(path.resolve(__dirname + '/../private/api.yml'));
});

module.exports = router;
