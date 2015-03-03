app.controller('DashboardCtrl', ['$scope','$http','$location','$routeParams','UserService', function($scope,$http,$location,$routeParams,UserService){


  if ($routeParams.airline) {
    $scope.params = $routeParams;
  }

  $scope.UserService = UserService;
  $scope.$watchCollection('UserService', function(){
    $scope.currentUser = UserService.currentUser;
  });

  var d = new Date();

  $scope.searchData = {
    airline: '', //AS DL
    flight: '', //460 37
    year: d.getFullYear().toString(),
    month: (d.getMonth()+1).toString(),
    day: d.getDate().toString()
  }

  $scope.loaded = false;

  $scope.findFlight = function() {

    $http.post('/api/allstats', $scope.searchData)
    .success(function(data){

      $location.path('/flight/'+
        $scope.searchData.airline+'/'+
        $scope.searchData.flight+'/'+
        $scope.searchData.year+'/'+
        $scope.searchData.month+'/'+
        $scope.searchData.day);

      // flight info
      $scope.flightInfo = data.flightInfo;
      $scope.statusColor = 'label label-success';
      $scope.international = (data.flightInfo.departureAirport.countryCode != data.flightInfo.arrivalAirport.countryCode) ? true : false ;
      $scope.dTime = (new Date(data.flightInfo.operationalTimes.publishedDeparture.dateLocal)).getTime();
      $scope.aTime = (new Date(data.flightInfo.operationalTimes.publishedArrival.dateLocal)).getTime();
      var currentTime = d.getTime();
      $scope.hoursTil = ($scope.dTime-currentTime)/3600000;
      $scope.takenOff = ($scope.hoursTil < 0) ? true : false ;
      $scope.duration = data.flightInfo.flightDurations.scheduledBlockMinutes/60;
      $scope.deplat = data.flightInfo.departureAirport.latitude;
      $scope.deplon = data.flightInfo.departureAirport.longitude;
      $scope.arrlat = data.flightInfo.arrivalAirport.latitude;
      $scope.arrlon = data.flightInfo.arrivalAirport.longitude;
      $scope.arrLocal = (new Date(data.flightInfo.arrivalAirport.localTime)).getTime();

      // weather data
      // departure
      $scope.depCurrent = data.forecast.dep.currently
      $scope.depTemp = Math.round(data.forecast.dep.currently.temperature);
      $scope.depDaily = data.forecast.dep.daily.data

      // arrival
      $scope.arrCurrent = data.forecast.arr.currently
      $scope.arrTemp = Math.round(data.forecast.arr.currently.temperature);
      $scope.arrDaily = data.forecast.arr.daily.data

      // foursquare
      $scope.depFoursquare = data.foursquare.dep.response.groups[0].items;
      console.log($scope.depFoursquare.length)
      $scope.arrFoursquare = data.foursquare.arr.response.groups[0].items;
      $scope.max = 10;
      $scope.isReadyonly = true;
      var currency = data.foursquare.arr.response.groups[0].items[0];

      // exchange rate
      $scope.exchange = data.exchange.rates;
      console.log($scope.exchange);
      console.log(currency);


      // load maps
      $scope.loaded=true;


    }).error(function(err){
      alert(err);
    });

  }

  if ($routeParams.airline) {
    $scope.searchData = $routeParams;
    $scope.findFlight();
  }


  $scope.showPannel = 'departure';
  $scope.togglePannel = function(pannel) {
    $scope.showPannel = pannel;
  }

}]);
