wineDetective.factory("Data", ['$http', '$q', '$rootScope',
    function($http, $q, $rootScope) {

        var factoryVariables = {
            varietal: null,
            loginCredentials:{
                validated: false,
                member: {
                    member_type: 0
                }
            },
            showTabs: ''
        };

        var setVarietalCategoryList = function(){
            factoryVariables.varietalCategoryList = [
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
        }

        var getVarietalCategoryList = function(){
            return factoryVariables.varietalCategoryList;
        }

        var setAvaCategoryList = function(){
            factoryVariables.avaCategoryList = [
                {
                    "description": "Oregon",
                    "isSelected": false
                }, 
                {
                    "description": "Washington",
                    "isSelected": false
                },
                {
                    "description": "California",
                    "isSelected": false
                },
                {
                    "description": "OtherAVA",
                    "isSelected": false
                }
            ];
        }

        var getAvaCategoryList = function(){
            return factoryVariables.avaCategoryList;
        }

        var getShowTabs = function () {
            return factoryVariables.showTabs;
        }

        var setShowTabs = function (showTabs) {
            factoryVariables.showTabs = showTabs;
        }

        var setVarietal = function(varietal){
            factoryVariables.varietal = varietal;
        }

        var getVarietal = function(){
            return factoryVariables.varietal;
        }

        var setTab = function(tab){
            factoryVariables.tab = tab;
        }

        var getTab = function(){
            return factoryVariables.tab;
        }

        var setCurrentMember = function(loginCredentials){
            factoryVariables.loginCredentials = loginCredentials;
        }

        var getCurrentMember = function(){
            return factoryVariables.loginCredentials;
        }

        var validateCredentials = function(member){
            var qObject = $q.defer();
            var params = {
                email: member.email,
                password: member.password,
                task: 'validate'
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

        var getSelectedVarietal = function(varietalName){
            var qObject = $q.defer();
            var params = {
                task: 'getSelectedVarietal',
                varietalName : varietalName
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

        var init = function(member){
            var qObject = $q.defer();
            var params = {
                task: 'init'
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

        var getAllVarietals = function(bottle){
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

        var addBottle = function(bottle){
            var qObject = $q.defer();
            var params = {
                task: 'addBottle',
                bottle: bottle
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

        var getInventory = function(){
            var qObject = $q.defer();
            var params = {
                task: 'getInventory'
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
            init: init,
            setVarietal: setVarietal,
            getVarietal: getVarietal,
            setTab: setTab,
            getTab: getTab,
            setCurrentMember: setCurrentMember,
            getCurrentMember: getCurrentMember,
            validateCredentials: validateCredentials,
            getAllVarietals:getAllVarietals,
            getShowTabs: getShowTabs,
            setShowTabs: setShowTabs,
            getSelectedVarietal: getSelectedVarietal,
            setVarietalCategoryList: setVarietalCategoryList,
            getVarietalCategoryList: getVarietalCategoryList,
            setAvaCategoryList: setAvaCategoryList,
            getAvaCategoryList: getAvaCategoryList,
            addBottle: addBottle,
            getInventory: getInventory
        };
    }
]);