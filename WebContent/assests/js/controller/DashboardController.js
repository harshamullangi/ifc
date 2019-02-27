gtaa.controller('dashboardCtrl',function($scope,$http,$interval,$rootScope,myURL){

	myURL.getUrl().then(function(d){
		$scope.globalURL = d;
		
		//$scope.operation_ETA_details();
		$scope.alert_list();
		$scope.count();
		$scope.chart_alert();
		$scope.dash_alert_count();
		$scope.dash_vehicle_details();
		//$scope.get_lastweek_trip_count();
		//$scope.DashTrip_Alert();
	});
	$interval( function(){ $scope.alert_list(); }, 1000);

	
	$scope.overall_Alert= function(){
		
		var x_axis=[];$scope.overall_Alert
		var y_axis=[];
		
		$http({
			url:$scope.globalURL+'gtaa_ift/operation_alert_count_details',
			method:'GET',
		}).then(function successCallback(response){
			angular.forEach(response.data[0].Message,function(value,key){
					x_axis.push(key);
					y_axis.push(value);
			});
			Highcharts.chart('vehicle1', {
	        chart: {
	            type: 'Chart.update',
	            backgroundColor: 'rgba(255, 255, 255, 0.0)',
	        },
	        title: {
	            text: '',
	            style:{
	            	display:"none"
	            }
	        },
	        subtitle: {
	            text: ''
	        },
	        credits: {
	            enabled: false
	        },
	        exporting: { enabled: false },
	        xAxis: {
	            categories:x_axis,
	                labels: {

	                    style: {
	                        color: '#002663'
	                    }
	                }
	        },
	        yAxis: {
	            title: {
	                text: '',
	            },
	           
	        },
	        tooltip: {
	            crosshairs: true,
	            shared: true,
	            visible: true,
	            pointFormat: "{series.name}: <b>{point.y:.0f}</b><br/>",
	            style: {
	                fontSize:'11px',
	            }
	        },
	        plotOptions: {
	        	column: {
	        		stacking: 'percent',
	               
	            }
	        },
	        series: [{
	            type: 'column',
	            colorByPoint: true,
	            data: y_axis,
	            showInLegend: false
	        }]
	    });
		})
		
	
	}
	
	
//&&&&&&&&&&&&&&&&&&&&&&&&&&&
	$scope.charts= function(temparray){

		Highcharts.chart('vehicle1', {
        chart: {
            type: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0.0)',
        },
        title: {
            text: '',
            style:{
            	display:"none"
            }
        },
        subtitle: {
            text: ''
        },
        credits: {
            enabled: false
        },
        exporting: { enabled: false },
        xAxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                labels: {

                    style: {
                        color: '#002663'
                    }
                }
        },
        yAxis: {
            title: {
                text: '',
            },
            /*labels: {
                formatter: function () {
                    return this.value;
                },
                style: {
                    color: '#002663'
                }
            },
            color: '#002663',*/
        	 /* stackLabels: {
                  enabled: true,
                  style: {
                      fontWeight: 'bold',
                      color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                  }
              }*/
        },
        tooltip: {
            crosshairs: true,
            shared: true,
            visible: true,
            pointFormat: "{series.name}: <b>{point.y:.0f}</b><br/>",
            style: {
                fontSize:'11px',
            }
        },
        plotOptions: {
        	column: {
        		stacking: 'percent',
                /*marker: {
                    radius: 4,
                    lineColor: '#111',
                    lineWidth: 1,
                    enable: false,
                },*/
                
                /*dataLabels: {
                    enabled: true
                },*/
            }
        },
        series: [{
        	name:'Bus1',
        	data:[730,730,220,400,340,506,760,705,230,650,1230,420]
        },
        {
        	name:'Bus2',
        	data:[640,453,202,430,340,560,620,905,203,650,231,502]
        },{
        	name:'Bus3',
        	data:[800,733,520,240,544,668,965,600,836,750,230,420]
        }]
    });
	}
	var alert_val;
	//Alert List
	$scope.alert_list= function(){
		$http({
			url:$scope.globalURL+'gtaa_ift/dashboard_alert_details',
			method:'GET',
		}).then(function successCallback(response){
			$('.dash_alerts_summ .bshsah div').remove();
			if(response.data.Message.length == 0){
				var div='<div class="alert_val">';
				div+='<span class="alert_span col-md-12"><p class="pull-left">No Alert Found </p>';
				div+='<p class="pull-right"></p></span>';
				div+='<p class="p-content col-md-12"> &nbsp; </p>'; 
				div+='</div>';
				
				$('.dash_alerts_summ .bshsah').append(div);
			}else{
				
			angular.forEach(response.data.Message,function(value,key){
								
				var div='<div class="alert_val">';
				div+='<span class="alert_span col-md-12"><p class="pull-left">Alert Type : '+ value.alert_type+'</p>';
				div+='<p class="pull-right">'+value.alert_time+'</p></span>';
				div+='<p class="p-content col-md-12">Vehicle No : <b>'+value.vehicle_number+'</b>, &nbsp; '+value.discription+'</p>'; 
				div+='</div>';
				
				$('.dash_alerts_summ .bshsah').append(div);
			});
			console.info(response.data.Message[0]);
			
			localStorage.setItem("alert_id", response.data.Message[0].alert_id);
			//Service Now
			
			if(response.data.Message[0].alert_id != localStorage.getItem("alert_val")){
				console.info('New Alert');
				
				$scope.serviceNow(response.data.Message[0].alert_id,response.data.Message[0].alert_time,response.data.Message[0].vehicle_number,response.data.Message[0].severity,response.data.Message[0].alert_type,response.data.Message[0].discription);
			}
			else{
				console.info('NO New Alert')
			}
			alert_val= localStorage.getItem("alert_id");
			localStorage.setItem("alert_val", response.data.Message[0].alert_id);
		}
		
		});
		
		
	}
	
	//Service Now
	$scope.serviceNow = function(alert_id,alert_time,vehicle_number,severity,alert_type,description){
		
		var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth() + 1; //January is 0!
		var yyyy = today.getFullYear();

		if (dd < 10) {
		  dd = '0' + dd;
		}

		if (mm < 10) {
		  mm = '0' + mm;
		}

		today = yyyy+'-'+ mm + '-'+ dd;
		console.info(today+' '+alert_time);
		
		
		Date.prototype.addHours= function(h){
		    this.setHours(this.getHours()+h);
		    return this;
		}
		
		var d=new Date().addHours(8);
		
		var dd = d.getDate();
		var mm = d.getMonth() + 1; //January is 0!
		var yyyy = d.getFullYear();

		if (dd < 10) {
		  dd = '0' + dd;
		}

		if (mm < 10) {
		  mm = '0' + mm;
		}

		d1 = yyyy+'-'+ mm + '-'+ dd+' '+d.getHours()+':'+d.getMinutes()+':'+00;
		
		console.info(d1);
		$http({
			method : 'POST',
			url : 'https://wiprodemo12.service-now.com/api/270161/wipro_iot_integration',
			headers: {
		        'Content-Type':'application/json', 
		                'Authorization': 'Basic SU9UX2ludGVncmF0aW9uOjEyMzQ=',
		                //'Access-Control-Allow-Origin': '*'
		    },
			data : {
				"customer":"GTAA_BUS_ETA",
				"alert_occurance_time":d1,//+' '+alert_time,
				"alert_level":severity,
				"device_id":vehicle_number,
				"device_name":"bus",
				"device_category":"MDG",
				"device_subcategory":"Motorola",
				"device_item":"bnh",
				"device_ip":"N/A",
				"location":"GTAA_IFC",
				"device_lat":"N/A",
				"device_long":"N/A",
				"device_owner_name":"GTAA_ETA_Support",
				"device_owner_phone":"9886771983",
				"device_owner_email":"vipul.anand@wipro.com",
				"alert_description":description,
				"alert_trigger":"N/A",
				"alert_impact":alert_type,
				"alert_id":alert_id 
			},
			
		})
		.then(function successCallback(response) {
			console.info('Mullangi');
			console.info(response);
				},
				function errorCallback(response) {
				
				});
	}
	
	$scope.count= function(){
		$http({
			url:$scope.globalURL+'gtaa_ift/dashboard_count_details',
			method:'GET',
		}).then(function successCallback(response){
			var main_count=0;
			for(i=0;i<(response.data.Message.length-1);i++){
				var bus_details='<div class="dash_trip_status"><span class="first_bus_count">'+response.data.Message[i].count+'</span class="first_bus_name"><br> <span>'+response.data.Message[i].vehicle_name+'</span></div>';
				$('.total_values_dmain_count').after(bus_details);
				main_count+=response.data.Message[i].count;
			}
			
			$scope.total_count_bus=main_count;
			var total_count_bus=main_count;
			var total_assigned_count= parseInt(response.data.Message.length)-1;
			if(parseInt(response.data.Message[total_assigned_count].split(':')[1]) < 10){
				var count_value='0'+parseInt(response.data.Message[total_assigned_count].split(':')[1]);
			}else{
				var count_value=parseInt(response.data.Message[total_assigned_count].split(':')[1]);
			}
			/*$('.first_bus_count').html($scope.bus1);
			$('.second_bus_count').html($scope.bus2);*/
			$('.total_bus_count').html(total_count_bus);
			$('.dash_fleet_count_span_1').html(count_value)
			
			//$('.first_bus_name span').html('BUS1');
			//$('.second_bus_name span').html('BUS2');
			
		})
	}
	
	$scope.chart_alert = function(){
		$scope.AverageCount = "Average Trip per Day";
		$scope.LastTrp="Last Week Trip Count";
		$scope.LastWeek="Last Month Trip Count";
		$scope.TrpCount="Trip Count";
		//To display Sample data
		$scope.charts('xyz');
		
		$http({
			url:$scope.globalURL+'gtaa_ift/dashboard_chart_details',
			method:'GET',
		}).then(function successCallback(response){
			
			var temparray=[];
			console.info(response.data.Message.length);
			for(i=0; i<(response.data.Message.length);i++){
				var tempData={};
				var new_array=[];
				var array_color=['#F44336','#00897b','#b3b3b3']
				angular.forEach(response.data.Message[i].data,function(value,key){
					if(key !=0)
					new_array.push(value);
				});
				tempData['name']=response.data.Message[i].vehicle_name;
				tempData['data']=new_array;
				tempData['color']=array_color[i];
				//tempData['showInLegend']=false;
				temparray.push(tempData);
			}
			//$scope.charts(temparray);
			
			var total_count=0;
			var last_month=0;
			var d = new Date();
		    var n = d.getMonth();
		    
			angular.forEach(temparray,function(value,key){
				var count=0;
				for(i=0; i<12;i++){
					count+=parseInt(value.data[i]);
					if(i==(n-1))
						last_month+=parseInt(value.data[i]);
				}
				total_count+=count;
				var span='<span class="dash_bus_1">'+value.name+'<br> <div>'+count+'</div></span> <hr>';
				$('.dash_graph_1').append(span);
			});
			
			$scope.last_month=last_month;
			$scope.total_count_trips=total_count;
			
		})
		
		$scope.get_lastweek_trip_count();
		$scope.get_trip_count_today_previousday();
		
	/*	$scope.txtname="OverAllTrip";
		$scope.Trip_txt(txtname);*/
	}
	
	$scope.dash_alert_count= function(){
        $http({
               url:$scope.globalURL+'gtaa_ift/operation_alert_count_details',
               method:'GET',
        }).then(function successCallback(response){
                     $scope.stoppage=response.data[0].Message.stoppage;
                     
                     $scope.device_alert=response.data[0].Message.device_alert;
               
                     $scope.halt=response.data[0].Message.halt;
               
                     $scope.geofence_violation=response.data[0].Message.geofence_deviation;
               
                     $scope.route_violation=response.data[0].Message.route_deviation;
               
                     $scope.total_count= parseInt($scope.stoppage)+parseInt($scope.geofence_deviation)+parseInt($scope.route_deviation)+parseInt($scope.halt);
        })
 }

	//vehicle_details
	
	$scope.dash_vehicle_details= function(){
		$scope.buses=[];
        $http({
               url:$scope.globalURL+'gtaa_ift/display_vehicle_details',
               method:'GET',
        }).then(function successCallback(response){
               for(i=0; i<response.data.Message.length; i++){
            	   if(response.data.Message[i].delete_flag == false){
            		   $scope.buses.push(response.data.Message[i]);
            		   
            	   }
               }
               
               if($scope.buses.length < 10)
            	   $scope.busCount='0'+$scope.buses.length;
               else
            	   $scope.busCount=$scope.buses.length;
        })
 }
	
	$scope.get_lastweek_trip_count = function(){
		$http({
            url:$scope.globalURL+'gtaa_ift/get_lastweek_trip_count',
            method:'GET',
     }).then(function successCallback(response){
    	 	console.info(response);
    	 	$scope.last_week_trip_count= response.data.Message[0].last_week_trip_count;
    	 	$scope.average_trip_count= response.data.Message[0].average_trip_count;
     });
	}
	
	$scope.get_trip_count_today_previousday = function(){
		$http({
            url:$scope.globalURL+'gtaa_ift/get_trip_count_today_previousday',
            method:'GET',
     }).then(function successCallback(response){
    	 	console.info(response);
    	 	$scope.current_day_trip_count= response.data.Message[0].current_day_trip_count;
    	 	$scope.previous_day_trip_count= response.data.Message[0].previous_day_trip_count;
     });
	}
	
	
	/*

	$scope.Trip_txt=function()
	{
		if(txtname=="TripStatus")
		{
			bootbox.alert('TripStatus');
			$scope.AverageCount = "Average Trip per Day";
			$scope.LastTrp="Today Trip Count";
			$scope.LastWeek="Previous Day Trip Count";
			$scope.TrpCount="Trip Count";
		}
		if(txtname=="OverAllTrip");
		{
			bootbox.alert('OverAllTrip');
			$scope.AverageCount = "Average Trip per Day";
			$scope.LastTrp="Last Week Trip Count";
			$scope.LastWeek="Last Month Trip Count";
			$scope.TrpCount="Trip Count";
		}
		
	}*/
	
	
	//Notification
	/*$scope.notification_m = function(tempRouteId){
		$('.notification_details').toggle();
		var route="<div>Do you want to observe this route</div>"
		
			var confirm='<div class="observer_tempRoute"><div class="form-group"><label for="usr">Select Day Wise:</label><select><option>5</option><option>6</option><option>7</option></select></div>';
		confirm+='<p>OR</p>';	
		confirm+='<div class="form-group"><label for="usr">Select Trip Wise:</label><select><option>10</option><option>20</option><option>30</option></select></div></div>';
		bootbox.confirm({
		    title: "New Route Notifications :- "+tempRouteId,
		    message: route,
		    buttons: {
		        cancel: {
		            label: '<i class="fa fa-check"></i> Create'
		        },
		        confirm: {
		            label: '<i class="fa fa-search"></i> Observe'
		        }
		    },
		    callback: function (result) {
		    	if(result == true){
		    		bootbox.confirm({
		    		    title: "New Route Observation :- "+tempRouteId,
		    		    message: confirm,
		    		    buttons: {
		    		        cancel: {
		    		            label: '<i class="fa fa-times"></i> Cancel'
		    		        },
		    		        confirm: {
		    		            label: '<i class="fa fa-check"></i> Yes'
		    		        }
		    		    },
		    		    callback: function (result) {
		    		        console.log('This was logged in the callback: ' + result);
		    		    }
		    		});
		    	}
		    	else if(result == false){
		    		bootbox.alert("Successfully Created Temp Route :- "+tempRouteId );
		    	}
		        console.log('This was logged in the callback: ' + result);
		    }
		});
		
	}*/
	/*function get_config(){
		$('#myFrame').remove();
		$.ajax({
			url : globalURL + 'gtaa/get_configuration ',
			method : 'GET',
			dataType : 'JSON',
			async : true,
			success : function(data) {
				if(data.Message[0].x === 1){
					$('#out-eye').css('display','block');
		    		
					$('#login_background_dashboard_main div,.login_background_dashboard_main div').css('display','none');
				
					$('#login_background_dashboard_main').html('<iframe src="maintenance.html" frameborder="0" scrolling="no" id="myFrame" style="width:100%; height:100vh;"></iframe>');
				 
					//$('.gtaa_navbar_right li:nth-child(5) a').attr('onclick','return false');
					$('.gtaa_navbar_right li:nth-child(5) a, .gtaa_navbar_right li:nth-child(1) a, .gtaa_navbar_right li:nth-child(2) a, .gtaa_navbar_right li:nth-child(3) a, .gtaa_navbar_right li:nth-child(4) a').attr('onclick','return false');
					
				}
				else{
					$scope.operation_ETA_details();
					$scope.alert_list();
					$scope.count();
					$scope.chart_alert();
				}
			}
		});
	}*/
	
});

gtaa.run(function ($rootScope, $interval) {

        $rootScope.AssignedDate = Date;
        $interval(function () {

        },1000)

    });
