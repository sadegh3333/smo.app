var DB = {};
// DB.timer_running;


/*
*   Function get Time now with format like 2017-02-27 02:39:47
*
*   @since 1.3.0
*/
DB.getTimewithFormat = function(){

  var today = new Date();
  var yyyy = today.getFullYear();
  var mm = today.getMonth()+1;
  var dd = today.getDate();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();

  if(dd<10){ dd='0'+dd;}
  if(mm<10){ mm='0'+mm;}
  if(h<10){h='0'+h;}
  if(m<10){m='0'+m;}
  if(s<10){s='0'+s;}

  timeanddate = yyyy+'-'+mm+'-'+dd+' '+h+':'+m+':'+s;

  return timeanddate;
}

/*
*   Get All JobActivity And Store into localstorage
*   @param jsdo ( jobschdeduleid )
*
*   @Since 0.7.15
*/
function get_all_jobactivity(jsdo){

  var jsdo = jsdo;

  $.ajax({
    url: LDPA.RootServer+"/api/ldpa/do_schedule/",

    data: {
      jobscheduleid: jsdo,
    },

    type: "POST",

    dataType: "json",
  })

  .done(function (json) {
    jsondata = json;

    localStorage.setItem('jsdo_'+jsdo,JSON.stringify(jsondata));

  })

  .fail(function (xhr, status, errorThrown) {

    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
  });

}









/*
*   Get All jobschedule Data from Server and Store into localStorage
*   Also check the new data is available or not if yes show message to user
*   @param id
*
*   @Since 0.10.33
*/
DB.get_job_schedule_from_server = function(){

  $.ajax({
    url: LDPA.RootServer+"/api/ldpa/schedule/",
    data: {
      userid: localStorage.getItem('id'),
    },
    type: "POST",
    dataType: "json",
  })
  .done(function (json) {

    // Store all data into localStorage.jobschedule_local
    jsondata = json;
    // jobschedule is in local database or not
    if (localStorage.getItem('jobschedule_local') === null) {
      localStorage.setItem('jobschedule_local',JSON.stringify(json));
      window.location.replace('#!/jobschedule');
    }

    jobschedule_local = JSON.parse(localStorage.getItem('jobschedule_local'));

    // console.log(jobschedule_local);

    // Check new data is available or not
    var check_new = check_new_data(jobschedule_local , json);

    // if Data new is available show message to user
    if ( check_new ) {
      $('message').show('slow');
      console.log('New Data is Available!');
      localStorage.setItem('jobschedule_new',JSON.stringify(jsondata));
    }







  })
  .fail(function (xhr, status, errorThrown) {
    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
  });

}




/**
*   Show list Dp_list for job-schedule-do page
*
*
*   @since 0.10.33
**/
DB.show_do_list = function(){

  // Get id from which jobschedule is Running
  js_doing = localStorage.getItem('doschedule');
  jsdo_doing = JSON.parse(localStorage.getItem('jsdo_'+js_doing));

  // console.log(jsdo_doing);
  var count = Object.keys(jsdo_doing).length - 1 ;


  // Variable for fill in rows
  var done_status_check;
  var job_done_class;

  // Found VesselName From list schedule in localStorage and show in VesselName part
  var job_schedule_local = JSON.parse(localStorage.getItem('jobschedule_local'));
  var count_all_schedule = Object.keys(job_schedule_local).length - 1 ;
  for(var a = 0; a < count_all_schedule; a++){
    if(job_schedule_local[a].JobscheduleID == js_doing){
      $('.VesselName').html(job_schedule_local[a].VesselName);
      $('.JobscheduleID').html(job_schedule_local[a].JobscheduleID);
      $('.JobOrderID').html(job_schedule_local[a].JoborderID);
      $('.JobType').html(job_schedule_local[a].jobtypename);
      $('.get_report').attr('href' , 'http://74.208.129.75:8080/ldpa/report-for-mobile-app/?JobscheduleID='+job_schedule_local[a].JobscheduleID);

      break;
    }
  }



  var jobactivityid_list = [];

  // console.log(count);
  // Loop for show list
  for (var i = count -1; i >= 0; i--) {

    jobactivityid_list.push(jsdo_doing[i].JobactivityID);
    // Check the Job is done or ney for show datetime
    if(jsdo_doing[i].EndDateTime == null){
      done_status_check =  '<div class="done_status" id="jobActivityID_'+jsdo_doing[i].JobactivityID+'"> <button class="btnbegin" id onClick="DB.btndone('+jsdo_doing[i].JobactivityID+')"id="this_act_'+jsdo_doing[i].JobactivityID+'"><i class="fa fa-check-square-o" aria-hidden="true"></i> Done </button> </div>';
      job_done_class = '';
    }else {
      done_status_check =  '<div class="done_status" id="jobActivityID_'+jsdo_doing[i].JobactivityID+'">'+jsdo_doing[i].EndDateTime+' </div>';
      job_done_class = 'job_done seafoam';
    }

    $('.todo_list').after(
      '<div class="'+job_done_class+' item_todo ActivityID_'+jsdo_doing[i].ActivityID+'" id="task_'+jsdo_doing[i].JobactivityID+'" RowNo="'+jsdo_doing[i].RowNo+'"  Timelimitstoppedbysteps="'+jsdo_doing[i].Timelimitstoppedbysteps+'" TimeLimit="'+jsdo_doing[i].TimeLimit+'" ActivityID="'+jsdo_doing[i].ActivityID+'" HasAdditionalInput="'+jsdo_doing[i].HasAdditionalInput+'">' +
      '<span>'+
      '<div class="id-schedule"><div><i class="fa fa-key" aria-hidden="true"></i>' +jsdo_doing[i].JobactivityID +' - <button class="edit-btn edit-btn-'+jsdo_doing[i].JobactivityID+'" ng-click="btnedit('+jsdo_doing[i].JobactivityID+')">edit</button></div><div><strong>'+
      jsdo_doing[i].ActivityName +'</strong></div></div>'+
      '</span><span>'+
      '<div class="hasadditional"></div>'+
      done_status_check +
      '</span>'+
      '<div class="additional" id="additional_'+jsdo_doing[i].JobactivityID+'">'+jsdo_doing[i].Value+'</div></div>'
    );

    $('#additional_'+jsdo_doing[i].JobactivityID+'').html(jsdo_doing[i].Value);


    // Check the Job is done or ney for show edit-btn
    if(jsdo_doing[i].EndDateTime == null){
      $('.edit-btn-'+jsdo_doing[i].JobactivityID+'').hide();
    }else {
      $('.edit-btn-'+jsdo_doing[i].JobactivityID+'').show();
    }




  } // End Loop

  // console.log(jobactivityid_list);
  countjl =  jobactivityid_list.length;

  // Overwrite do job for which one job_done
  var get_job_done = JSON.parse(localStorage.getItem('jsdo_done'));
  var count_job_done = get_job_done.items.length - 1 ;

  for (var o = count_job_done; o > 0; o--) {
    // console.log(get_job_done.items[o].jobActivity);
    for (var c = 0; c < countjl; c++) {
      if(jobactivityid_list[c] == get_job_done.items[o].jobActivity){
        // console.log('yeah its equal '+ jobactivityid_list[c]);
        // here we are , Overwrite task item
        $('#task_'+get_job_done.items[o].jobActivity+'').addClass('job_done');
        $('#task_'+get_job_done.items[o].jobActivity+'').addClass('seafoam');
        $('.edit-btn-'+get_job_done.items[o].jobActivity+'').show();
        $('#jobActivityID_'+get_job_done.items[o].jobActivity+'').html(get_job_done.items[o].datetime);
        $('#additional_'+get_job_done.items[o].jobActivity+'').html(get_job_done.items[o].HasAdditionalInput);
      }
    }
  }
  // console.log(get_job_done);
  // console.log(count_job_done);

}




/*
*   btndone is a button for begin a job when user clicked on it,
*   System begin a timer for limited select next job
*
*   @param x(JobactivityID)
*
*   @since 0.8.72
*/
DB.btndone = function(x){


  // Ask question
  var update = confirm("Do you want to Submit ?");
  // var update = true;
  if (update == true) {


    // console.log('hello edited button');
    $('.edit-btn-'+x+'').fadeIn('100');
    // Reset the time
    // msLeft = 0;

    // Get variable x(JobactivityID)
    var x = x;


    // Remove all next job cover color
    // Get id from which jobschedule is Running
    js_doing = localStorage.getItem('doschedule');
    jsdo_doing = JSON.parse(localStorage.getItem('jsdo_'+js_doing));

    var count = Object.keys(jsdo_doing).length - 1 ;

    // Remove all next_job Class
    for(j = 0; j < count; j++){
      $('.next_job').removeClass('next_job');
    }

    $('.item_todo').removeClass('this_job');
    $('#task_'+x).addClass('this_job');


    // var this_task = JSON.parse(localStorage.getItem('jobscheduledooffline'));

    $('#task_'+x).attr('job_done','true');
    $('#task_'+x).addClass('job_done');
    $('#task_'+x).addClass('seafoam');

    var HasAdditionalInput = $('#task_'+x).attr('HasAdditionalInput');


    if(HasAdditionalInput == 1 ){

      var AdditionalInput_text = prompt("Please enter AdditionalInput", " ");
      if (AdditionalInput_text != null) {
        $('#additional_'+x).html(AdditionalInput_text);
      }
      if(AdditionalInput_text == null ){AdditionalInput_text = '';}
    }

    var next_job = '';
    var  this_ActivityID = $('.this_job').attr('ActivityID');
    next_job = $('.this_job').attr('timelimitstoppedbysteps');


    next_job_split = next_job.split(',');
    for ( var i = 0; next_job_split.length > i; i++ ){
      s = next_job_split[i].trim();
      next_job_split[i] = s;
    }



    for( var o = 0; next_job_split.length > o; o++ ){
      $('.ActivityID_'+next_job_split[o]+'').addClass('next_job');
    }

    var Timelimit = $('#task_'+x).attr('TimeLimit');


    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1;
    var hour = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();

    var yyyy = today.getFullYear();
    if(dd < 10 ){dd = '0'+dd;}
    if(mm < 10 ){ mm='0'+mm;}
    if(hour < 10){hour = '0'+hour;}
    if(minute < 10){minute = '0'+minute;}
    if(second < 10){second = '0'+second;}


    var todaynow = yyyy+'-'+mm+'-'+dd+' '+hour+':'+minute+':'+second;

    var jobActivitynumber = 'jobActivityID_'+x;


    // Added Data to localStorage
    var DATA;
    DATA = JSON.parse(localStorage.getItem('jsdo_done'));

    var count = DATA.items.length

    for(var i = 0; i < count; i++){
      var there_is = '';
      var current_item = DATA.items[i].jobActivity;
      if(current_item == x){
        there_is = i;
        break;
      }
    }

    if(there_is != ''){
      DATA.items[there_is].datetime = todaynow;
    } else {
      DATA.items.push({jobActivity:x,datetime:todaynow,HasAdditionalInput:AdditionalInput_text});
    }

    localStorage.setItem('jsdo_done',JSON.stringify(DATA));

    $('#'+jobActivitynumber+'').html(localStorage.getItem(jobActivitynumber));

    // set which activity is running
    localStorage.setItem('schedule_running',x);

    $('#'+jobActivitynumber+'').html(todaynow);
    // clearInterval(DB.timer_running);
    // DB.timer_down(Timelimit,x);






    var getTime = DB.getTimewithFormat();

    var notify = {'event':'','time':'','type':'','jobActivity':'','position':''};
    notify = {items: [
      // {event:-1,time:0}
    ]};

    if(localStorage.getItem('notification') === null ){
      localStorage.setItem('notification',JSON.stringify(notify));
    }

    // DB.notification();
    // Added a notify
    var getTime = DB.getTimewithFormat();
    getdata = JSON.parse(localStorage.getItem('notification'));
    var get_position = localStorage.getItem('location');

    getdata.items.push(
      {
        event: x,
        time:getTime,
        type:'done',
        jobActivity: x,
        position: get_position,
      }
    );
    localStorage.setItem('notification',JSON.stringify(getdata));

    DB.sync_with_server();

    var end_time = (Date.now() + (Timelimit * 60 * 1000));


    var the_last_stand = $('#task_'+x+'').siblings().length;
    console.log(the_last_stand);

    console.log('1');

    // if(the_last_stand == $('#task_'+x+'').attr('RowNo') ){
    //   localStorage.setItem('checkTimer',0);
    //   localStorage.setItem('timeover_running','OFF');
    // }
    // if($('#task_'+x+'').attr('RowNo') == 1  ) {
    //   localStorage.setItem('checkTimer',0);
    // }
    if($('#task_'+x+'').attr('RowNo') == 1 || $('#task_'+x+'').attr('RowNo') == the_last_stand ){
      multiCheker_item = [];
      localStorage.setItem('multiCheker',JSON.stringify(multiCheker_item));
    }

    // Timer is Coming...
    if(Timelimit != 0 ){


      // Begin Multi Cheker
      var multiCheker_new_item = {
        'id': x ,
        'rowno': $('#task_'+x+'').attr('rowno') ,
        'nextActivity': $('#task_'+x+'').attr('timelimitstoppedbysteps').split(',') ,
        'timeLimit': $('#task_'+x+'').attr('timelimit') ,
        'end_time': end_time,
        'timeBegin': Date.now(),
        'notify_stat': 'notyet',
      };

      var temp_mc = JSON.parse(localStorage.getItem('multiCheker'));
      temp_mc.push(multiCheker_new_item);
      localStorage.setItem('multiCheker',JSON.stringify(temp_mc));


      var get_mc_add_item = JSON.parse(localStorage.getItem('multiCheker'));



      var new_array_to_add = get_mc_add_item;
      $.each(get_mc_add_item,function(key,val){

        $.each(val.nextActivity,function(keyn,valn){
          if(valn.trim() == $('#task_'+x+'').attr('rowno')){

            new_array_to_add[key].notify_stat = 'sent';

          }
        });

        localStorage.setItem('multiCheker' , JSON.stringify(new_array_to_add));

      });
      // console.log(JSON.parse(localStorage.getItem('multiCheker')));


      $.each($('#task_'+x+'').attr('timelimitstoppedbysteps').split(',') , function(key,val){

        // console.log($('.ActivityID_'+val.trim()+'').html());
        if($('.ActivityID_'+val.trim()+'').hasClass('job_done')){
          console.log('yeha its done');
          $.each(new_array_to_add,function(keyn,valn){
            if(new_array_to_add[keyn].id == x){
              new_array_to_add[keyn].notify_stat = 'sent';
            }
          })
        }
      });
      localStorage.setItem('multiCheker' , JSON.stringify(new_array_to_add));
      // console.log(new_array_to_add);
      console.log(JSON.parse(localStorage.getItem('multiCheker')));




      // if($('#task_'+x+'').attr('RowNo') == the_last_stand){
      //   multiCheker_item = [];
      //   localStorage.setItem('multiCheker',JSON.stringify(multiCheker_item));
      // }


      // End Multi Cheker


      // var end_time = (Date.now() + (Timelimit * 60 * 1000));
      //
      // // console.log('time limit is not zero');
      // if(localStorage.getItem('checkTimer') == 0 ){
      //   // console.log('is on the if');
      //   var timer_data = {
      //     'timelimitstoppedbysteps': $('#task_'+x+'').attr('timelimitstoppedbysteps').split(','),
      //     'schedule_running':x,
      //     'rowno': $('#task_'+x+'').attr('RowNo'),
      //     'time_submited': end_time,
      //   };
      //
      //   localStorage.setItem('RowNo',$('#task_'+x+'').attr('rowno'));
      //
      //   localStorage.setItem('timeover_running','ON');
      //   localStorage.setItem('checkTimer',JSON.stringify(timer_data));
      //
      //
      // }else {
      //
      //   var which_next = JSON.parse(localStorage.getItem('checkTimer')).timelimitstoppedbysteps;
      //   for (var i = 0; i < which_next.length; i++) {
      //     // console.log(which_next[i]);
      //     if($('#task_'+x+'').attr('rowno') == which_next[i]){
      //
      //       // clearInterval(interval_timer);
      //       localStorage.setItem('timeover_running','OFF');
      //       localStorage.setItem('checkTimer',0);
      //
      //
      //       // localStorage.setItem('end_time',end_time);
      //       var timer_data = {
      //         'timelimitstoppedbysteps': $('#task_'+x+'').attr('timelimitstoppedbysteps').split(','),
      //         'schedule_running':x,
      //         'rowno': $('#task_'+x+'').attr('RowNo'),
      //         'time_submited': end_time,
      //       };
      //
      //       localStorage.setItem('RowNo',$('#task_'+x+'').attr('rowno'));
      //
      //       localStorage.setItem('checkTimer',JSON.stringify(timer_data));
      //       // console.log('timeover made');
      //       localStorage.setItem('timeover_running','ON');
      //
      //     }
      //     else{
      //       // console.log('is on the else second');
      //       var timer_data = {
      //         'timelimitstoppedbysteps': $('#task_'+x+'').attr('timelimitstoppedbysteps').split(','),
      //         'schedule_running':x,
      //         'rowno': $('#task_'+x+'').attr('RowNo'),
      //         'time_submited': end_time,
      //       };
      //
      //       localStorage.setItem('RowNo',$('#task_'+x+'').attr('rowno'));
      //
      //       localStorage.setItem('timeover_running','ON');
      //       localStorage.setItem('checkTimer',JSON.stringify(timer_data));
      //       // console.log('there is nothing same rowno');
      //     }
      //   }
      // }
      // DB.countdown(Timelimit,x);
    }


    // sync with server if server is available

    // DB.show_do_list();
  } else { return; } // end question
}


DB.multiChekerTimer = function(){

  var get_mc = JSON.parse(localStorage.getItem('multiCheker'));

  var leng = get_mc.length;
  if(leng >= 1){
    // console.log(leng);
    var get_mc = JSON.parse(localStorage.getItem('multiCheker'));
    // console.log(temp_mc);

    $.each(get_mc,function(key,val){
      if(val.end_time <= Date.now()){

        // Set A Notification for time is OVER When time is over and notify_stat not equal sent
        if(val.notify_stat != 'sent'){
          // Added a notify
          var getTime = DB.getTimewithFormat();
          getdata = JSON.parse(localStorage.getItem('notification'));
          var get_position = localStorage.getItem('location');

          getdata.items.push(
            {
              event: val.id,
              time:getTime,
              type:'timeover',
              jobActivity: val.id,
              position: get_position,
            }
          );
          localStorage.setItem('notification',JSON.stringify(getdata));

          console.log('notify for time over is created');
          // change value notify_stat to 'sent'
          val.notify_stat = 'sent';
        }

      }
    });
    localStorage.setItem('multiCheker' , JSON.stringify(get_mc));
  }

}

setInterval(function(){
  DB.multiChekerTimer();
},5000);



DB.checkTimer = function(){

  // // console.log('No Timer Running');
  // if(JSON.parse(localStorage.getItem('checkTimer')).time_submited <= Date.now() ){
  //
  //   // Set A Notification for time is OVER
  //   // Added a notify
  //   var getTime = DB.getTimewithFormat();
  //   getdata = JSON.parse(localStorage.getItem('notification'));
  //   var get_position = localStorage.getItem('location');
  //
  //   getdata.items.push(
  //     {
  //       event: JSON.parse(localStorage.getItem('checkTimer')).schedule_running,
  //       time:getTime,
  //       type:'timeover',
  //       jobActivity: JSON.parse(localStorage.getItem('checkTimer')).schedule_running,
  //       position: get_position,
  //     }
  //   );
  //   localStorage.setItem('notification',JSON.stringify(getdata));
  //
  //   console.log('notify for time over is created');
  //   localStorage.setItem('timeover_running','OFF');
  // }else{
  //   console.log('there is nothing notificaiotn created for time over');
  // }


}


// Check the Timer nedd to be ON
setInterval(function(){
  if(localStorage.getItem('timeover_running') == 'ON'){
    DB.checkTimer();
  }
},5000);


























/*
*   Check Sync With Server
*   @param jsdo (  )
*
*   @Since 0.9.42
*/
DB.check_sync_with_server = function(){

  // get data job_done
  var data_done = JSON.parse(localStorage.getItem('jsdo_done'));
  var count_sync = data_done.items.length;
  // condition for how many job_done
  $('.sync_with_server').show('slow');
}
// DB.check_sync_with_server();


DB.sendAuto = function(){
  DB.check_sync_with_server();
}
setTimeout(function(){
  setInterval(function(){
    DB.sendAuto();
  },10000);
},10000);


/*
*   Sync With Server
*   @param jsdo (  )
*
*   @Since 0.9.42
*/
DB.sync_with_server = function(){

  var jsdo_done_sync = JSON.parse(localStorage.getItem('jsdo_done'));

  var count_jsdo = jsdo_done_sync['items'].length;



  // Change structure for server
  var newarray = [];
  for(i = 1; i < count_jsdo ; i++){
    if ( jsdo_done_sync['items'][i]['HasAdditionalInput'] != null ) {
      newarray.push(jsdo_done_sync['items'][i]);
    }else{
      jsdo_done_sync['items'][i]['HasAdditionalInput'] = '';
      newarray.push(jsdo_done_sync['items'][i]);
    }
  }

  // ready for sending wiht username
  var  which_user = localStorage.getItem('username');
  $('.show-loading').show();
  $.ajax({
    url: LDPA.RootServer+"/api/ldpa/sync_with_server/",

    data: {
      jsdo_done_readyforsync: newarray,
      which_user: which_user,
    },

    type: "POST",

    dataType: "json",
  })

  .done(function (json) {

    console.log(json);
    // $('.show-loading').hide();
    // $('#sync_with_server').hide('slow');
    // $('message-noty').show('slow');
    localStorage.setItem('jsdo_done_readyforsync', '');
    jsdo_done_default = {items: [
      {jobActivity:-1,datetime:0,HasAdditionalInput:0}
    ]};
    localStorage.setItem('jsdo_done',JSON.stringify(jsdo_done_default));

    // update all jobschedule ( jsdo_X )
    // DB.get_schedule_task();
    // $('message-noty').html('JobSchedule list updated !');
    // $('message-noty').show('slow');
    // setTimeout(function(){
    //   $('message-noty').hide('slow');
    // },2000);
    //
    // // show a message sync is completed
    // setTimeout(function(){
    //   $('message-noty').html('Sync Completed !');
    //   $('message-noty').show('slow');
    // },2500);
    //
    // setTimeout(function(){
    //   $('message-noty').hide('slow');
    // },5000);


  })

  .fail(function (xhr, status, errorThrown) {

    console.log("Error: " + errorThrown);
    console.log("Status: " + status);
    console.dir(xhr);
  });
}


setInterval(function(){
  // $('#sync_with_server').click(function(){
  // console.log('yeah clicked');
  DB.sync_with_server();
  // });
},7000);





/*
*   Function Send notification to server when its available
*
*   @since 1.3.0
*/
DB.sendNotification = function(){


  var get_data_notification = JSON.parse(localStorage.getItem('notification'));

  var get_data_notification_count = get_data_notification.items.length;
  // console.log(get_data_notification_count);
  // console.log(get_data_notification);
  which_user = localStorage.getItem('id')


  // Change structure for server
  var newarray0 = [];
  for(i = 0; i < get_data_notification_count ; i++){
    newarray0.push(get_data_notification['items'][i]);
  }

  // console.log(newarray0);
  if(get_data_notification_count >= 1){


    $.ajax({
      url: LDPA.RootServer+"/api/ldpa/send_notification/",

      data: {
        jsdo_warning: newarray0,
        which_user: which_user,
      },

      type: "POST",

      dataType: "json",
    })

    .done(function (json) {
      // console.log(json);
      localStorage.removeItem('notification');
      // localStorage.setItem('notification','');

    })
    .fail(function (xhr, status, errorThrown) {

      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
      console.dir(xhr);
    });

  }

}

setInterval(function(){
  DB.notification();
  console.log('Notification is Checked');
},10500);



/*
*   Function append with added element to page work with ID
*
*   @since 1.3.0
*/
DB.notification = function(){

  var getTime = DB.getTimewithFormat();

  var notify = {'event':'','time':'','type':'','jobActivity':'','position':''};
  notify = {items: [
    // {event:-1,time:0}
  ]};

  if(localStorage.getItem('notification') === null ){
    localStorage.setItem('notification',JSON.stringify(notify));
  }

  // getdata = JSON.parse(localStorage.getItem('notification'));
  //
  // getdata.items.push(
  //   {
  //     event:'Submit new notification from new Notification Center',
  //     time:getTime,
  //     type:'warning',
  //   }
  // );
  // localStorage.setItem('notification',JSON.stringify(getdata));

  // console.log(JSON.parse(localStorage.getItem('notification')));

  DB.sendNotification();
}
// DB.notification();










// Wait for device API libraries to load
//
document.addEventListener("deviceready", getLocationFromGPS, false);

// device APIs are available
//

function getLocationFromGPS() {
  navigator.geolocation.getCurrentPosition(onSuccess, onError);
  // var element = document.getElementById('geolocation');
  // element.innerHTML = 'hello babe i have NO error';
  // $('#geolocation').html('hello babe');
}


// onSuccess Geolocation
//
function onSuccess(position) {
  var element = document.getElementById('geolocation');
  element.innerHTML = 'hello babe i have NO error';

  // '35.6998985,51.3419222'
  var where = position.coords.latitude+','+position.coords.longitude;
  localStorage.setItem('location',where);

  // element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
  // 'Longitude: '          + position.coords.longitude             + '<br />' +
  // 'Altitude: '           + position.coords.altitude              + '<br />' +
  // 'Accuracy: '           + position.coords.accuracy              + '<br />' +
  // 'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
  // 'Heading: '            + position.coords.heading               + '<br />' +
  // 'Speed: '              + position.coords.speed                 + '<br />' +
  // 'Timestamp: '          + position.timestamp                    + '<br />';
}

// onError Callback receives a PositionError object
//
function onError(error) {
  // var element = document.getElementById('geolocation');
  // element.innerHTML = 'code:     '+ error.code  +   'message: ' + error.message;
}
