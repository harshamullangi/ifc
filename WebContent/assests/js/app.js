var gtaa= angular.module("myApp",['ngRoute']);
gtaa.config(['$routeProvider',function($routeProvider, $locationProvider){
	 
     
	$routeProvider.when('/',{
		templateUrl:'html/dashboard.html',
		controller : 'dashboardCtrl'
	})
	.when('/admin',{
		templateUrl:'html/AdminConsole.html', 
		controller:'adminConsole'
	})
	.when('/operator',{
		templateUrl:'html/OperationConsole.html',
		controller:'operationConsole'
	})
	.when('/passenger_console',{
		templateUrl:'html/passenger_console.html',
		controller:'passengerConsole'
	})
	.otherwise({
		redirectTo: '/', controller:'adminConsole'
	});
}]);

gtaa.run(function($rootScope){
	$rootScope.loggedIn = location.search.split('loggedIn=')[1];
});