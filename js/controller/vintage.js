wineDetective.controller('vintageController', ['$scope', 'Data', '$location',
    function($scope, Data, $location) {

      $scope.pageTitle = txtVintage.pageTitle;
      var tabLink = Data.getTab().link;


      $scope.fresh = [
        {"id": "2017"}
      ];

      $scope.young = [
        {"id": "2016"},
        {"id": "2015"},
        {"id": "2014"},
        {"id": "2013"}
      ];

      $scope.mature = [
        {"id": "2012"},
        {"id": "2011"},
        {"id": "2010"},
        {"id": "2009"},
        {"id": "2008"}        
      ];


      $scope.old = [
        {"id": "2007"},
        {"id": "2006"},
        {"id": "2005"}
      ];

      $scope.setSelected = function(selected){
        selected.type = tabLink;
        Data.setVarietal(selected);
        $location.path("/wineGrid");
      }
    }
]);