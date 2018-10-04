wineDetective.controller('addBottleController', ['$scope', 'Data', '$location', '$http',
    function($scope, Data, $location, $http) {

		$scope.prompts = txtAddBottle;

		$scope.modalShown = false;

		var d = new Date();
		var YYYY = d.getFullYear();
		$scope.vintage = [
			{id : YYYY, description : YYYY},
			{id : YYYY-1, description : YYYY-1},
			{id : YYYY-2, description : YYYY-2},
			{id : YYYY-3, description : YYYY-3},
			{id : YYYY-4, description : YYYY-4},
			{id : YYYY-5, description : YYYY-5},
			{id : YYYY-6, description : YYYY-6},
			{id : YYYY-7, description : YYYY-7},
			{id : YYYY-8, description : YYYY-8},
			{id : YYYY-9, description : YYYY-9},
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

	    $scope.resetForm = function(bottle){
			Object.keys(bottle).forEach(function(key) {
				bottle[key] = null;
			});
	    }

	    $scope.processForm = function(bottle){
			var storageBins = [];
			var binPrompt = {};

	    	$scope.bottleDescription = bottle.vintage.description + ' ' + bottle.producer + ' ' + bottle.varietal.description;
	    	for (var b = 1 ; b < bottle.numberOfBottles+1 ; b++){
	    		binPrompt.id = b;
	    		binPrompt.label = 'Bottle #' + b
	    		storageBins.push(binPrompt);
	    		binPrompt = {};
	    	}
	    	console.log(storageBins);
	    	$scope.addToInventory = storageBins;
	    	$scope.modalShown = true;
	    }
    }
]);