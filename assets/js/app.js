var app = angular.module('DepartureApp', ['ui.bootstrap','ngRoute','uiGmapgoogle-maps']);


app.config(['$routeProvider','$locationProvider','uiGmapGoogleMapApiProvider', function($routeProvider,$locationProvider,uiGmapGoogleMapApiProvider) {

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

  uiGmapGoogleMapApiProvider.configure({
    key: 'AIzaSyAPjSUsygElmxbO4KnA9f1-ECQ2kGpf2jM',
    v: '3.17',
    libraries: 'weather,geometry,visualization'
  });

}]);
