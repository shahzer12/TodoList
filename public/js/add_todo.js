$(document).ready(function () {
  'use strict';

  $(function () {
    $('#date-picker').datepicker();
  });

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
});
