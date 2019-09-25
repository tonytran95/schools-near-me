angular.module('schoolsApp', [])
    .controller('schoolsController', function($scope, $http) {
        $http.get('/api/schools?distance=9999999&longitude=151.2086763&latitude=-33.8682894')
            .then(function(response) {
                console.log(response.data);
                $scope.schools = response.data;
                $('#snm-school-list-loading').hide();
            }, function(error) {
                console.log(error);
            });
    });