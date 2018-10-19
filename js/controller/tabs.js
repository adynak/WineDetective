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
      // also insure that the first tab (tabs[0]) is selected
      $scope.$watch(function () { 
        return Data.getShowTabs(); }, 
          function (newValue, oldValue) {
            if (newValue !== oldValue){
              $scope.selectedTab = $scope.tabs[0];  
              Data.setTab($scope.tabs[0]);
              $scope.showTabs = newValue;
            } else {

            }
      });

      $scope.tabClass = function(tab) {

        var tabControl;

        var allowAccess = Data.getCurrentMember().member.member_type;
        if (tab.type == 'admin' && allowAccess == 0){
          // $scope.accessType = 'none';
          $scope.accessType = 'inline';          
        } else {
          $scope.accessType = 'inline';
        }

        if ($scope.selectedTab == tab) {
          Data.setTab(tab);
          tabControl = 'active';
        } else {
          tabControl = '';
        }
        return tabControl
      }

    }
]);