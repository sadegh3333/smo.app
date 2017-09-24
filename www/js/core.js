// Make me Angular
var ldpaApp = angular.module('ldpaApp', ['ngRoute']);

// Hide splashscreen When Start App.
function onAppReady() {
  if( navigator.splashscreen && navigator.splashscreen.hide ) {   // Cordova API detected
    navigator.splashscreen.hide();
  }
}
document.addEventListener("app.Ready", onAppReady, false) ;


/*******************************
*   Core of LDPA App.
*
*   @since 0.10.1
*******************************/
// core Object, everything will store and call from here.
var LDPA = {};


// Running LPDA App. and fire the motion.
LDPA.core = function(){

  // Set Version
  LDPA.version = '3.4.33';
  // Set Channel Release
  LDPA.ChannelVersion = 'Pilot';

  LDPA.RootServer = 'https://00p.ir/smo';
  LDPA.APIServer = '/api/smo';

  $('.version').html(LDPA.version);
  $('.ChannelVersion').html(LDPA.ChannelVersion);

  document.addEventListener("offline", LDPA.onOffline, false);
  document.addEventListener("online", LDPA.onOnline, false);
  // document.addEventListener("app.Ready", LDPA.setVersion, false);

  // LDPA.login_stat();

  var login_status =  localStorage.getItem('logged_in');



  // Make RowNo if not Exist
  if (localStorage.getItem('RowNo') === null) {
    rownoDef = 0;
    localStorage.setItem('RowNo',rownoDef);
  };

  // Check For CheckTImer is available
  if (localStorage.getItem('checkTimer') === null) {
    localStorage.setItem('checkTimer', 0);
  }

  // Check For CheckTImer is available
  if (localStorage.getItem('multiCheker') === null || localStorage.getItem('multiCheker') == '') {
    var multiCheker = [{'id':'','rowno':'','nextActivity':'','timeLimit':'','timeBegin':''}];
    multiCheker_item = [];
    // multiCheker.push(multiCheker_item);
    localStorage.setItem('multiCheker', JSON.stringify(multiCheker_item));
    // console.log(JSON.parse(localStorage.getItem('multiCheker')));
    // console.log(JSON.parse(localStorage.getItem('multiCheker')).length);
  }
  // var leng = JSON.parse(localStorage.getItem('multiCheker')).length;

  // // Begin Multi Cheker
  // var multiCheker_new_item = {
  //   'id': 'x' ,
  //   'rowno': "$('#task_'+x+'').attr('rowno')" ,
  //   'nextActivity': "$('#task_'+x+'').attr('timelimitstoppedbysteps')" ,
  //   'timeLimit': "$('#task_'+x+'').attr('timelimit')" ,
  //   'timeBegin': "end_time",
  // };
  //
  // var temp_mc = JSON.parse(localStorage.getItem('multiCheker'));
  // console.log(temp_mc);
  // temp_mc.push(multiCheker_new_item);
  // localStorage.setItem('multiCheker',JSON.stringify(temp_mc));


  // if(leng > 0){
  //   $.each(JSON.parse(localStorage.getItem('multiCheker')),function(key,val){
  //     console.log(val.id);
  //   });
  // }

  // var hero = JSON.parse(localStorage.getItem('multiCheker')).splice(1,0);
  // console.log(hero);
  // localStorage.setItem('multiCheker' , hero);
  // console.log(JSON.parse(localStorage.getItem('multiCheker'))[0].id);


  // Created Global Variable for interval_timer
  var check_for_check;

  check_for_check = setInterval(function(){
    // console.log('this is CAP');
  }, 1000);


  return 'This is core of ldpa App.';
}

// Run LDPA Core
LDPA.core();


/*
*   Check the user is logged_in or not to show login button
*
*   @Since 0.3.10
*/
LDPA.login_stat = function() {

  if(localStorage.getItem('logged_in') == null){
    localStorage.setItem('logged_in','false');
  }

  var login_status =  localStorage.getItem('logged_in');
  if (login_status == "true") {
    // console.log('hello babe');
    $('.goto-login').css('display','none');
    $('.goto-schedule').css('display','block');
    $('.goto-app').css('width','23%');
  }
  else {
    console.log('ites false');
    $('.goto-schedule').css('display','none');
    $('.goto-login').html('login');
    $('.goto-app').css('width','100%');

    window.location.replace('#!/');
  }
}





LDPA.onOffline = function() {
  LDPA.NET_STATE = 'offline';
}
LDPA.onOnline = function() {
  LDPA.NET_STATE = 'online';
}


// // console.log(LDPA);
// /*
// *   Check the user is logged_in or not to show login button
// *
// *   @Since 0.3.10
// */
// LDPA.login_stat = function() {
//
//   if(localStorage.getItem('logged_in') == null){
//     localStorage.setItem('logged_in','false');
//   }
//
//   var login_status =  localStorage.getItem('logged_in');
//   // console.log(login_status);
//   if (login_status == "true") {
//     // console.log('hello babe');
//     $('.goto-login').css('display','none');
//     $('.goto-schedule').css('display','block');
//     $('.goto-app').css('width','23%');
//   }
//   else {
//     $('.goto-schedule').css('display','none');
//     $('.goto-login').attr('href','login.html');
//     $('.goto-login').html('login');
//     $('.goto-app').css('width','100%');
//   }
// }
// LDPA.login_stat();




// console.log(JSON.parse(localStorage.getItem('jsdo_done')));
// console.log(JSON.parse(localStorage.getItem('jsdo_done_readyforsync')));
/*
*  Set a jsdo_done_readyforsync (JobSchedule doing for sending to database)
*
*  @Since 0.9.42
*/
var jsdo_done_default;
function jsdo_done_default(){
  if (localStorage.getItem('jsdo_done_readyforsync') == null ) {
    jsdo_done_default = {items: [
      {jobActivity:-1,datetime:0,HasAdditionalInput:0}
    ]};
    localStorage.setItem('jsdo_done_readyforsync',JSON.stringify(jsdo_done_default));
  }
}
jsdo_done_default();


$(document).ready(function(){


  /*
  *  Set a jsdo_done (JobSchedule doing for Store in localStorage)
  *
  *  @Since 0.8.72
  */
  var jsdo_done_default;
  if (localStorage.getItem('jsdo_done') === null) {
    jsdo_done_default = {items: [
      {jobActivity:-1,datetime:0,HasAdditionalInput:0}
    ]};
    localStorage.setItem('jsdo_done',JSON.stringify(jsdo_done_default));
  }




  /*
  *   Go to login page with transition
  *
  *   @Since 0.2.18
  */
  $('.goto-login').click(function(){

    $("body").css('right','100%').delay(1).fadeOut(function(){
      window.location.replace('login.html');
    });
  });




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

    $('.message').hide();
    $('.show-loading').show();
    $.ajax({
      // The URL for the request
      url: LDPA.RootServer+LDPA.APIServer+"/login/",

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
        $('.message').css('display', 'inline-block');
        $('.show-loading').hide();
        $('.message').html('Your are logged in');
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
        $('.message').show();
        $('.message').css('display', 'inline-block');
        $('.message').html('Your Password or Username is wrong');
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




  /*
  *   Update checker
  *
  *   @param current_version
  *
  *   @Since 0.6.105
  */
  LDPA.update_checker = function(){

    $.ajax({
      // The URL for the request
      url: LDPA.RootServer+LDPA.APIServer+"/update/",

      // The data to send (will be converted to a query string)
      data: {
        current_version: LDPA.version,
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

      if (jsondata != null) {
        $('.new_version').show('slow');
        LDPA.new_version = jsondata.url;
      }


    })
    // Code to run if the request fails; the raw request and
    // status codes are passed to the function
    .fail(function (xhr, status, errorThrown) {
      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
      console.dir(xhr);
    });
  }

  //Create Var new_version for store new version url
  LDPA.new_version;

  setTimeout(function(){
    LDPA.update_checker();

  },2000);
  $('#new_version').click(function(){

    // window.open(encodeURI(new_version), '_system', 'location=yes');
    cordova.InAppBrowser.open(LDPA.new_version, '_system', 'location=yes');
  });





  /*
  *    Sign-Out Proccess
  *
  *    @Since 0.3.21
  */
  LDPA.logout = function(e){
    e.preventDefault();

    localStorage.clear();
    localStorage.setItem('logged_in','false');
    setTimeout(function(){
      window.location.assign('index.html');
    },500);
  }
  $('.logout').click(function(){
    LDPA.logout();
  })


  /*
  *    Back Button Proccess
  *
  *    @Since 0.3.21
  */
  function back_button(){
    window.history.back();
  }
  // $('.back-button').click(function(e){
  //   e.preventDefault();
  //   $('body').fadeOut();
  //   setTimeout(function(){
  //     window.history.back();
  //   },500);
  // });

  /*
  *    Home Button Proccess
  *
  *    @Since 0.5.0
  */
  // $('.home-button').click(function(e){
  //   e.preventDefault();
  //   $('body').fadeOut();
  //   setTimeout(function () {
  //     window.location.assign('index.html');
  //   }, 500);
  // });



  $('.goto-profile').click(function(e){
    e.preventDefault();
    $('body').fadeOut();
    setTimeout(function () {
      window.location.assign('profile.html');
    }, 500);
  });



















  // End Document ready
});


/*
*   Check different between two array
*   true is not different
*   @param arrA , arrB
*
*   @Since 0.7.22
*/
function checkArrays( arrA, arrB ){

  //check if lengths are different
  if(arrA.length !== arrB.length) return false;


  for(var i=0;i<arrA.length;i++){
    if(arrA[i]!==arrB[i]) return false;
  }

  return true;

}


/*
*   Function append with added element to page work with ID
*
*
*/
function afzodan(el,type,attr,setattr,content){

  /* Grab an element */
  var el = document.getElementById(el),

  /* Make a new div */
  elChild = document.createElement(type);
  elChild.setAttribute("id", setattr);

  /* Give the new div some content */
  elChild.innerHTML = content;

  /* Jug it into the parent element */
  el.appendChild(elChild);
}

// Exit When in home page and click on backbutton
document.addEventListener("backbutton", LDPA.exittoapp, false);
LDPA.exittoapp = function() {

  if (parseInt(window.history.length) <= 2) {
    var sure = confirm("Are you Sure ?");

    if (sure) {
      navigator.app.exitApp();
    } else {
      return;
    }

  } else {
    window.history.back();
  }

}












/*
*   Check new data is available
*   Check the username and password is correct
*   @param old_data , new_data
*
*   @Since 0.7.22
*/
function check_new_data(old_data, new_data){

  var count = Object.keys(old_data).length - 1;
  var jsold = [];
  for (var o = 0; o < count; o++ ){
    jsold.push(old_data[o].JobscheduleID);
  }


  var count0 = Object.keys(new_data).length -1;
  var jsnew = [];
  for (var n = 0; n < count0; n++ ){
    jsnew.push(new_data[n].JobscheduleID);

  }

  if (checkArrays(jsold,jsnew) == false) {
    return true;
  }else{
    return false;
  }

}
