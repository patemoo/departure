app.controller('DashboardCtrl', ['$scope','$http', function($scope,$http){ //,'uiGmapGoogleMapApi'


  var d = new Date();

  $scope.searchData = {
    airline: 'DL', //AS DL
    flight: '37', //460 37
    year: d.getFullYear(),
    month: (d.getMonth()+1),
    day: d.getDate()
  }


  $scope.loaded=false;

  $scope.findFlight = function() {

    $http.post('/api/allstats', $scope.searchData)
    .success(function(data){


      // flight info
      $scope.flightInfo = data.flightInfo;
      $scope.statusColor = 'label label-success';
      $scope.international = (data.flightInfo.departureAirport.countryCode != data.flightInfo.arrivalAirport.countryCode) ? true : false ;
      //$scope.countTime =
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

      // weather data
      // departure
      $scope.depCurrent = data.forecast.dep.currently
      $scope.depTemp = Math.round(data.forecast.dep.currently.temperature);
      $scope.depDaily = data.forecast.dep.daily.data

      // arrival
      $scope.arrCurrent = data.forecast.arr.currently
      $scope.arrTemp = Math.round(data.forecast.arr.currently.temperature);
      $scope.arrDaily = data.forecast.arr.daily.data

      // exchange rate
      $scope.exchange = data.exchange;

      // foursquare
      $scope.depFoursquare = data.foursquare.dep.response.groups[0].items;
      console.log($scope.depFoursquare.length)
      $scope.arrFoursquare = data.foursquare.arr.response.groups[0].items;
      $scope.max = 10;
      $scope.isReadyonly = true;


      // load maps
      $scope.loaded=true;


    }).error(function(err){
      alert(err);
    });

  }


  $scope.showPannel = 'departure';
  $scope.togglePannel = function(pannel) {
    $scope.showPannel = pannel;
  }

}]);
