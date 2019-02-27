gtaa.factory('myURL', function($http) {
	
	//To Call Global Url
	return {
	getUrl: function() {
			var url;
			return $http.get('url.txt').then(function (response) {
						url=response.data;
						return url;
					});
		}
	
	};
	
	return myURL;
	
});