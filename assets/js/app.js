var app = angular.module('DepartureApp', ['ui.bootstrap','ngRoute']);


app.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider) {

  $locationProvider.html5Mode(true);

  $routeProvider
  .when('/',{
    templateUrl: '/views/home.html',
    controller: 'HomeCtrl'
  })
  .when('/dashboard',{
    templateUrl: '/views/dashboard.html',
    controller: 'DashboardCtrl'
  })
  .when('/dashboard/flight/:id',{
    templateUrl: '/views/dashboard.html',
    controller: 'DashboardCtrl'
  })
  .when('/dashboard/:carrier/:flight/:year/:month/:day',{
    templateUrl: '/views/dashboard.html',
    controller: 'DashboardCtrl'
  });

}]);
