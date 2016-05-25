var express = require('express'),
  router = express.Router();

router.post('/login', function (req) {
  'use strict';

  console.log(req.body);
});

module.exports = router;
