angular.module('technodeApp.directives')
  .directive('autoScrollToBottom', function () {
    return {
      link: function (scope, elem, attrs) {
        scope.$watch(function () {
          return elem.children().length;
        },
        function () {
          elem.animate({
            scrollTop: elem.prop('scrollHeight')
          },1000);
        }
      )
      }
    }
  })
  .directive('ctrlEnterBreakLine', function () {
    return function (scope, elem, attrs) {
      var ctrlDown = false;
      elem.bind('keydown', function (event) {
        if(event.which === 17) {
          ctrlDown = true;

          setTimeout(function () {
            ctrlDown = false;
          },1000);
        }
        if(event.which === 13) {
          if(ctrlDown) {
            elem.val(elem.val()+'\n')
          } else {
            scope.$apply(function () {
              scope.$eval(attrs.ctrlEnterBreakLine);
            });
            event.preventDefault();
          }
        }
      });

    }
  })
