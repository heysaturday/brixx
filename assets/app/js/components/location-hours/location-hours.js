'use strict';


angular.module('wpApp.directives')


/**
 * locationHours is a location-aware component that displays store hours
 */
.directive('locationHours', ['$animate', 'LocationAPI', '$timeout',
    function($animate, LocationAPI, $timeout) {

        var controller = ['$scope', '$element', '$attrs', '$transclude', 'LocationAPI', '$animate', '$timeout',
                function($scope, $element, $attrs, $transclude, LocationAPI, $animate, $timeout) {

                }
            ],
            templateUrl = function(element, attributes) {
                if (attributes.templateUrl) {
                    return 'js/components/location-hours/' + attributes.templateUrl;
                }
                return 'js/components/location-hours/hours.html';
            };

        return {
            restrict: 'EA', //Default in 1.3+
            controller: controller,
            templateUrl: templateUrl,
            scope: {},
            link: function(scope, element, atts) {
                scope.parentEl = element;
                scope.parentEl.addClass('animate');
                scope.showHours = false;



                scope.locationChanged = function() {
                    $animate.removeClass(scope.parentEl, 'reveal')
                        .then(function() {
                            $timeout(function() {
                                scope.setLocation();
                            }, 250);

                        });

                };

                scope.setShowHours = function() {
                    scope.showHours = +scope.api.currentLocationId > 0;

                };

                scope.setLocation = function() {
                    scope.currentLocation = scope.api.currentLocation;
                    scope.setShowHours();
                    $animate.addClass(scope.parentEl, 'reveal');
                };


                function applyWatcher() {
                    scope.stopWatcher = scope.$watch(
                        function() {
                            return scope.api.currentLocationId;
                        },
                        function(newValue, oldValue) {
                            if (newValue !== oldValue) {
                                scope.locationChanged();
                            }
                        }
                    );
                }

                function destroyWatcher() {
                    scope.stopWatcher();
                }

                LocationAPI.getInstance()
                    .then(function(apiInstance) {
                        scope.api = apiInstance;
                        scope.setLocation();
                        applyWatcher();
                    });

            }

        };


    }
]);
