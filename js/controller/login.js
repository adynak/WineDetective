wineDetective.controller('LoginController', ['$scope', '$http', '$location', 'Data', '$rootScope', '$routeParams', 'toaster',
    function($scope, $http, $location, Data, $rootScope, $routeParams, toaster) {


        Data.init();

		$scope.prompts = txtLogin;

		$scope.login = function() {

            var member = $scope.member;
            if (typeof(member) == 'undefined' || 
            	(member.email == "" && member.password == "")
            ) member = {email:'guest',password:'guest',onlineID:'guest'};

            Data.validateCredentials(member).then(function(response) {
                if (response.validated == true) {

                    Data.setAvaCategoryList();
                    Data.setVarietalCategoryList();
                    
                    // use the factory to send the value to the tabs controller
                    Data.setShowTabs(response.validated);
                    Data.setCurrentMember(response);
                    if (member.email == 'guest'){
                        $location.path('/varietal');
                    } else {
                        $location.path('/varietal');
                    }

                    toaster.pop('success', "", txtLogin.credentialsValid, 3000, 'trustedHtml');
                } else {
                    Data.setCurrentMember('');
                    $scope.invalidMessage = txtLogin.credentialsInvalid;
                    toaster.pop('error', "", txtLogin.credentialsInvalid, 3000, 'trustedHtml');
                }

            }, function(err) {
                $scope.invalidMessage= err;
                toaster.pop('error', "", txtLogin.loginError, 3000, 'trustedHtml');                
            });

        };

    }
]);