const schoolsApp = angular.module('schoolsApp', ['ngCookies']);

schoolsApp.controller('schoolsController', function($rootScope, $scope, $http, $filter, $cookies) {
    $scope.schoolsToCompare = [];

    $http.get('/api/schools/all')
        .then(function (response) {
            $scope.schools = response.data;
            $scope.filtered = $scope.schools;
            $scope.totalSchools = $scope.schools.length;
            $scope.limit = 20;
            loadCookies();
            $('#snm-school-list-loading').hide();
        }, function (error) {
            console.log(error);
        });

    $scope.$watch('search', function (search) {
        if (search) {
            $scope.filtered = $scope.schools;
            Object.keys(search).forEach((filter) => {
                if (search[filter]) {
                    if (filter !== "text") {
                        $scope.filtered = $scope.filtered.filter((school) => {
                            if (school[filter] === search[filter]) return true;
                        });
                    } else {
                        $scope.filtered = $filter('filter')($scope.filtered, search[filter]);
                    }
                }
            });
            $scope.totalSchools = $scope.filtered.length;
            if ($scope.totalSchools < 20 || $scope.totalSchools < $scope.limit) {
                $scope.limit = $scope.totalSchools;
            } else if ($scope.totalSchools >= 20 && $scope.limit < 20) {
                $scope.limit = 20;
            }
        }
    }, true);

    $scope.increaseLimit = () => {
        $scope.limit += 20;
        if ($scope.limit > $scope.totalSchools) {
            $scope.limit = $scope.totalSchools;
        }
    };

    $scope.noLimit = () => {
        $scope.limit = $scope.totalSchools;
    };

    $scope.isComparing = (school) => {
        const filtered = $filter('filter')($scope.schoolsToCompare, { code: school.code }, true);
        return filtered.length > 0;
    };

    $scope.addComparing = (school) => {
        $scope.schoolsToCompare.push({
            'code': school.code,
            'name': school.name
        });
        saveCookies();
    };

    $scope.removeComparing = (school) => {
        $scope.schoolsToCompare.forEach((tempSchool) => {
            if (tempSchool.code === school.code) {
                $scope.schoolsToCompare.splice($scope.schoolsToCompare.indexOf(tempSchool), 1);
            }
        });
        saveCookies()
    };

    const saveCookies = () => {
        const schools = [];
        $scope.schoolsToCompare.forEach((school) => schools.push(school));
        $cookies.put('schools', JSON.stringify(schools));
    };

    const loadCookies = () => {
        const cookies = $cookies.get('schools');
        if (cookies) {
            $scope.schoolsToCompare = JSON.parse($cookies.get('schools'));
        }
    };
});
