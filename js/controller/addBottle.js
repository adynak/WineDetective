wineDetective.controller('addBottleController', ['$scope', 'Data', '$location', '$http', '$filter',
    function($scope, Data, $location, $http, $filter) {

		$scope.prompts = txtAddBottle;

		$scope.modalShown = false;
		$scope.modalAddNewTableItem = false;

		$scope.wineCategoryList = [
			{
				"description": "Red",
				"isSelected": false
			}, 
			{
				"description": "White",
				"isSelected": false
			},
			{
				"description": "Other",
				"isSelected": false
			}
		];

		var d = new Date();
		var YYYY = d.getFullYear();
		$scope.vintage = [
			{id : YYYY,    description : YYYY-0},
			{id : YYYY-1,  description : YYYY-1},
			{id : YYYY-2,  description : YYYY-2},
			{id : YYYY-3,  description : YYYY-3},
			{id : YYYY-4,  description : YYYY-4},
			{id : YYYY-5,  description : YYYY-5},
			{id : YYYY-6,  description : YYYY-6},
			{id : YYYY-7,  description : YYYY-7},
			{id : YYYY-8,  description : YYYY-8},
			{id : YYYY-9,  description : YYYY-9},
			{id : YYYY-10, description : YYYY-10},
			{id : YYYY-11, description : YYYY-11},
			{id : YYYY-12, description : YYYY-12}
		];

		$http.get("winedetective/resources/dataServices/getSelectLists.php?tableName=AVA").then(function (response) {
        	$scope.ava = response.data.records;
    	});

	    $http.get("wineDetective/resources/dataServices/getSelectLists.php?tableName=varietal").then(function (response) {
	        $scope.varietal = response.data.records;
	    });

	    $http.get("winedetective/resources/dataServices/getSelectLists.php?tableName=bin").then(function (response) {
	        $scope.bin = response.data.records;
	    });


	    $scope.removeItem = function(position){
	    	var d = {};
	    	d.data = {}
	    	d.data.success = true;
	    	 if (d.data.success){
                $scope.infoList.splice(position, 1);
            } else {

            }

	    }

	    $scope.addItem = function(bottle){
	    	console.log($scope.bottle);

	    	var newItem = {};
	    	var data = '';
	    	newItem.description = bottle.addMe;
	    	switch ($scope.newLabel){
	    		case 'Varietal':
	    			data = $scope.varietal;
	    			break;
	    		case 'AVA':
	    			data = $scope.ava;
	    			break;
	    		case 'Bin':
	    			data = $scope.bin;
	    			break;
	    	}
	    	found = $filter('filter')(data, {description: newItem.description}, false);

			if (found.length) {
            	for (var cnt = 0 ; cnt < found.length ; cnt ++){
                	if (found[cnt].description.toLowerCase() == newItem.description.toLowerCase()){
                    	$scope.addMessage = newItem.description + ' is a duplicate of ' + found[cnt].description;
                    	$scope.bottle.addMe = null;
                    	uniqueItem = false;
	                    break;
    	            }
        	    }
            	if (uniqueItem){
            		insertPosition = findIndexInData(data, 'description', newItem);
                	// results = ListServices.insertNewItem(newItem,$scope.infoList,$scope.infoListLabel);
            	}
        	} else {
        		insertPosition = findIndexInData(data, 'description', newItem);
        		if (insertPosition < 0){
             	   data.push(newItem);
            	} else {
	                data.splice(insertPosition, 0, newItem);
    	        }

            	// results = ListServices.insertNewItem(newItem,$scope.infoList,$scope.infoListLabel);
        	}


	    	debugger;
	    }

	    $scope.getNewSomething = function(theThing){
	    	if (theThing.id == 0){
	    		var tableName = ' ' + theThing.tableName + 's:';
	    		$scope.modalAddNewTableItem = true;
	    		$scope.addNewHeading = theThing.description;
	    		$scope.newLabel = theThing.label;

	    		$scope.prompts.addNewInstructions = $scope.prompts.addNewInstructions.concat(tableName);
	    		if (theThing.tableName == 'varietal'){
	    			$scope.infoList = $scope.varietal.slice(1, 999);
	    		} else {
					$scope.infoList = $scope.ava.slice(1,999);
	    		}
	    	}
	    }

	    $scope.resetForm = function(bottle){

			Object.keys(bottle).forEach(function(key) {
				bottle[key] = null;
			});
	    }

	    $scope.toggleModal = function(bottle){
	    	var key = 'bin';
	    	bottle[key] = null;
			$scope.modalShown = false;	    	
	    }

	    $scope.getStorageBin = function(bottle){
			var storageBins = [];
			var binPrompt = {};

	    	$scope.bottleDescription = bottle.vintage.description + ' ' + bottle.producer + ' ' + bottle.varietal.description;
	    	for (var b = 1 ; b < bottle.numberOfBottles+1 ; b++){
	    		binPrompt.id = b;
	    		binPrompt.label = 'Bottle #' + b
	    		storageBins.push(binPrompt);
	    		binPrompt = {};
	    	}
	    	$scope.addToInventory = storageBins;
	    	$scope.modalShown = true;
	    }

	    $scope.processForm = function(bottle){
	    	alert('UPDATE POSTGRESQL');
	    	console.log(bottle);
	    	$scope.modalShown = false;
	    	Object.keys(bottle).forEach(function(key) {
				bottle[key] = null;
			});
	    }

	    $scope.processNewThing = function(bottle,addMe){
	    	if (typeof(addme) == "undefined"){
	    		bottle['varietal'] = null;
	    	}
			$scope.modalAddNewTableItem = false;
	    }

	    var findIndexInData = function(data, property, value){
            var result = -1;
            var desc = value.description;
            data.some(function (item, i) {
                if (item[property] >= desc) {
                    result = i;
                    return true;
                }
            });
            return result;
        }
    }
]);