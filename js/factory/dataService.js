wineDetective.factory("Data", ['$http', '$q', '$rootScope',
    function($http, $q, $rootScope) {

        var factoryVariables = {
            varietal: null
        };

        setVarietal = function(varietal){
            factoryVariables.varietal = varietal;
        }

        getVarietal = function(){
            return factoryVariables.varietal;
        }

        setTab = function(tab){
            factoryVariables.tab = tab;
        }

        getTab = function(){
            return factoryVariables.tab;
        }

        var getAllVarietals = function(){
            var qObject = $q.defer();
            var params = {
                task: 'getAllVarietals'
            };

            $http({
                method: 'POST',
                url: 'wineDetective/resources/dataServices/dataService.php',
                data: params,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            }).then(function(success) {
                qObject.resolve(success.data);
            }, function(err) {
                console.log(err);
            });
            return qObject.promise;            
        }

        return {
            setVarietal: setVarietal,
            getVarietal: getVarietal,
            setTab: setTab,
            getTab: getTab,
            getAllVarietals:getAllVarietals
        };
    }
]);