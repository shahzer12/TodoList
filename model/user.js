var knex = require('knex')({
  client: 'mysql',
  connection: {
  host: '127.0.0.1',
  user: 'hash',
  password: 'hashcube',
  database: 'todo'
  }
});

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
