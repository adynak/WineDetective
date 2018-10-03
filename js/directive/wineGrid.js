wineDetective.directive('modalDialog', function() {
// note that the attribute txtButtonDone is reduced to all lowercase  
  return {
    restrict: 'E',
    scope: {
      show: '=',
      btnDone: '@txtbuttondone'
    },
    replace: true, // Replace with the template below
    transclude: true, // we want to insert custom content inside the directive
    link: function(scope, element, attrs) {

      scope.dialogStyle = {};

      if (attrs.width)
        scope.dialogStyle.width = attrs.width;
      if (attrs.height)
        scope.dialogStyle.height = attrs.height;

      scope.hideModal = function() {
        scope.show = false;
      };
    },
    template: "<div class='ng-modal' ng-show='show'>" + 
                "<div class='ng-modal-overlay' ng-click='hideModal()'></div>" + 
                "<div class='ng-modal-dialog' ng-style='dialogStyle'>" + 
                  "<div class='ng-modal-dialog-content' ng-transclude></div>" + 
                "</div>" + 
              "</div>"
  };
});