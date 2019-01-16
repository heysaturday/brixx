'use strict';

/**
 * notification Issues notification alerts from a location's theme options page
 */


angular.module('wpApp.components')

.directive('notification', [
    function() {

    var controller = ['$scope', '$element', '$attrs', '$transclude', 'LocationAPI', '$animate', '$timeout', 'NotificationFactory','toastr',
            function($scope, $element, $attrs, $transclude, LocationAPI, $animate, $timeout, NotificationFactory, toastr) {
                $scope.myNotification = '';
                $scope.iconUrl = BlogInfo.themeurl + '/assets/images/notification-icon.png';
                $scope.parentEl = $element;
                $scope.pageWrap = angular.element('#page_wrap');
                //$scope.parentEl.addClass('animate');


                function setNotification(){

                    NotificationFactory.getInstance($scope.api.currentLocationId)
                        .then(
                            function(dto) {
                                if (dto.error) {
                                    toastr.error(dto.message, 'Error');
                                }
                                $scope.myNotification = dto.message;
                                if($scope.myNotification) {
                                    $scope.pageWrap.addClass('has-notification');
                                } else {
                                    $scope.pageWrap.removeClass('has-notification');
                                }
                                applyWatcher();
                            },
                            function(err) {
                                toastr.error(err, 'Error');
                            }
                        );
                }

                function applyWatcher() {
                    $scope.stopWatcher = $scope.$watch(
                        function() {
                            return $scope.api.currentLocationId;
                        },
                        function(newValue, oldValue) {
                            if (newValue !== oldValue) {
                                locationChanged();
                            }
                        }
                    );
                }

                $scope.destroyWatcher = function() {
                    $scope.stopWatcher();
                };

                function locationChanged() {
                     $timeout(function() {
                                setLocation();
                            }, 250);
                    // $animate.removeClass($scope.parentEl, 'reveal')
                    //     .then(function() {
                    //         $timeout(function() {
                    //             setLocation();
                    //         }, 250);

                    //     });

                }

                function setLocation(){
                    $scope.currentLocation = $scope.api.currentLocation;
                    setNotification();
                    //$scope.myNotification = $scope.currentLocation && $scope.currentLocation.notification ? $scope.currentLocation.notification: '';
                    //$animate.addClass($scope.parentEl, 'reveal');
                }

                LocationAPI.getInstance()
                    .then(function(apiInstance){
                        $scope.api = apiInstance;
                        setLocation();

                    });

            }
        ],
        templateUrl = function(element, attributes) {
            if(attributes.templateUrl) {
                return 'js/components/notification/' + attributes.templateUrl;
            }
            return 'js/components/notification/default-notification.html';
        };

    return {
        restrict: 'EA', //Default in 1.3+
        controller: controller,
        templateUrl: templateUrl,
        scope: {},
        link: function(scope, el, attr){
        }
    };


}]);
