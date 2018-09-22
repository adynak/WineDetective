wineDetective.controller('avaController', ['$scope', 'Data', '$location',
    function($scope, Data, $location) {

        $scope.pageTitle = txtAva.pageTitle;
        var tabLink = Data.getTab().link;

      $scope.oregon = [
        {"id": "Applegate Valley"},
        {"id": "Chehalem Mountains"},
        {"id": "Columbia Gorge"},
        {"id": "Columbia Valley"},
        {"id": "Dundee Hills"},
        {"id": "Elkton"},
        {"id": "Eola-Amity Hills"},
        {"id": "McMinnville"},
        {"id": "Red Hill"},
        {"id": "Ribbon Ridge"},
        {"id": "Rogue Valley"},
        {"id": "Snake River Valley"},
        {"id": "Southern Oregon"},
        {"id": "The Rocks District"},
        {"id": "Umpqua Valley"},
        {"id": "Walla Walla Valley"},
        {"id": "Willamette Valley"},
        {"id": "Yamhill-Carlton District"}
      ];

      $scope.washington = [
        {"id": "Ancient Lakes"},
        {"id": "Columbia Gorge"},
        {"id": "Columbia Valley"},
        {"id": "Horse Heaven Hills"},
        {"id": "Lake Chelan"},
        {"id": "Lewis-Clark Valley"},
        {"id": "Naches Heights"},
        {"id": "Puget Sound"},
        {"id": "Rattlesnake Hills"},
        {"id": "Red Mountain"},
        {"id": "Snipes Mountain"},
        {"id": "Yakima Valley"},
        {"id": "Wahluke Slope"},
        {"id": "Walla Walla Valley"}
      ];

      $scope.california = [
        {"id": "Alexander Valley"},
        {"id": "Napa"},
        {"id": "Sonoma"}
      ];


      $scope.otherAva = [
        {"id": "Rioja"},
        {"id": "Rhone"},
        {"id": "Portugal"}
      ];

      $scope.setSelected = function(selected){
        selected.type = tabLink;
        Data.setVarietal(selected);
        $location.path("/wineGrid");
      }
    }
]);