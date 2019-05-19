var express = require('express');
const path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/love', function(req, res, next) {
  const url  = path.join(path.dirname(__dirname), 'public/us.html');
  console.log(url);
  res.sendFile(url);
});

module.exports = router;
