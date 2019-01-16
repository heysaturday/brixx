'use strict';
/* Coupon Form */

angular.module('wpApp.components')

.controller('CouponFormCtrl', ['$scope', 'PageAPI', '$q', 'EmmaRes', 'toastr', '$filter', '$timeout', 'EmmaFactory', 'AdminAjaxRes',
    function ($scope, PageAPI, $q, EmmaRes, toastr, $filter, $timeout, EmmaFactory, AdminAjaxRes) {
        var api;
        $scope.isSubmitting = false;
        $scope.locations = [];

        $scope.formData = {
            fullName: '',
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

        $scope.submitCouponForm = function () {
            if (!$scope.couponForm.$valid) {
                return;
            }
            $scope.isSubmitting = true;
            return EmmaFactory.getInstance($scope.formData)
                .then(function (emma) {
                    return emma.addContact('coupon');

                })
                .then(function (dto) {
                    if (dto.error) {
                        toastr.error(dto.message, 'Error');
                        return $q.reject();

                    } else {
                        toastr.success('Thanks for signing up!');
                        return $q.when(dto);
                    }
                })
                .finally(function(){
                    $scope.isSubmitting = false;
                });

        };

    }
]);
