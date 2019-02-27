gtaa.controller('passengerConsole', function($scope,$http,$interval,myURL) {

	//$scope.globalURL = localStorage.getItem('gtaa_main_url');
	myURL.getUrl().then(function(d){
		$scope.globalURL = d;
		init();
	})
	
	$scope.passenger_eta= function(){
		$http({
			url:$scope.globalURL+'gtaa_ift/passenger_ETA_details',
			method:'GET',
		}).then(function successCallback(response){
			console.info(response.data.Message[0].bus_reaching_in);
			$scope.bus_reaching_in= response.data.Message[0].bus_reaching_in;
			$scope.bus_leaving_in= response.data.Message[0].bus_leaving_in;
			$scope.avg_time= response.data.Message[0].avg_time;
		});
	}
	
	$interval( function(){ $scope.passenger_eta(); }, 10000);
	var init = function(){
		$scope.passenger_eta();
	};
	
});

