

angular.module('technodeApp.controllers', []);
angular.module('technodeApp.services', []);
angular.module('technodeApp.directives', []);
angular.module('technodeApp.route', []);

angular.module('technodeApp', [
  'ngRoute',
  'technodeApp.route',
  'technodeApp.services',
  'technodeApp.controllers',
  'technodeApp.directives'
]);

angular.module('technodeApp')
  .run(function ($window, $rootScope, $http, $location) {
    $http({
      url:'/api/validate',
      method: 'GET'
    }).success(function (user) {
      console.log('success');
      $rootScope.me = user;
      // $location.path('/');
    }).error(function () {
      $location.path('/login');
    });
  })
