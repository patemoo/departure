// app.controller('AuthModalCtrl', ['$scope','$http','$modalInstance','UserService','whichModal', function($scope,$http,$modalInstance,UserService,whichModal){

//   $scope.loginData= {email:'',password:''};
//   $scope.signupData= {};
//   $scope.whichModal = whichModal;

//   $scope.switchModal = function(modal) {
//     $scope.whichModal = modal;
//   }

//   $scope.login = function() {
//     UserService.login($scope.loginData.email,$scope.loginData.password,
//       function(err, data){
//         if(err){
//           // server error
//           alert(err);
//         }else if (data.user){
//           // successful login
//           $modalInstance.close();
//         }else{
//           // login error (bad user or pass)
//           alert(data.error);
//         }
//       }
//     );
//   };

//   $scope.signup = function(){

//     if ($scope.signupPassword != $scope.signupPasswordConfirm){
//       alert('your password confirmation does not match.')
//       return;
//     }

//     var signupData = {
//       username: $scope.signupUsername,
//       email: $scope.signupEmail,
//       password: $scope.signupPassword
//     };

//     $http.post('/api/user', signupData)
//     .success(function(data){
//       // AlertService.add('success','You have been signed up.');
//       $modalInstance.close();
//     }).error(function(error){
//       alert(err);
//     });

//   }

// }])
