wineDetective.controller('tabsController', ['$scope', 'Data', '$location',
    function($scope, Data, $location) {

      $scope.tabs = [
        { 
          link : 'varietal', 
          label : 'Varietal'
        },
        { 
          link : 'ava', 
          label : 'AVA'
        },
        { 
          link : 'vintage',
          label : 'Vintage'
        }
      ]; 

      $scope.selectedTab = $scope.tabs[0];  
      Data.setTab($scope.tabs[0]);

      $scope.setSelectedTab = function(tab) {
        $scope.selectedTab = tab;
      }

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