var orlinsApp = angular.module('orlinsApp', ['ngRoute', 'ngMaterial'])

    .config(function($routeProvider, $locationProvider) {
		$routeProvider

			.when('/', {
				templateUrl : 'pages/home.html',
                controller: 'mainController'
			})

			.when('/task', {
				templateUrl : 'pages/task.html'
			})

		    .otherwise({
                templateUrl : 'pages/home.html',
                controller: 'mainController'
            });
        $locationProvider.html5Mode(true);
	})

    .service('Finder', function($q, $http){
        this.getAll = function() {
            var deferred = $q.defer();

            // the query string doesn't play a role right now. When done properly at the restAPI level, it's going to work fine
            $http.get('/data.json').then(function(employees){
                deferred.resolve(employees.data);
            }, function() {
                deferred.reject(arguments);
            });
            return deferred.promise;
        };
    })

    .controller('mainController', function(Finder) {
        var self = this;

        self.employees = {};
        self.querySearch   = querySearch;

        Finder.getAll().then(function(allData){
            self.employees = allData;
        });

        function querySearch (query, isFName) {
            return query ? self.employees.filter( createFilterFor(query, isFName) ) : self.employees;
        }

        function createFilterFor(query, isFirstName) {
            var lowerCaseQuery = angular.lowercase(query);

            return function filterFn(employee) {
                var lowerCaseName = angular.lowercase(isFirstName ? employee.fname : employee.lname)

                return (lowerCaseName.indexOf(lowerCaseQuery) === 0);
            };
        }
	});