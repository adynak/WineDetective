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

        Data.getSelectedVarietal(selected.name).then(function(response) {
            debugger;
            console.log(response);
            }, function(err) {
                $scope.invalidMessage= err;
            });


        switch (selected.type){
            case 'varietal':
                wineData = [
                    { vintage: "2016", producer: "Abacella", vineyard: "Estate", 
                        bottles:[
                            {id: 1, location: 'A'},
                            {id: 2, location: 'A'},
                            {id: 3, location: 'B'},
                            {id: 4, location: 'C'}
                        ]
                    },
                    { vintage: "2016", producer: "Zerba", vineyard: "Rocks"},
                    { vintage: "2015", producer: "Delfino", vineyard: "Estate"},
                    { vintage: "2014", producer: "RoxyAnne", vineyard: "Estate"},
                    { vintage: "2013", producer: "Helix", vineyard: "Phinny Hill"}
                ];
                break;

            case 'ava':
                wineData = [
                    { vintage: "2016", producer: "Abacella", vineyard: "Estate",
                        bottles:[
                            {id: 1, location: 'A'},
                            {id: 2, location: 'A'},
                            {id: 3, location: 'B'},
                            {id: 4, location: 'C'}
                        ]
                    },
                    { vintage: "2013", producer: "Helix", vineyard: "Phinny Hill"}
                ];
                break;


            case 'vintage':
                wineData = [
                    { vintage: "2016", producer: "Abacella", vineyard: "Estate",
                        bottles:[
                            {id: 1, location: 'A'},
                            {id: 2, location: 'A'},
                            {id: 3, location: 'B'},
                            {id: 4, location: 'C'}
                        ]
                    },
                    { vintage: "2016", producer: "Helix", vineyard: "Phinny Hill"}
                ];
                break;                
        }

        $scope.pageTitle = selected.name;
        console.log(wineData);

        $scope.gridOptions = {
            columnDefs: [
                {
                    field: 'vintage', 
                    displayName: 'vintage', 
                    width: 100,
                    grouping: { groupPriority: 0 }, 
                    sort: { priority: 0, direction: 'desc' },
                    cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents">{{COL_FIELD CUSTOM_FILTERS}}</div></div>',                    
                    headerCellTemplate: '<div class="ui-grid-cell-contents">' + 'vintage' + '</div>'                    
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
                    vintage     : row.entity.vintage,
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