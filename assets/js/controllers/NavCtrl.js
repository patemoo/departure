app.controller('NavCtrl', ['$scope','$location','$modal','UserService', function($scope,$location,$modal,UserService){

  $scope.isCollapsed = true;

  // $scope.UserService = UserService;
  // $scope.$watchCollection('UserService', function(){
  //   $scope.currentUser = UserService.currentUser;
  // });

  // $scope.showModal = function(modal) {
  //   $modal.open({
  //     templateUrl: '/views/authModal.html',
  //     controller: 'AuthModalCtrl',
  //     resolve: {
  //       whichModal: function() {
  //         return modal;
  //       }
  //     }
  //   })
  // }

  // $scope.logout = function(){
  //   UserService.logout(function(err, data){

  //   });
  // };

  $scope.navShow = false;
  $scope.location = $location;
  $scope.$watchCollection('location', function(){
    if ($location.path().length > 7) {
      $scope.navShow = true;
    } else {
      $scope.navShow = false;
    }
  });


}]);
