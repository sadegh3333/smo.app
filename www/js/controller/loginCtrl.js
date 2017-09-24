ldpaApp.controller('loginCtrl', function($scope){



  $('.message-login').hide();

  /*
  *   Login Proccess
  *   Check the username and password is correct
  *   @param username, password
  *
  *   @Since 0.3.0
  */
  $('.login').submit(function(e){
    e.preventDefault();
    var username_input = $('.username-input').val();
    var password_input = $('.password-input').val();

    localStorage.setItem('logged_in', false);
    localStorage.setItem('username' , '');
    localStorage.setItem('password', '');
    localStorage.setItem('secure_key', '');

    $('.message-login').hide();
    $('.show-loading').show();
    $.ajax({
      // The URL for the request
      url: LDPA.RootServer+"/api/ldpa/login/",

      // The data to send (will be converted to a query string)
      data: {
        username: username_input,
        password: password_input,
        secure_key: '3d4dcd6fc8845fa8dfc04c3ea01eb0fb',
      },

      // Whether this is a POST or GET request
      type: "POST",

      // The type of data we expect back
      dataType: "json",
    })
    // Code to run if the request succeeds (is done);
    // The response is passed to the function
    .done(function (json) {
      jsondata = json;
      // console.log(Object.keys(jsondata).length);
      if (jsondata.login_status === 'logged_in') {
        $('.show-loading').hide();
        $('.message-login').css('display', 'inline-block');
        $('.message-login').css('background-color','#009688');
        $('.message-login').html('<i class="fa fa-check" aria-hidden="true"></i> Your are logged in');
        localStorage.setItem('logged_in', true);
        localStorage.setItem('username' , jsondata.username);
        localStorage.setItem('password', jsondata.password);
        localStorage.setItem('secure_key', jsondata.secure_key);
        localStorage.setItem('role', jsondata.role);
        localStorage.setItem('id', jsondata.id);
        localStorage.setItem('display_name', jsondata.display_name);

        // Redirect To Home page
        setTimeout(function(){
          window.location.replace('index.html');
        },1000);

      }
      else {
        $('.show-loading').hide();
        $('.message-login').show();
        $('.message-login').css('display', 'block');
        $('.message-login').css('background-color','#FF5722');
        $('.message-login').html('<i class="fa fa-exclamation-triangle" aria-hidden="true"></i> Something is wrong');
      }


    })
    // Code to run if the request fails; the raw request and
    // status codes are passed to the function
    .fail(function (xhr, status, errorThrown) {
      $('.show-loading').hide();
      $('.message').show();
      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
      console.dir(xhr);
    });
  });



});
