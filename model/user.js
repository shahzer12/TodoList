var knex = require('knex')({
  client: 'mysql',
  connection: {
  host: '127.0.0.1',
  user: 'root',
  password: 'root',
  database: 'todo'
},


}),
 _ = require('lodash');

exports.addUser = function (data, cb) {
  'use strict';

  knex('user').insert({email: data.email,
    password: data.password
  })
  .then(function (ret) {
    console.log(ret);
  })
  .catch(function (error) {
    cb(error);
  });
};

exports.select = function (data, cb) {
  'use strict';

  knex.select().table('user').where({email: data.email,
    password: data.password
    })
  .then(function (ret) {
    console.log(ret);
    cb(ret);
  })
  .catch(function (error) {
    console.log(error);
    cb(error);
  });
};

exports.addTodo = function (data, cb) {
  'use strict';

  knex('todo').insert({
    date: data.date,
    location: data.address,
    time: data.time,
    event: data.events,
    user_id: data.user_id

  })
  .then(function (ret) {
    cb(ret);
  })
  .catch(function (error) {
    cb(error);
  });
};

exports.searchTodo = function (data, cb) {
  'use strict';

  knex.select().table('todo').where({
    user_id: data.userid,
    date: data.date
  })
  .then(function (ret) {
    cb(ret);
  })
  .catch(function (error) {
    cb(error);
  });
};
 var res = {};

exports.checkRecord = function (data, done) {
  'use strict';


  knex.select().from('user')
  .where({
    email: data.email
  })
  .then(function (resp) {
    resp = resp[0];

    if (_.isEmpty(resp)) {
      res.success = true;
    } else {
      res.msg = 'email id exists';
      res.success = false;
    }
    done(res);
  })
  .catch(function (error) {
    res.success = false;
    res.msg = 'db-error';
    res.data = error;
    done(res);
  });
};

exports.adduserSocial = function (data, done) {
  'use strict';

  knex('user').insert(data)
  .then(function (data) {
    res.success = true;
    res.msg = 'register-success';
    res.data = data;
    done(res);
  })
  .catch(function (error) {
    res.success = false;
    res.msg = 'db-error';
    res.data = error;
    done(res);
  });
};

exports.verifySocial = function (data, done) {
  'use strict';

  knex.select('password', 'id').from('user')
  .where({
    email: data.email
  })
  .then(function (resp) {
    resp = resp[0];
    res.success = true;
    res.msg = 'verify-success';
    res.data = {
      id: resp.id,
      type: enum_map.user.type[resp.type]
    };
    done(res);
  })
  .catch(function (error) {
    res.success = false;
    res.msg = 'db-error';
    res.data = error;
    done(res);
  });
};

exports.selectSocial = function (data, cb) {
  'use strict';

  knex.select().table('user').where({email: data.email
    })
  .then(function (ret) {
    console.log(ret);
    cb(ret);
  })
  .catch(function (error) {
    console.log(error);
    cb(error);
  });
};
