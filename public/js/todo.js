/* global navigator, google */
var initMap, lat, lon, map, x, y,  getLocation,
  showPosition_any, showPosition_current, geocodeLatLng, flag;

initMap = function() {

  'use strict';

  map = new google.maps.Map(document.getElementById('map'), {

  center: {lat: 12.9908247, lng: 77.66822980000006 },
  zoom: 15
  });

  map.addListener('click', function(e) {
    lat=e.latLng.lat();
    lon=e.latLng.lng();
    showPosition_any();
  });
};

getLocation = function() {
  'use strict';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition_current);
  } else {
    window.alert( "Geolocation is not supported by this browser.");
  }
};

showPosition_any = function () {
  'use strict';

  x=lat;
  y=lon;
  flag=1;
  var geocoder = new google.maps.Geocoder();
  var infowindow = new google.maps.InfoWindow();
  geocodeLatLng(geocoder, map, infowindow);
};

showPosition_current = function (position) {
  'use strict';

  flag = 2;
  x = position.coords.latitude;
  y = position.coords.longitude;
  var geocoder = new google.maps.Geocoder();
  var infowindow = new google.maps.InfoWindow();
  geocodeLatLng(geocoder, map, infowindow);
};

geocodeLatLng = function(geocoder, map, infowindow) {
  'use strict';

  var latlng = {lat: parseFloat(x),
     lng: parseFloat(y)};
  geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[1]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
        position: latlng,
        map: map
      });
      infowindow.setContent(results[1].formatted_address);
      infowindow.open(map, marker);
      if (flag === 1) {
        $(document).ready(function () {

          $('#address').val(results[1].formatted_address);
        });
      }

      if (flag === 2) {
        $(document).ready(function () {

           $('#address_modal').val(results[1].formatted_address);
          });
      }

     } else {
      window.alert('No results found');
    }

    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
};


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
            ' to create yout todo</h3></div>');
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
  $('#marker').click( function() {
    getLocation();
  });

});
