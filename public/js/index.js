$(document).ready(function () {
  'use strict';

  var add_data_success = function (response) {
      console.log(response);
    },
    add_data_error = function () {
      console.log('ERROR TRIGGERED');
    };

  $('#todo-register').validate({
    rules: {
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        minlength: 6
      }
    },
    messages: {
      email: {
        required: 'Email field cant be empty',
        email: 'Insert correct email'
      },
      password: {
        required: 'Choose your password',
        minlength: 'Length should be more than 6.'
      }
    }
  });

  $('#log').on('click', function (e) {
    e.preventDefault();// Prevent normal buttomn action.

    $.ajax({
      url: '/login',
      type: 'POST',
      data: $('#todo-register').serialize(),
      success: add_data_success,
      error: add_data_error
    });
  });
});
