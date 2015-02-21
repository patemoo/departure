app.controller('DashboardCtrl', ['$scope','$http', function($scope,$http){ //,'uiGmapGoogleMapApi'


  var d = new Date();

  $scope.searchData = {
    airline: 'AS',
    flight: '460',
    year: d.getFullYear(),
    month: (d.getMonth()+1),
    day: d.getDate()+1
  }


  $scope.loaded=false;

  $scope.findFlight = function() {

    $http.post('/api/allstats', $scope.searchData)
    .success(function(data){

      $scope.loaded=true;

      // flight info
      $scope.flightInfo = data.flightInfo;
      $scope.statusColor = 'label label-success';
      $scope.international = (data.flightInfo.departureAirport.countryCode != data.flightInfo.arrivalAirport.countryCode) ? true : false ;
      var currentTime = d.getTime();
      var dTime = (new Date(data.flightInfo.operationalTimes.publishedDeparture.dateLocal)).getTime();
      $scope.hoursTil = Math.round((dTime-currentTime)/3600000)
      $scope.takenOff = ($scope.hoursTil < 0) ? true : false ;
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

      // google maps



      // foursquare
      $scope.depFoursquare = data.foursquare.dep.response.groups[0].items;
      console.log($scope.depFoursquare.length)
      $scope.arrFoursquare = data.foursquare.arr.response.groups[0].items;
      $scope.max = 10;
      $scope.isReadyonly = true;


    }).error(function(err){
      alert(err);
    });

  }






  $scope.showPannel = 'departure';
  $scope.togglePannel = function(pannel) {
    $scope.showPannel = pannel;
  }

}]);
