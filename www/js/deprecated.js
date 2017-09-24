/**
*   Count down ( Timer )
*   we need a countdown for when time is period
*   inserted to timer_out and send to server manager
*
*   @since 0.10.33
*
*/
DB.timer_down = function(Timelimit, schedule_running){

  clearInterval(DB.timer_running);

  Timelimit0 = (Date.now() + (Timelimit * 60 * 1000));
  localStorage.setItem('time_left',0);

  localStorage.setItem('time_left',Timelimit0);
  localStorage.setItem('countdown_ON','ON');
  localStorage.setItem('schedule_running',schedule_running);

  if(localStorage.getItem('time_left') > 0 || localStorage.getItem('time_left') != 0){
    DB.timer_running = setInterval(function(){

      localStorage.setItem('countdown_ON','ON');
      localStorage.setItem('schedule_running',schedule_running);
      localStorage.setItem('time_left',localStorage.getItem('time_left') - 1000);
      DB.timer();

    },1000);
  }else {
    clearInterval(DB.timer_running);
    localStorage.setItem('time_left',0);
    localStorage.setItem('countdown_ON','OFF');

  }
}

if(localStorage.getItem('countdown_ON') == 'ON'){
  if( localStorage.getItem('time_left') != 0){
    DB.timer_running = setInterval(function(){

      localStorage.setItem('countdown_ON','ON');
      localStorage.setItem('time_left',localStorage.getItem('time_left') - 1000);
      DB.timer();

    },1000);
  }
}

/**
*   this is check timer is out if yeah set a sending Queue to server
*
*   @since 0.10.33
*
*/
DB.timer = function(){

  var timer_structure = {'id':'','id_user':''};
  timer_structure = {items: [
    {jobActivityid:-1,id_user:0}
  ]};

  if(localStorage.getItem('timer_out') === null ){
    localStorage.setItem('timer_out',JSON.stringify(timer_structure));
  }
  var countdown_ON = localStorage.getItem('countdown_ON');
  var countdown = localStorage.getItem('time_left');
  var schedule_running = localStorage.getItem('schedule_running');

  console.log(countdown);
  console.log(JSON.parse(localStorage.getItem('timer_out')));
  if(countdown < 1 ){
    if ( countdown_ON == 'ON' ){
      old_timer_data = JSON.parse(localStorage.getItem('timer_out'));

      old_timer_data.items.push({
        jobActivityid:schedule_running,
        id_user:localStorage.getItem('id'),
      });
      localStorage.setItem('timer_out',JSON.stringify(old_timer_data));
      clearInterval(DB.timer_running);
    }
  }
}




DB.send_warning_time_over = function(){

  var timer_structure = {'id':'','id_user':''};
  timer_structure = {items: [
    {jobActivityid:-1,id_user:0}
  ]};

  if(localStorage.getItem('timer_out') === null ){
    localStorage.setItem('timer_out',JSON.stringify(timer_structure));
  }

  var get_data_warining = JSON.parse(localStorage.getItem('timer_out'));

  var get_data_warining_count = get_data_warining.items.length;
  // console.log(get_data_warining_count);
  // console.log(get_data_warining);
  which_user = localStorage.getItem('id')


  // Change structure for server
  var newarray0 = [];
  for(i = 1; i < get_data_warining_count ; i++){
    newarray0.push(get_data_warining['items'][i]);
  }

  if(get_data_warining_count > 1){


    $.ajax({
      url: "http://00p.ir/ldpa/api/ldpa/send_warning_time_over/",

      data: {
        jsdo_warning: newarray0,
        which_user: which_user,
      },

      type: "POST",

      dataType: "json",
    })

    .done(function (json) {
      // console.log(json);
      localStorage.setItem('timer_out','');
      var timer_structure = {'id':'','id_user':''};
      timer_structure = {items: [
        {jobActivityid:-1,id_user:0}
      ]};

      if(localStorage.getItem('timer_out') == '' ){
        localStorage.setItem('timer_out',JSON.stringify(timer_structure));
      }
    })
    .fail(function (xhr, status, errorThrown) {

      console.log("Error: " + errorThrown);
      console.log("Status: " + status);
      console.dir(xhr);
    });

  }
}
DB.send_warning_time_over();








DB.list_schedule = function(){


  var jobschedule_local = JSON.parse(localStorage.getItem('jobschedule_local'));
  // count how many item in jobschedule_local
  var count = Object.keys(jobschedule_local).length - 1;


  //  Make an array for sort by JobscheduleID
  var ar = []
  for(var j = 0; j < count; j++) {
    ar.push(jobschedule_local[j]);
    console.log(jobschedule_local[j].OrderDateTime);
    console.log(new Date(jobschedule_local[j].OrderDateTime).getTime());

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

  console.log(ar);

  jobschedule_local = ar;

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


    $('.job-schedule-list-show-here').after(
      '<li class="'+jobtype_color+'" onClick=DB.gotodo('+jobschedule_local[i].JobscheduleID+') item='+[i].JobscheduleID+'>' +
      '<div class="id-schedule"><i class="fa fa-key"></i> JS_ID: ' +
      jobschedule_local[i].JobscheduleID +'</div>'+
      '<div class="id-joborder"><i class="fa fa-key"></i> JO_ID: '+jobschedule_local[i].JoborderID+'</div>'+
      '<div class="vesselname-schedule"><i class="fa fa-ship"></i> '+jobschedule_local[i].VesselName +'</div>'+
      '<div class="type-schedule"><i class="fa fa-check"></i> JobType:  '+jobschedule_local[i].jobtypename + '</div>'+
      '<div class="OrderDateTime-schedule"><i class="fa fa-calendar"></i> ' + jobschedule_local[i].OrderDateTime + '</div>'+
      '<div class="report-btn">'+'<button class="report-go-page"  id="report-'+jobschedule_local[i].JobscheduleID+'"> Report </button>'+'</div>'+
      '</li></a>');
    }

  }


  // Set a item in localstorage for when click on item goto page job
  DB.gotodo = function(x) {
    localStorage.setItem('doschedule' ,x);
    window.location.assign('job-schedule-do.html');
  }


  // show new data is available
  $('message').click(function() {
    console.log('hello message');
    // Ask question
    // var update = confirm("Do you want to update list ?");
    var update = true;
    if (update == true) {

      // Set New Data
      localStorage.setItem('jobschedule_local',localStorage.getItem('jobschedule_new'));
      localStorage.setItem('updated-schdeule-list',1);


      DB.get_schedule_task();

      // Reload Page and show new date
      window.location.replace('#!/jobschedule');
      window.location.reload();

    } else {
      return;
    }
  });






  setTimeout(function(){
    // close lightbox-edit when click on Close
    $('.close').click(function(){

      $('.inputAdditionalInput').val('');
      $('.inputdatetime').val('');
      $('lightbox-edit').fadeOut(100);
    });
  },1000);




  setTimeout(function(){
    $('.submit').click(function(){

      console.log('hello submit');
      // check is set in jsdo_done_readyforsync or ney with (JobactivityID and jobActivity)
      var get_data_jsdo_done = JSON.parse(localStorage.getItem('jsdo_done'));
      get_data_jsdo_done_count = get_data_jsdo_done.items.length;

      //  which id request edit
      var getid = $('lightbox-edit').attr('attr-id');


      // DB.notification();
      // Added a notify
      var getTime = DB.getTimewithFormat();
      getdata = JSON.parse(localStorage.getItem('notification'));
      var get_position = localStorage.getItem('location');
      getdata.items.push(
        {
          event: getid,
          time:getTime,
          type:'edited',
          jobActivity: getid,
          position: get_position,
        }
      );
      localStorage.setItem('notification',JSON.stringify(getdata));
      console.log('submited');

      // console.log(get_data_jsdo_done);
      var which_structure_submit = 1;
      for(d = 0; d < get_data_jsdo_done_count;d++){
        if(getid ==  get_data_jsdo_done.items[d].jobActivity){

          which_structure_submit = 0;
          console.log('yeah we are here!');
          break;
        }
      }

      if(which_structure_submit == 0){

        // set format date time

        // Setting new data into jsdo_done_readyforsync After Edited
        // Get Data from database
        var getalldata = JSON.parse(localStorage.getItem('jsdo_done'));
        getalldata_count = getalldata.items.length;

        // set data into database
        for(e = 0; e < getalldata_count;e++){
          if(getid ==  getalldata.items[e].jobActivity){

            // set format date time
            changetimeformat = $('.inputdatetime').val();
            if(changetimeformat != ''){

              chtime = changetimeformat.split('T');
              chtime_count = chtime.length;
              var correcttimeformat;
              correcttimeformat = chtime.join(' ');
              correcttimeformat = correcttimeformat+':00';

              getalldata.items[e].datetime = correcttimeformat;
            }
            getalldata.items[e].HasAdditionalInput = $('.inputAdditionalInput').val();
            localStorage.setItem('jsdo_done',JSON.stringify(getalldata));
          }
        }
        // Reload window
        window.location.replace('job-schedule-do.html');
      } // end which_structure_submit 0
      else if ( which_structure_submit == 1 ){


        // set format date time
        changetimeformat = $('.inputdatetime').val();
        if(changetimeformat != ''){

          chtime = changetimeformat.split('T');
          chtime_count = chtime.length;
          var correcttimeformat;
          correcttimeformat = chtime.join(' ');
          correcttimeformat = correcttimeformat;

        }else{
          correcttimeformat = '';
        }

        var HasAdditionalInput = $('.inputAdditionalInput').val();

        // set for jsdo_done
        DATA = JSON.parse(localStorage.getItem('jsdo_done'));
        DATA.items.push({jobActivity:getid,datetime:correcttimeformat,HasAdditionalInput:HasAdditionalInput});
        localStorage.setItem('jsdo_done',JSON.stringify(DATA));

        // Reload Window
        // window.location.replace('#!/jobschedule-do');
        window.location.reload();

      }

    });
  });



  /**
  *   Edit button for JobSchedule ( Task )
  *   Open lightbox-edit When Click on edit-btn bottom
  *
  *   @since 0.10.33
  */
  DB.btnedit = function(id){
    $('lightbox-edit').attr('attr-id' , id);
    $('lightbox-edit .ActivityID').html(id);

    // check is set in jsdo_done_readyforsync or ney with (JobactivityID and jobActivity)
    var get_data_jsdo_done = JSON.parse(localStorage.getItem('jsdo_done'));
    get_data_jsdo_done_count = get_data_jsdo_done.items.length;

    //  which id request edit
    var getid = $('lightbox-edit').attr('attr-id');


    // console.log(get_data_jsdo_done);
    var which_structure = 1;
    for(d = 0; d < get_data_jsdo_done_count;d++){
      if(getid ==  get_data_jsdo_done.items[d].jobActivity){

        which_structure = 0;
        break;
      }
    }

    if(which_structure == 0){

      console.log(getid);

      // get data from ready for sync
      for(b = 0; b < get_data_jsdo_done_count;b++){
        if(id ==  get_data_jsdo_done.items[b].jobActivity){
          // Make a format datetime for show in input
          var temp_date = get_data_jsdo_done.items[b].datetime;
          console.log(temp_date);
          var temp_date_split = temp_date.split(' ');
          $('.inputdatetime').val(temp_date_split.join('T'));

          // show last inputAdditionalInput
          $('.inputAdditionalInput').val(get_data_jsdo_done.items[b].HasAdditionalInput);
        }
      }
    }
    else if (which_structure == 1) {

      var item_running0 = JSON.parse(localStorage.getItem('doschedule'));
      jsdo  = 'jsdo_'+item_running0;

      var item_running = JSON.parse(localStorage.getItem(jsdo));
      item_running_count = Object.keys(item_running).length - 1 ;

      // Get Data from database (Queue Ready to send)
      var getalldata = JSON.parse(localStorage.getItem(jsdo));

      getalldata_count = Object.keys(getalldata).length - 1;

      for(a = 0; a < getalldata_count;a++){
        if(id ==  getalldata[a].JobactivityID){
          // Make a format datetime for show in input
          var temp_date = getalldata[a].EndDateTime;
          console.log(temp_date);
          var temp_date_split = temp_date.split(' ');
          $('.inputdatetime').val(temp_date_split.join('T'));

          // show last inputAdditionalInput
          $('.inputAdditionalInput').val(getalldata[a].Value);
        }
      }

    }
    console.log(which_structure);




    // Show the lightbox-edit
    $('lightbox-edit').css('display','block');






    // sync with server if server is available
    // DB.check_sync_with_server();

  }








  DB.countdown = function(timelimit,schedule_running){

    // set Time limit
    var end_time = (Date.now() + (timelimit * 60 * 1000));
    localStorage.setItem('end_time',end_time);
    localStorage.setItem('countdown_ON','ON');


    DB.countdown_timer();

  }

  /**
  *   Count down Timer ( New Generation )
  *   we need a countdown for when time is period
  *   inserted to timer_out and send to server manager
  *
  *   @since 1.5.77
  *
  */
  DB.countdown_timer = function(){

    // Check elapsed time if done close interval
    if(localStorage.getItem('end_time') <= Date.now() && localStorage.getItem('countdown_ON') == 'OFF' ){
      localStorage.setItem('countdown_ON','OFF');
      clearInterval(timeinterval_countdown);
    }else {
      var timeinterval_countdown = setInterval(function(){
        var start_time = Date.now();
        var elapsed = localStorage.getItem('end_time') - start_time;
        localStorage.setItem('countdown_ON','ON');
        // console.log(elapsed);

        // Check elapsed time if done close interval
        if(localStorage.getItem('end_time') === null){
          // console.log('Timer is Running');
        }else{
          // console.log('No Timer Running');
          if(localStorage.getItem('end_time') <= Date.now() ){

            // Set A Notification for time is OVER
            // DB.notification();
            // Added a notify
            var getTime = DB.getTimewithFormat();
            getdata = JSON.parse(localStorage.getItem('notification'));
            var get_position = localStorage.getItem('location');

            getdata.items.push(
              {
                event:localStorage.getItem('schedule_running'),
                time:getTime,
                type:'timeover',
                jobActivity: localStorage.getItem('schedule_running'),
                position: get_position,
              }
            );
            localStorage.setItem('notification',JSON.stringify(getdata));

            // sync with server if server is available
            // DB.check_sync_with_server();


            localStorage.setItem('countdown_ON','OFF');
            clearInterval(timeinterval_countdown);
          }
        }},50000);
      }
    }

    DB.countdown_timer();
