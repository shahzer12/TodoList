var express = require('express'),
  app = express(),
  crypto = require('crypto'),
  router = express.Router(),
  path = require('path'),
  user = require('../model/user'),
  jwt = require('jsonwebtoken');

app.set('superSecret', 'abcdef');
router.post('/login', function (req, res) {
  'use strict';

  var obj = req.body,
    res_obj = {
      success: false,
      msg: ''
    },
    token;

  user.select(obj, function (response, err) {
    if (err) {
      res_obj.msg = 'something error occured';
      res.send(res_obj);
    } else if (response.length === 0) {
      res_obj.msg = 'user name doesnt exist';
      res.send(res_obj);
    } else {
      res_obj.success = true;
      token = jwt.sign({userid: response[0].id}, app.get('superSecret'),
      {
        expiresIn: 1440
      });
      res_obj.token = token;
      res.send(res_obj);
    }
  });
});

router.get('/todo', function (req, res) {
  'use strict';

  res.sendFile(path.join(__dirname + '/../views/todo.html'));
});

router.post('/add-todo', function (req, res) {
  'use strict';

  var req_data = req.body,
    token = req.body.token,
    res_obj = {
      success: false,
      msg: ''
    };

  if (token) {
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        res.send(res_obj);
      } else {
        res_obj.success = true;
        req_data.user_id = decoded.userid;
        user.addTodo(req_data, function (response, error) {
          if (!error) {
            res_obj.data = response;
            res.send(res_obj);
          }
        });
      }
    });
  } else {
    res.send(res_obj);
  }
});

router.post('/fetch', function (req, res) {
  'use strict';

  var token = req.body.token,
    res_obj = {
      success: false,
      msg: ''
    },
    userid;

  if (token) {
    jwt.verify(token, app.get('superSecret'), function (err, decoded) {
      if (err) {
        res.send(res_obj);
      } else {
        // if everything is good, save to request for use in other routes
        res_obj.success = true;
        userid = decoded.userid;
        user.searchTodo({userid: userid,
          date: req.body.date},
          function (response, error) {
          if (!error) {
            res_obj.data = response;
            res.send(res_obj);
          }
        });
      }
    });
  } else {
    /* if there is no token
    return an error*/
    res.send(res_obj);
  }
});

router.post('/user/dbcheck_social', function (req, res) {
  'use strict';

  user.checkRecord(req.body, function (resp) {
    res.send(resp);
  });
});

router.post('/user/adduser_social', function (req, res) {
  'use strict';

  var obj = {
    email: req.body.email
  };

  user.adduserSocial(obj, function (resp) {
    if (resp.success) {
      resp.msg = 'table-success';
      // resp.msg = util.getTranslation(resp.msg);
    } else {
      // resp.msg = util.getTranslation(resp.msg);
    }
    res.send(resp);
  });
});

router.post('/user/login_social', function (req, res) {
  'use strict';

  var data = req.body,
    obj = {
      email: data.email
    };

 var obj = req.body,
    res_obj = {
      success: false,
      msg: ''
    },
    token;

  user.selectSocial(obj, function (response, err) {
    if (err) {
      res_obj.msg = 'something error occured';
      res.send(res_obj);
    } else if (response.length === 0) {
      res_obj.msg = 'user name doesnt exist';
      res.send(res_obj);
    } else {
      res_obj.success = true;
      token = jwt.sign({userid: response[0].id}, app.get('superSecret'),
      {
        expiresIn: 1440
      });
      res_obj.token = token;
      res.send(res_obj);
    }
  });
});
module.exports = router;
