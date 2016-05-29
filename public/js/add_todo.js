$(document).ready(function () {
  'use strict';

  var add_todo_error = function () {
      console.log('ERROR TRIGGERED');
    },
    add_todo_success = function (response) {
      if (response.success) {
        window.location.href = '/todo';
      }
    };

  $('#datepicker').datepicker({dateFormat: 'yy-mm-dd'});

  $('#add-todo').validate({
    rules: {
      time: {
        required: true
      },
      date: {
        required: true
      },
      events: {
        required: true
      },
      address: {
        required: true
      }
    },
    messages: {
      time: {
        required: '*Please enter the time'
      },
      date: {
        required: '*Please enter the date'
      },
      events: {
        required: '*Please enter the event'
      },
      address: {
        required: '*Please enter the address'
      }
    }
  });

  $('#sub').click(function () {
    var obj, token;

    obj = $('#add-todo').serialize();
    token = localStorage.getItem('token');
    obj = obj + '&token=' + token;

    $.ajax({
      url: '/add-todo',
      data: obj,
      type: 'POST',
      success: add_todo_success,
      error: add_todo_error
    });
  });
});
