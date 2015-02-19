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

      $scope.flightInfo = data.flightInfo;
      $scope.international = (data.flightInfo.departureAirport.countryCode != data.flightInfo.arrivalAirport.countryCode) ? true : false ;

      var currentTime = d.getTime();
      var dTime = (new Date(data.flightInfo.operationalTimes.publishedDeparture.dateLocal)).getTime();
      $scope.hoursTil = Math.round((dTime-currentTime)/3600000)
      $scope.takenOff = ($scope.hoursTil < 0) ? true : false ;

      console.log(currentTime, dTime, ((dTime-currentTime)/3600000))



      $scope.depCurrent = data.forecast.dep.currently
      $scope.depTemp = Math.round(data.forecast.dep.currently.temperature);
      $scope.depDaily = data.forecast.dep.daily.data

      $scope.arrCurrent = data.forecast.arr.currently
      $scope.arrTemp = Math.round(data.forecast.arr.currently.temperature);
      $scope.arrDaily = data.forecast.arr.daily.data

      $scope.exchange = data.exchange;

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

    }).error(function(err){
      alert(err);
    });

  }






  $scope.showPannel = 'departure';
  $scope.togglePannel = function(pannel) {
    $scope.showPannel = pannel;
  }

}]);
