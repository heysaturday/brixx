'use strict';
/* Beer News Form */

angular.module('wpApp.components')

.controller('BeerNewsFormCtrl', ['$scope', 'PageAPI', '$q', 'EmmaRes', 'toastr', '$filter', '$timeout', 'EmmaFactory', 'AdminAjaxRes',
    function ($scope, PageAPI, $q, EmmaRes, toastr, $filter, $timeout, EmmaFactory, AdminAjaxRes) {
        var api;

        $scope.locations = [];

        $scope.formData = {
            firstName: '',
            lastName: '',
            emailAddress: '',
            locationId: 'undefined',
            locationName: '',
            mailingListId: []
        };

        PageAPI.getInstance($scope.page)
            .then(function (apiInstance) {
                api = apiInstance;
                $scope.locations = apiInstance.locationApi.physicalLocations;
                $scope.formData.locationId = apiInstance.currentLocation ? +apiInstance.currentLocation.ID : '';
            });

        $scope.submit = function () {
            if (!$scope.beerNewsForm.$valid) {
                return;
            }
            return EmmaFactory.getInstance($scope.formData)
                .then(function (emma) {
                    emma.addContact('beer_news')
                        .then(function (dto) {
                            if (dto.error) {
                                toastr.error(dto.message, 'Error');
                                return $q.reject();

                            } else {
                                toastr.success('Thanks for signing up.');
                                //Set location server side
                                AdminAjaxRes.save({
                                    action: 'rh-fire-beer-news-success',
                                    formData: $scope.formData
                                });
                                return $q.when(dto);
                            }
                        });
                });

        };

    }
]);
