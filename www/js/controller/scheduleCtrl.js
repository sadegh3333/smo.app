ldpaApp.controller('scheduleCtrl' , function($scope){



  // Check the Login Stat
  LDPA.login_stat();


  $scope.list_schedule = function(){

    var jobschedule_local = JSON.parse(localStorage.getItem('jobschedule_local'));
    // count how many item in jobschedule_local
    var count = Object.keys(jobschedule_local).length - 1;


    //  Make an array for sort by JobscheduleID
    var ar = []
    for(var j = 0; j < count; j++) {
      ar.push(jobschedule_local[j]);
      // console.log(jobschedule_local[j].OrderDateTime);
      // console.log(new Date(jobschedule_local[j].OrderDateTime).getTime());

    }
    // var bb = [];
    // for(var b = 0; b < count; b++ ){
    //   ar[b].OrderDateTime = new Date(ar[b].OrderDateTime).getTime();
    // }

    ar.sort(function(a,b){
      // return new Date(a.start).getTime() - new Date(b.start).getTime()
      return a.OrderDateTime - b.OrderDateTime;
    });

    // for(var b = 0; b < count; b++ ){
    //   ar[b].OrderDateTime = new Date(ar[b].OrderDateTime);
    // }

    // console.log(ar);

    jobschedule_local = ar;

    $scope.jobschedule_local = jobschedule_local;
    // console.log($scope.jobschedule_local);

    // jobtype_color variable
    var jobtype_color;

    // Show item in list
    for (var i = 0; i < count; i++) {

      // Begin jobtype_color
      if(jobschedule_local[i].jobtypename == 'COM') {
        jobtype_color = 'jobtype-COM';
      }else if (jobschedule_local[i].jobtypename == 'AAA') {
        jobtype_color = 'jobtype-AAA';
      }
      else if (jobschedule_local[i].jobtypename == 'AAT') {
        jobtype_color = 'jobtype-AAT';
      }
      else if (jobschedule_local[i].jobtypename == 'AAD') {
        jobtype_color = 'jobtype-AAD';
      }
      else if (jobschedule_local[i].jobtypename == 'SER') {
        jobtype_color = 'jobtype-SER';
      }
      else {
        jobtype_color = '';
      }


    }

  }



  /**
  *   Function Get and assign new data to list
  *
  *   @since 3.0.167
  */
  $scope.AsssingData = function(){

    // Ask question
    var update = confirm("Do you want to update list ?");
    // var update = true;
    if (update == true) {

      // Set New Data
      localStorage.setItem('jobschedule_local',localStorage.getItem('jobschedule_new'));
      localStorage.setItem('updated-schdeule-list',1);


      $scope.get_schedule_task();



      // After Update datalist hide the button
      $('message').hide('slow');

      $(function() {
        $('message-noty').show('slow');
        setTimeout(function() {
          $("message-noty").hide('blind');
        }, 3000);
      });
      localStorage.setItem('updated-schdeule-list',0);


    } else {
      return;
    }
  }





  $scope.get_schedule_task = function(){
    var new_data = JSON.parse(localStorage.getItem('jobschedule_local'));
    // count how many item in jobschedule_local
    var count = Object.keys(new_data).length - 1;

    /* get_all_jobactivity */
    for(var i =0; i < count; i++){
      get_all_jobactivity(new_data[i].JobscheduleID);
    }
    $scope.list_schedule();


  }


  // Set a item in localstorage for when click on item goto page job
  $scope.gotodo = function(x) {
    localStorage.setItem('doschedule' ,x);
    window.location.assign('#!/jobschedule-do');
  }


  $scope.get_schedule_task();
  $scope.list_schedule();


  // Check Every 60 second , New Data is Available
  setInterval(function(){
    DB.get_job_schedule_from_server();
  },10000);

  // console.log(DB);


});
