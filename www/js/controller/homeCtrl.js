ldpaApp.controller('homeCtrl', function($scope , $location){

  // Check the Login Stat
  LDPA.login_stat();


  $scope.WelcomeMessage = 'Welcome To SMO';

  DB.get_job_schedule_from_server();



  // Exit from app when its home page
  document.addEventListener("backbutton", exittoapp, false);
  function exittoapp() {

    var sure = confirm("Are you Sure To Exit ?");
    if (sure) {
      navigator.app.exitApp();
    } else {
      return;
    }
  }

});
