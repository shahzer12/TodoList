$(document).ready(function () {
  'use strict';

  var j, obj, curr_date, fetchData, append_collapse_html, todo_obj,
    add_data_success = function (response) {
      if (!response.success) {
        localStorage.removeItem('token');
        window.location.href = '/';
      } else {
        todo_obj = response.data;
        if (todo_obj.length === 0) {
          $('#accordion').html('<div class="alert alert-danger"' +
            'role="alert"> <h3 id="text">Todo' +
            ' for this date is not available. Please click add button' +
            'to create yout todo</h3></div>');
        }
        for (j = 0; j < todo_obj.length; j++) {
          append_collapse_html = '<div class="panel panel-default">' +
            '<div class="panel-heading">' +
               '<h4 class="panel-title">' +
                 '<a data-toggle = "collapse" data-parent="#accordion"' +
                 'href="#collapse' + j + '">' + (j + 1) + ' TODO </a>' +
               '</h4>' +
            '</div>' +
            '<div id="collapse' + j + '" class="panel-collapse collapse">' +
              '<div class="panel-body">' +
                '<p>  Date ' + todo_obj[j].date + '</p>' +
                '<p>  Time ' + todo_obj[j].time + '</p>' +
                '<p>  Location ' + todo_obj[j].location + '</p>' +
                '<p>  Event ' + todo_obj[j].event + '</p>' +
                '<p>  User_id ' + todo_obj[j].user_id + '</p>' +
               '</div>' +
            '</div>' +
            '</div>';
          $('#accordion').append(append_collapse_html);
        }
      }
    },
    add_data_error = function () {
      console.log('ERROR TRIGGERED');
    };

  fetchData = function (extra_data) {
    obj = {
      token: localStorage.getItem('token')
    };
    _.extend(obj, extra_data);
    $.ajax({
      type: 'POST',
      data: obj,
      url: '/fetch',
      success: add_data_success,
      error: add_data_error

    });
  };

  $('#logout').click(function () {
    localStorage.removeItem('token');
    window.location.href = '/';
  });

  $(function () {
    $('#datepicker').datepicker({dateFormat: 'yy-mm-dd'})
      .datepicker('setDate', 'today');
    curr_date = $('#datepicker').val();
    fetchData({date: curr_date});
  });

  $(function () {
    $('[data-toggle="popover"]').popover();
  });

  $('#datepicker').change(function () {
    curr_date = $('#datepicker').val();
    $('#accordion').html('');
    fetchData({date: curr_date});
  });
});
