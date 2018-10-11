wineDetective.controller('inventoryController', ['$scope', 'Data', '$location', '$filter', 
    function($scope, Data, $location, $filter) {

    	$scope.prompts = txtInventory;

    	var allBottles;
    	var lastCellEdited;

        $scope.gridOptions = {
            saveState: true,
            // enableFiltering: true,
            enableFiltering: false,            
            treeRowHeaderAlwaysVisible: true,
            enableColumnMenus: false,
            columnDefs: [
                { 
                    name: 'vintage',
                    displayName: txtInventory.columnVintage,
                    enableSorting: false,
					enableCellEdit: false,
                    visible: true,
                    width: 70,
                    cellTemplate: '<div ng-click="grid.appScope.showRecipe(row)" class="ui-grid-cell-contents">{{row.entity.vintage}}</div>'
                },
                { 
                    name: 'varietal', 
                    showHeader: false,
                    grouping: { groupPriority: 0 }, 
                    sort: { priority: 0, direction: 'asc' },  
                    enableFiltering: false,                   
                    // width: 135,
                    displayName: txtInventory.columnVarietal,
                    enableSorting: false,
                    cellTemplate: '<div><div ng-if="!col.grouping || col.grouping.groupPriority === undefined || col.grouping.groupPriority === null || ( row.groupHeader && col.grouping.groupPriority === row.treeLevel )" class="ui-grid-cell-contents" title="TOOLTIP">{{COL_FIELD CUSTOM_FILTERS}}</div></div>',
                    headerCellTemplate: '<div class="ui-grid-cell-contents">' + txtInventory.columnVarietal + '</div>'
                },
                {
                    name: 'producer',
                    displayName: txtInventory.columnProducer,
					enableSorting: false,
					enableCellEdit: false,
                    visible: true,
                    width: 250,

                    cellTemplate: '<div ng-click="grid.appScope.showRecipe(row)" class="ui-grid-cell-contents">{{row.entity.producer}}</div>'
                },
                {
                    name: 'aka',
                    displayName: txtInventory.columnAka,
                    enableCellEdit: true,
                    visible: true,
                    width: 150,
                    cellTemplate: '<div ng-click="grid.appScope.showRecipe(row)" class="ui-grid-cell-contents">{{row.entity.aka}}</div>'
                },
                {
                    name: 'vineyard',
                    displayName: txtInventory.columnVineyard,
					enableSorting: false,
					enableCellEdit: true,
                    visible: true,
                    width: 250,
                    cellTemplate: '<div ng-click="grid.appScope.showRecipe(row)" class="ui-grid-cell-contents">{{row.entity.vineyard}}</div>'
                },
                {
                    name: 'bin',
                    displayName: txtInventory.columnBin,
                    enableCellEdit: true,
                    visible: true,
                    width: 50,
                    cellTemplate: '<div ng-click="grid.appScope.showRecipe(row)" class="ui-grid-cell-contents">{{row.entity.bin}}</div>'
                },
                {
                    name: 'id',
                    displayName: txtInventory.columnAka,
                    enableCellEdit: false,
                    visible: false,
                    width: 20,
                    cellTemplate: '<div ng-click="grid.appScope.showRecipe(row)" class="ui-grid-cell-contents">{{row.entity.id}}</div>'
                }
            ],
            onRegisterApi: function( gridApi ) {
                $scope.gridApi = gridApi;

                $scope.gridApi.grid.registerDataChangeCallback(function() {
                    $scope.gridApi.treeBase.expandAllRows();
                });

				gridApi.edit.on.afterCellEdit($scope, function(rowEntity, colDef, newValue, oldValue) {
					if (newValue != oldValue){
      					lastCellEdited = 'ID: ' + rowEntity.id + ', Column: ' + colDef.name + ', New Value: ' + newValue + ', Old Value: ' + oldValue;
      					console.log(lastCellEdited);
      				}
			    });                
              
            }
        };

		Data.getInventory().then(function(results) {
			allBottles = results;
            console.log(results);
            $scope.gridOptions.data = results;
        });

        $scope.searchBottles = function() {
            $scope.gridOptions.data = $filter('filter')(allBottles, $scope.searchText, undefined);
            // gridDimensions = ListServices.getGridHeight($scope.gridOptions, $scope.gridApi);
            // $scope.gridHeight = gridDimensions.gridHeight;
            // $scope.moveUp = gridDimensions.moveUp;
            // $scope.gridApi.grid.refresh();
        };



    }
]);