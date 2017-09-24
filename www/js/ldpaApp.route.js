ldpaApp.config(function($routeProvider){
  $routeProvider
  .when('/',{
    templateUrl: 'template/home.html',
    controller: 'homeCtrl',
  })
  .when('/login',{
    templateUrl: 'template/login.html',
    controller: 'loginCtrl',
  })
  .when('/profile',{
    templateUrl: 'template/profile.html',
    controller: 'profileCtrl',
  })
  .when('/jobschedule',{
    templateUrl: 'template/job-schedule.html',
    controller: 'scheduleCtrl',
  })
  .when('/jobschedule-do',{
    templateUrl: 'template/job-schedule-do.html',
    controller: 'scheduleDoCtrl',
  })

});
