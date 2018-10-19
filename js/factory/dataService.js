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
            showTabs: '',
            securityInfo : {
                schema: null,
                dbPass: null,
                pgPort: null,
                stop: true
            }
        };


        var setSecurityInfo = function(securityInfo){
            localStorage.setItem('winedetective_schema', securityInfo.schema);
            localStorage.setItem('winedetective_dpPass', securityInfo.dbPass);
            localStorage.setItem('winedetective_pgPort', securityInfo.pgPort);            
            factoryVariables.securityInfo = securityInfo;
        }

        var getSecurityInfo = function(){
            if (factoryVariables.securityInfo.schema == null || factoryVariables.securityInfo.dbPass == null || factoryVariables.securityInfo.pgPort == null){
                factoryVariables.securityInfo.schema = localStorage.getItem('winedetective_schema');
                factoryVariables.securityInfo.dbPass = localStorage.getItem('winedetective_dpPass');
                factoryVariables.securityInfo.pgPort = localStorage.getItem('winedetective_pgPort');
                if (factoryVariables.securityInfo.schema !== null && factoryVariables.securityInfo.dbPass !== null && factoryVariables.securityInfo.pgPort !== null){
                    factoryVariables.securityInfo.stop = false;
                }
            }
            return factoryVariables.securityInfo;
        }        

        var clearSecurityInfo = function(){
            localStorage.removeItem('winedetective_schema');
            localStorage.removeItem('winedetective_dpPass');
            localStorage.removeItem('winedetective_pgPort');

            factoryVariables.securityInfo.schema = '';
            factoryVariables.securityInfo.dbPass = '';
            factoryVariables.securityInfo.pgPort = '';
            factoryVariables.securityInfo.stop = 'true';
            factoryVariables.showTabs = false;
        }

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
                task: 'validate',                
                email: member.email,
                password: member.password,
                securityInfo: getSecurityInfo()
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
                varietalName : varietalName,
                securityInfo: getSecurityInfo()
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
                task: 'init',
                securityInfo: getSecurityInfo()
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
                task: 'getAllVarietals',
                securityInfo: getSecurityInfo()
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
                bottle: bottle,
                securityInfo: getSecurityInfo()
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
                task: 'getInventory',
                securityInfo: getSecurityInfo()
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
            getInventory: getInventory,
            setSecurityInfo: setSecurityInfo,
            getSecurityInfo: getSecurityInfo,
            clearSecurityInfo: clearSecurityInfo
        };
    }
]);