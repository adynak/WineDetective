wineDetective.controller('wineGridController', 
    [
        '$scope', 
        'Data', 
        '$location', 
        'uiGridConstants',

    function($scope, Data, $location, uiGridConstants) {
        
        var selected = Data.getVarietal();
        $scope.modalShown = false;

        var wineData;

        switch (selected.type){
            case 'varietal':
                wineData = [
                    { year: "2016", producer: "Abacella", vineyard: "Estate", 
                        bottles:[
                            {id: 1, location: 'A'},
                            {id: 2, location: 'A'},
                            {id: 3, location: 'B'},
                            {id: 4, location: 'C'}
                        ]
                    },
                    { year: "2016", producer: "Zerba", vineyard: "Rocks"},
                    { year: "2015", producer: "Delfino", vineyard: "Estate"},
                    { year: "2014", producer: "RoxyAnne", vineyard: "Estate"},
                    { year: "2013", producer: "Helix", vineyard: "Phinny Hill"}
                ];
                break;

            case 'ava':
                wineData = [
                    { year: "2016", producer: "Abacella", vineyard: "Estate",
                        bottles:[
                            {id: 1, location: 'A'},
                            {id: 2, location: 'A'},
                            {id: 3, location: 'B'},
                            {id: 4, location: 'C'}
                        ]
                    },
                    { year: "2013", producer: "Helix", vineyard: "Phinny Hill"}
                ];
                break;


            case 'vintage':
                wineData = [
                    { year: "2016", producer: "Abacella", vineyard: "Estate",
                        bottles:[
                            {id: 1, location: 'A'},
                            {id: 2, location: 'A'},
                            {id: 3, location: 'B'},
                            {id: 4, location: 'C'}
                        ]
                    },
                    { year: "2016", producer: "Helix", vineyard: "Phinny Hill"}
                ];
                break;                
        }

        $scope.pageTitle = selected.name;

        $scope.gridOptions = {
            columnDefs: [
                {
                    field: 'year', 
                    displayName: 'Year', 
                    width: 100,
                    grouping: { groupPriority: 0 }, 
                    sort: { priority: 0, direction: 'desc' },
                    cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents">{{COL_FIELD CUSTOM_FILTERS}}</div></div>',                    
                    headerCellTemplate: '<div class="ui-grid-cell-contents">' + 'Year' + '</div>'                    
                },
                {
                    field: 'producer', 
                    displayName: 'Producer', 
                    width: '*',
                    cellTemplate: '<div ng-click="grid.appScope.showBottles(row)" class="ui-grid-cell-contents">{{row.entity.producer}}</div>'
                },
                {
                    field: 'vineyard',
                    displayName: 'Vineyard', 
                    width: 220,
                    cellTemplate: '<div ng-click="grid.appScope.showBottles(row)" class="ui-grid-cell-contents">{{row.entity.vineyard}}</div>'                    
                }
            ],
            data: wineData,
            enableRowSelection: false,
            enableColumnMenus: false,
            treeRowHeaderAlwaysVisible: true,
            onRegisterApi: function(gridApi) {
                $scope.gridApi = gridApi;
                $scope.gridApi.grid.registerDataChangeCallback(function() {
                    $scope.gridApi.treeBase.expandAllRows();
                });
            }
        };

        $scope.showBottles  = function(row){

            if (typeof(row.entity.producer) == 'undefined'){
                // clicked an expander row
                return;
            } else {
                $scope.inventory = {
                    producer : row.entity.producer,
                    varietal : selected.name,
                    year     : row.entity.year,
                    bottles  : row.entity.bottles
                }
                $scope.modalShown = true;
            }
        };  

        $scope.cart = function(action){
            switch (action){
                case 'checkout':
                    console.log($scope.cart.bottles);
                    break;
                case 'cancel':
                    break;
            }
            $scope.cart.bottles = [];

            $scope.modalShown = false;
        }

    }
]);