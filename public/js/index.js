var getInfo, startApp, attachSignin, google_user, dbCheck, login,
  loginSuccessSocial = function (response) {
    'use strict';

    console.log("hi");
    if (!response.success) {
      $('#alert').html(response.msg).show();
    } else {
      localStorage.setItem('token', response.token);
      window.location.href = '/todo';
    }
  },

  loginErrorSocial = function (response) {
    'use strict';

    console.log ('ERROR TRIGGERED', response);
  };

window.fbAsyncInit = function() {
  FB.init({
    appId: '1615269955467043',
    cookie: true,

    /* Enable cookies to allow the server to access
      the session*/
    xfbml: true,

    // Parse social plugins on this page
    version: 'v2.5'

    // Use graph api version 2.5
  });
};

// Load the SDK asynchronously
(function(d, s, id) {
  'use strict';

  var js, fjs = d.getElementsByTagName(s)[0];

  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = '//connect.facebook.net/en_US/sdk.js';
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

/* Here we run a very simple test of the Graph API after login is
   successful. */
getInfo = function () {
  console.log('Welcome!  Fetching your information.... ');
  FB.api('/me?fields=name, email', function (response) {
    console.log('Successful login for: ' + response.name + '\n' +
    response.email, response.id);

    // Function to check if the current email is present in the db or not
    dbCheck({
      email: response.email
    });
  });
};
// Facebook Login Ending



$(document).ready(function () {
  'use strict';

  var add_data_success = function (response) {
    if (!response.success) {
      $('#alert').html(response.msg).show();
    } else {
      localStorage.setItem('token', response.token);
      window.location.href = '/todo';
    }
  },
    add_data_error = function () {
      console.log('ERROR TRIGGERED');
    };

  $('#alert').hide();
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
        required: 'Email field can\'t be empty',
        email: 'Insert correct email'
      },
      password: {
        required: 'Choose your password',
        minlength: 'Length should be more than 6.'
      }
    }
  });

  // before login check in browser local data whether token exist or not
  if (localStorage.getItem('token')) {
    window.location.href = '/todo';
  }
  $('#log').on('click', function () {
    $.ajax({
      url: '/login',
      type: 'POST',
      data: $('#todo-register').serialize(),
      success: add_data_success,
      error: add_data_error
    });
  });

   $('#fb').click (function (e) {
    e.preventDefault();

    FB.getLoginStatus(function (response) {
      window.fbAsyncInit();
      if (response.status === 'connected') {
        console.log('Already LogIn');
        getInfo();
      } else {
        FB.login(function (response) {
          if (response.status === 'connected') {
            getInfo();
          // Logged into your app and Facebook.
          } else if (response.status === 'not_authorized') {
            /* The person is logged into Facebook,
                but not your app.
            */
            console.log('not_authorized');
          } else {
            /* The person is not logged into
              Facebook,
              so we're not sure if
              they are logged into this app or not.
            */
            console.log('not sign in');
          }
        }, {scope: 'email, public_profile'});
      }
    });
  }); // Fb button event handler close

  // Functions sending requests to server side
  login = function (data) {
    'use strict';

    $.ajax({
      url: '/user/login_social',
      type: 'POST',
      data: data,
      success: loginSuccessSocial,
      error: loginErrorSocial
    });
  };

  /* Function dbCheck() checks whether the email obtained from google
    or facebook is present in the database or not*/
  dbCheck = function(data) {
    $.ajax({
      // Ajax to check email is present or not
      url: '/user/dbcheck_social',
      type: 'POST',
      data: data,
      success: function(resp) {
        if (resp.success) {
          /* If email is absent,
            enter it to database, then login */
          $.ajax({
            url: '/user/adduser_social',
            type: 'POST',
            data: data,
            success: function (resp) {
              if (resp.success) {
                login(data);
              } else {
                console.log('Error');
              }
            },
            error: function (err) {
              console.log ('SEARCH error ', err);
            }
          });
        } else if (!resp.success && resp.msg === 'email id exists') {

          // EmailId exists, only need to logIn
          login(data);
        } else {
          console.log('Error');
        }
      },
      error: function (err) {
        console.log ('SEARCH error ', err);
      }
    });
  }; // Function dbCheck() close

});
