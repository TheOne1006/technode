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
  })
  .controller('MessageCreatorCtrl', function ($scope, socket) {
    $scope.newMessage = '';
    $scope.createMessage = function () {
      if(!$scope.newMessage) {
        return
      }
      console.log($scope.newMessage);
      socket.emit('createMessage', $scope.newMessage);
      $scope.newMessage = '';
    }
  })
  .controller('LoginCtrl', function ($scope) {

  });
