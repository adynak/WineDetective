var wineDetective = angular.module('wineDetective', 
  [
            'ngRoute', 
            // 'ngAnimate', 
            // 'ngTouch', 
            'ui.grid', 
            // 'ui.grid.edit', 
            // 'ngMessages', 
            'ui.grid.grouping', 
            'checklist-model',
            // 'ui.bootstrap',
            // 'ui.grid.selection',
            // 'ui.grid.cellNav',
            // 'ngClickCopy',
            'ngMaterial', 
            'ngMessages'
  ]);


wineDetective.config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider) {

    document.title = standards.productName;

    $routeProvider.
        when('/varietal', 
          {
            templateUrl: 'wineDetective/view/varietal.html',
            controller: 'varietalController'
          }).
        when('/ava',
          {
            templateUrl: 'wineDetective/view/ava.html',
            controller: 'avaController'
          }).
        when('/vintage',
          {
            templateUrl: 'wineDetective/view/vintage.html',
            controller: 'vintageController'
          }).
        when('/wineGrid',
          {
            templateUrl: 'wineDetective/view/wineGrid.html',
            controller: 'wineGridController'
          }).
        otherwise({redirectTo: '/varietal'});
        
        $locationProvider.html5Mode(true);
}]);