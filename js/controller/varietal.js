wineDetective.controller('varietalController', ['$scope', 'Data', '$location',
    function($scope, Data, $location) {

      $scope.prompts = txtVarietals;

      var tabLink = Data.getTab().link;

      Data.getAllVarietals().then(function(results) {

            allVarietals = results;

            $scope.redWines   = results.red;
            $scope.whiteWines = results.white;
            $scope.otherWines = results.other;
      });

      $scope.setSelected = function(selected){
        selected.type = tabLink;
        Data.setVarietal(selected);
        console.log(selected);
        $location.path("/wineGrid");
      }

    }
]);