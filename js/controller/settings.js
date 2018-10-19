wineDetective.controller('settingsController', ['$scope', 'Data', '$location',
    function($scope, Data, $location) {

    	$scope.prompts = txtSettings;

    	$scope.resetDatabaseConnection = function(){
    		Data.clearSecurityInfo();
    		Data.setTab(txtTabNames[0]);
    		$location.path("/login");
    	}

    }
]);