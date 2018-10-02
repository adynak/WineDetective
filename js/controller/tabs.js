wineDetective.controller('tabsController', ['$scope', 'Data', '$location',
    function($scope, Data, $location) {

      $scope.tabs = txtTabNames;

      $scope.selectedTab = $scope.tabs[0];  
      Data.setTab($scope.tabs[0]);

      $scope.setSelectedTab = function(tab) {
        $scope.selectedTab = tab;
      }

      // the login controller sets showTabs to true when credentialss are okay
      // the html will toggle the tab display on true
      $scope.$watch(function () { 
        return Data.getShowTabs(); }, 
          function (newValue, oldValue) {
            if (newValue !== oldValue) $scope.showTabs = newValue;
      });

      $scope.tabClass = function(tab) {
        if ($scope.selectedTab == tab) {
          Data.setTab(tab);
          return "active";
        } else {
          return "";
        }
      }

    }
]);