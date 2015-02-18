app.controller('DashboardCtrl', ['$scope','$http','uiGmapGoogleMapApi', function($scope,$http,uiGmapGoogleMapApi){



    $http.get('/api/allstats')
    .success(function(data){

      $scope.flightInfo = data.flightInfo;

      $scope.depCurrent = data.forecast.dep.currently
      $scope.depTemp = Math.round(data.forecast.dep.currently.temperature);
      $scope.depDaily = data.forecast.dep.daily

      $scope.arrCurrent = data.forecast.arr.currently
      $scope.arrTemp = Math.round(data.forecast.arr.currently.temperature);
      $scope.arrDaily = data.forecast.arr.daily

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




  $scope.showPannel = 'departure';
  $scope.togglePannel = function(pannel) {
    $scope.showPannel = pannel;
  }

}]);
