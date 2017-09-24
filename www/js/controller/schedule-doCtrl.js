ldpaApp.controller('scheduleDoCtrl',function($scope){



  /**
  *   Edit button for JobSchedule ( Task )
  *   Open lightbox-edit When Click on edit-btn bottom
  *
  *   @since 0.10.33
  */
  $scope.btnedit = function(id){
    $('lightbox-edit').attr('attr-id' , id);
    $('lightbox-edit .ActivityID').html(id);

    // check is set in jsdo_done_readyforsync or ney with (JobactivityID and jobActivity)
    var get_data_jsdo_done = JSON.parse(localStorage.getItem('jsdo_done'));
    get_data_jsdo_done_count = get_data_jsdo_done.items.length;

    //  which id request edit
    var getid = $('lightbox-edit').attr('attr-id');


    // console.log(get_data_jsdo_done);
    var which_structure = 0;
    for(d = 0; d < get_data_jsdo_done_count;d++){
      if(getid ==  get_data_jsdo_done.items[d].jobActivity){

        which_structure = 0;
        break;
      }
    }

    console.log($('#task_'+id+'').find('span:nth-child(2)').find('.done_status').html());



    if(which_structure == 0){

      console.log(getid);

      // get data from ready for sync
      for(b = 0; b < get_data_jsdo_done_count;b++){
        if(id ==  get_data_jsdo_done.items[b].jobActivity){
          // Make a format datetime for show in input
          var temp_date = get_data_jsdo_done.items[b].datetime;
          // console.log(temp_date);
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
    $('lightbox-edit').fadeIn(100);



    var temp_date = $('#task_'+id+'').find('span:nth-child(2)').find('.done_status').html();
    // temp_date.trim();
    console.log(temp_date);
    var temp_date_split = temp_date.split(' ');
    console.log(temp_date_split);
    temp_date_split.splice(2);
    console.log(temp_date_split);
    console.log(temp_date_split.join('T'));
    $('.inputdatetime').val(temp_date_split.join('T'));

    // $('.inputdatetime').val($('#task_'+id+'').find('span:nth-child(2)').find('.done_status').html());

    var additional_now = $('#task_'+id+'').find('.additional').html();

    $('.inputAdditionalInput').val(additional_now);

    // sync with server if server is available
    // DB.check_sync_with_server();

  }




  // close lightbox-edit when click on Close
  $scope.close = function(){

    $('.inputAdditionalInput').val('');
    $('.inputdatetime').val('');
    $('lightbox-edit').fadeOut(100);
  }



  // Submit Edit when click on Submit Button
  $scope.submit = function(){

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
            // correcttimeformat = correcttimeformat+':00';
            timeis = correcttimeformat;

            getalldata.items[e].datetime = correcttimeformat;
          }
          getalldata.items[e].HasAdditionalInput = $('.inputAdditionalInput').val();
          localStorage.setItem('jsdo_done',JSON.stringify(getalldata));
        }
      }
      // Reload window
      // window.location.replace('job-schedule-do.html');
    } // end which_structure_submit 0
    else if ( which_structure_submit == 1 ){


      var timeis;
      // set format date time
      changetimeformat = $('.inputdatetime').val();
      if(changetimeformat != ''){

        chtime = changetimeformat.split('T');
        chtime_count = chtime.length;
        var correcttimeformat;
        correcttimeformat = chtime.join(' ');
        // correcttimeformat = correcttimeformat+':00';

        timeis = correcttimeformat;
      }


      // show in corrent session
      $('#jobActivityID_'+getid+'').html(timeis);
      $('#additional_'+getid+'').html($('.inputAdditionalInput').val());

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
      // window.location.reload();

    }

    DB.sync_with_server();


    $('lightbox-edit').fadeOut('100');



  }




});
// end controller
