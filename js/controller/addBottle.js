wineDetective.controller('addBottleController', ['$scope', 'Data', '$location', '$http', '$filter',
    function($scope, Data, $location, $http, $filter) {

		$scope.prompts = txtAddBottle;

		$scope.modalShowAddBin      = false;
		$scope.modalAddNewTableItem = false;

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

	    $scope.addNewThing = function(bottle){

	    	var newItem = {};
	    	var data = '';
	    	newItem.description  = bottle.addMe;
	    	newItem.winecategory = bottle.winecategory;

	    	switch (bottle.inputType){
	    		case 'varietal':
	    			data = $scope.varietal;
	    			break;
	    		case 'ava':
	    			data = $scope.ava;
	    			break;
	    		case 'bin':
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
				$scope.infoList.splice(insertPosition-1, 0, newItem);

				// postgresql needs to return the id
        		newItem.id = 19;

				switch (bottle.inputType){
					case 'varietal':
						$scope.varietal.splice(insertPosition, 0, newItem);
						break;
					case 'ava':
						$scope.ava.splice(insertPosition, 0, newItem);
						break;
					case 'bin':
						$scope.bin.splice(insertPosition, 0, newItem);
						break;
				}

				$scope.bottle.addMe = null;
				$scope.bottle.winecategory = null;

            	// results = ListServices.insertNewItem(newItem,$scope.infoList,$scope.infoListLabel);
        	}

	    }

	    $scope.getNewSomething = function(theNewThing){
	    	// this is an on-change listener, open a modal when 'Add New' (id=0) is chosen

	    	if (theNewThing.id == 0){
	    		var tableName = ' ' + theNewThing.tableName + 's:';

	    		$scope.modalShowAddNew     = true;
	    		$scope.modalAddNewHeading  = theNewThing.description;
	    		$scope.modalAddNewLabel    = txtAddBottle.new + ' ' + theNewThing.label + ":";
	    		$scope.modalShowCategory   = true;

	    		$scope.modalAddNewInstructions = $scope.prompts.modalAddNewInstructions.concat(tableName);

	    		switch(theNewThing.tableName){
	    			case 'varietal':
	    				$scope.wineCategoryList = Data.getVarietalCategoryList();
	    				$scope.infoList         = $scope.varietal.slice(1, 999);
	    				$scope.bottle.inputType = 'varietal';
	    				break;
					case 'AVA':
						$scope.wineCategoryList = Data.getAvaCategoryList();
						$scope.infoList         = $scope.ava.slice(1,999);
						$scope.bottle.inputType = 'ava';
	    				break;
	     			case 'bin':
	     				$scope.modalShowCategory = false;
	    				$scope.wineCategoryList = Data.getAvaCategoryList();
						$scope.infoList         = $scope.bin.slice(1,999);
						$scope.bottle.inputType = 'bin';
	    				break;	    				
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
			$scope.modalShowAddBin = false;	    	
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
	    	$scope.modalShowAddBin = true;
	    }

	    $scope.processForm = function(bottle){
	    	$scope.modalShowAddBin = false;

			Data.addBottle(bottle).then(function(results) {
				alert('wine added');
				Object.keys(bottle).forEach(function(key) {
					bottle[key] = null;
				});				
			});	    	


	    }

	    $scope.checkInputs = function(inputs){
	    	var checkInput = 0;

	    	if (typeof(inputs) != 'undefined'){
		    	if (inputs.inputType == 'varietal'){
					if ((inputs.winecategory == '') || (typeof(inputs.winecategory) == 'undefined') || (inputs.winecategory == null)){
						checkInput ++;
					}
		    	}
				if ((inputs.addMe == '') || (typeof(inputs.addMe) == 'undefined') || (inputs.addMe == '')){
					checkInput ++;
				}
				return checkInput > 0 ? true : false;
	    	}
	    }

	    $scope.processNewThing = function(bottle,addMe){
			$scope.bottle[bottle.inputType] = null;
	    	if (typeof(addme) == "undefined"){
	    		bottle = null;
	    	}
			$scope.modalShowAddNew = false;
	    }

	    var findIndexInData = function(data, property, value){
	    	// we're going to use splice to insert, 999 will effectively be a push (append)
            var result = 999;
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