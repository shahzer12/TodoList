var knex = require('knex')({
  client: 'mysql',
  connection: {
  host: '127.0.0.1',
  user: 'root',
  password: 'mauritius',
  database: 'todo'}
});

exports.adduser = function (data, cb) {
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
    cb(ret);
  })
  .catch(function (error) {
    cb(error);
  });
};

exports.addtodo = function (data, cb) {
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

exports.searchtodo = function (data, cb) {
  'use strict';

  knex.select().table('todo').where({user_id: data})
   .then(function (ret) {
     cb(ret);
   })
   .catch(function (error) {
     cb(error);
   });
};
