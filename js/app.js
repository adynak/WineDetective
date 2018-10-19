var wineDetective = angular.module('wineDetective', 
  [
            'ngRoute', 
            // 'ngAnimate', 
            // 'ngTouch', 
            'ui.grid', 
            'ui.grid.edit', 
            // 'ngMessages', 
            'ui.grid.grouping', 
            'checklist-model',
            // 'ui.bootstrap',
            // 'ui.grid.selection',
            'ui.grid.cellNav',
            // 'ngClickCopy',
            'ngMaterial', 
            'ngMessages',
            'toaster'
  ]);


wineDetective.config(['$routeProvider', '$locationProvider', 
  function($routeProvider, $locationProvider) {

    document.title = standards.productName;
    document.brand = standards.productName;

    $routeProvider.
        when('/login', 
          {
            templateUrl: 'wineDetective/view/login.html',
            controller: 'LoginController',
            task: 'getsessiondata'
          }).
        when('/tabs', 
          {
            templateUrl: 'wineDetective/view/tabs.html',
            controller: 'tabsController'
          }).
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
          when('/addBottle',
          {
            templateUrl: 'wineDetective/view/addBottle.html',
            controller: 'addBottleController'
          }).
          when('/inventory',
          {
            templateUrl: 'wineDetective/view/inventory.html',
            controller: 'inventoryController'
          }).
          when('/getSecurity',
          {
            templateUrl: 'wineDetective/view/security.html',
            controller: 'securityController'
          }).
          when('/settings',
          {
            templateUrl: 'wineDetective/view/settings.html',
            controller: 'settingsController'
          }).
        otherwise({redirectTo: '/login'});
        
        $locationProvider.html5Mode(true);

}]).run(function($rootScope, $location, Data) {
    $rootScope.$on("$routeChangeStart", function(event, next, current) {
        var securityInfo = Data.getSecurityInfo();
        if (securityInfo.stop){
            $location.path("/getSecurity");
            next.templateUrl = 'wineDetective/view/security.html';
        }
    });
});
