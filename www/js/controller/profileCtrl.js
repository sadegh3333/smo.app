ldpaApp.controller('profileCtrl',function($scope){

  // Check the Login Stat
  LDPA.login_stat();

  $scope.user_name = localStorage.getItem('display_name');
  $scope.user_role = localStorage.getItem('role');



  /*
  *    Sign-Out Proccess
  *
  *    @Since 0.3.21
  */
  $scope.logout = function(){

    localStorage.clear();
    localStorage.setItem('logged_in','false');
    setTimeout(function(){
      window.location.assign('index.html');
    },500);
  }

});
