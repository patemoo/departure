app.controller('DashboardCtrl', ['$scope','$http','uiGmapGoogleMapApi', function($scope,$http,uiGmapGoogleMapApi){


  var d = new Date();

  $scope.searchData = {
    airline: 'AA',
    flight: '100',
    year: d.getFullYear(),
    month: (d.getMonth()+1),
    day: d.getDate()+1
  }

  $scope.findFlight = function() {

    $http.post('/api/allstats', $scope.searchData)
    .success(function(data){


      // flight info
      $scope.flightInfo = data.flightInfo;
      $scope.international = (data.flightInfo.departureAirport.countryCode != data.flightInfo.arrivalAirport.countryCode) ? true : false ;
      var currentTime = d.getTime();
      var dTime = (new Date(data.flightInfo.operationalTimes.publishedDeparture.dateLocal)).getTime();
      $scope.hoursTil = Math.round((dTime-currentTime)/3600000)
      $scope.takenOff = ($scope.hoursTil < 0) ? true : false ;

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
      uiGmapGoogleMapApi.then(function(maps) {
        $scope.dmap = {
          center: { latitude: data.deplat, longitude: data.deplon },
          zoom: 10
        };

        $scope.amap = {
          center: { latitude: data.arrlat, longitude: data.arrlon },
          zoom: 10
        };
      });

      // foursquare
      $scope.depFoursquare = data.foursquare.dep.response.groups[0].items;
      // var venue = {venueId: depFoursquare.}
      // $http.post('/api/getPhotos',)
      $scope.arrFoursquare = data.foursquare.arr.response.groups[0].items;

    }).error(function(err){
      alert(err);
    });

  }






  $scope.showPannel = 'departure';
  $scope.togglePannel = function(pannel) {
    $scope.showPannel = pannel;
  }

}]);
