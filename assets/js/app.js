var app = angular.module('DepartureApp', ['ui.bootstrap','ngRoute']);


app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/',{
    templateUrl: '/views/home.html',
    controller: 'HomeCtrl'
  })
  .when('/flight',{
    templateUrl: '/views/dashboard.html',
    controller: 'DashboardCtrl'
  });

}]);
