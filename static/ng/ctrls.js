angular
  .module('technodeApp.controllers')
  .controller('RoomCtrl', function ($scope, socket) {
    $scope.messages = [];

    socket.emit('getAllMessages');

    socket.on('allMessages', function (messages) {
      $scope.messages = messages;
    });

    socket.on('messageAdded', function (message) {
      $scope.messages.push(message)
    });

    socket.on('roomData', function (room) {
      console.log(room);
      $scope.room = room;
    });

    socket.emit('getRoom');
  })
  .controller('MessageCreatorCtrl', function ($scope, socket) {
    $scope.newMessage = '';
    $scope.createMessage = function () {
      if(!$scope.newMessage) {
        return
      }
      console.log($scope.newMessage);
      socket.emit('messages.create', {
        message: $scope.newMessage,
        creator: $scope.me
      });
      $scope.newMessage = '';
    }
  })
  .controller('LoginCtrl', function ( $scope, $http, $location) {
    $scope.email = '';

    $scope.login = function () {
      $http({
        url:'/api/login',
        method: 'POST',
        data: {
          email: $scope.email
        }
      }).success(function (user) {
        console.log(user);
        $scope.$emit('login', user);
      }).error(function () {
        $location.path('/login');
      })
    };

  });
