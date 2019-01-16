'use strict';


angular.module('wpApp.directives')


/**
 * The Location Selector is our application wide location selector widget. Use the templates to modify presentation. But the core behavior is common throughout:
 * Click the component to display locations. If no location is selected, present a common message.
 * throughout the application.
 */
.directive('locationSelector', ['$timeout', 'AdminAjaxRes', 'toastr',
    function($timeout, AdminAjaxRes, toastr) {
    var controller = ['$scope', '$element', '$attrs', '$transclude', 'LocationAPI', '$animate', '$timeout',
            function($scope, $element, $attrs, $transclude, LocationAPI, $animate, $timeout) {
                $scope.hasHeading = false;
                if($attrs.hasHeading==='true') {
                    $scope.hasHeading = true;
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

                $scope.parentElement = $element;
                //$scope.parentElement.addClass('animate');
                $scope.noLocationMessage = 'Select your location';
                $scope.locationLabel = '';

                function locationChanged() {
                    $animate.removeClass($scope.parentElement, 'reveal')
                        .then(function() {
                            $timeout(function() {
                                setLocation();
                            }, 250);

                        });

                }
                function buildQueryString() {
                    if(!$scope.currentLocation) {
                        return;
                    }
                    var loc = $scope.currentLocation;
                    var q = loc.locationOptions.street_1 + ' ' + loc.locationOptions.street_2 + ' ' + loc.locationOptions.city + ' ' +
                        loc.locationOptions.state + ' ' + loc.locationOptions.zip;
                        return q;
                }

                function buildStreetAddress() {
                    if(!$scope.currentLocation) {
                        return;
                    }
                    
                    var streetAddress = '';
                    streetAddress += $scope.currentLocation.locationOptions.street_1;

                    if($scope.currentLocation.locationOptions.street_2) {
                        streetAddress += ', ';
                        streetAddress += $scope.currentLocation.locationOptions.street_2;
                    }
                    streetAddress += ', ';
                    streetAddress += $scope.currentLocation.locationOptions.city + ', ';
                    streetAddress += $scope.currentLocation.locationOptions.state + ' ' + $scope.currentLocation.locationOptions.zip;
                    return streetAddress;
                }

                function setLocation() {
                    $scope.currentLocation = $scope.api.currentLocation;
                    $scope.locationLabel = $scope.api.currentLocationId > 0 ? $scope.currentLocation.blogname : $scope.noLocationMessage;
                    $scope.mapQueryString = buildQueryString();
                    $scope.streetAddress = buildStreetAddress();
                    $animate.addClass($scope.parentElement, 'reveal');
                }

                LocationAPI.getInstance()
                    .then(function(apiInstance) {
                        $scope.api = apiInstance;
                        setLocation();
                        applyWatcher();
                    });

            }
        ],
        templateUrl = function(element, attributes) {
            if (attributes.templateUrl) {
                return 'js/components/location-selector/' + attributes.templateUrl;
            }
            return 'js/components/location-selector/default-location-selector.html';
        };

    return {
        scope: {},
        restrict: 'EA', //Default in 1.3+
        controller: controller,
        templateUrl: templateUrl,
        link: function (scope, iElement, iAttrs) {
            var el = angular.element(iElement),
                table = angular.element(el.find('.table')),
                markerCell = angular.element(table.find('.cell.marker')),
                locationCell = angular.element(table.find('.cell.location')),
                isHero = el.parents('#brixx-hero').length>0,
                isLocationTable = el.parents('#brixx-location-table').length>0,
                content = el.find('h5'),
                getMenuHref = function(){
                    AdminAjaxRes.save(
                        {
                            action: 'get_admin_options',
                            formData: {
                                slug: 'default_view_menu_href'
                            }
                        }
                    )
                    .$promise
                    .then(
                        function(dto) {
                            if (dto.error) {
                                toastr.error(dto.message, 'Error');

                            }
                            $timeout(function(){
                                scope.viewMenuHref = dto.data;
                            });

                        },
                        function(err) {
                            toastr.error(err, 'Error');
                        }
                    );
                };
                scope.viewMenuHref = '';
                if(!scope.viewMenuHref && isLocationTable) {
                    getMenuHref();
                }

            //if ( isHero ) {
                var locationWatcher = scope.$watch(
                  // This function returns the value being watched. It is called for each turn of the $digest loop
                  function() { return scope.locationLabel.length; },
                  // This is the change listener, called when the value returned from the above function changes
                  function(newValue, oldValue) {
                    if ( newValue !== oldValue ) {
                      if(newValue>15){
                        angular.element(content).addClass('multiline');
                      }
                    }
                  }
                );


                // markerCell.css('width', '30%');
                // markerCell.css('text-align', 'right');
                // locationCell.css('width', '70%');
                // locationCell.css('text-align', 'left');

            //}
            scope.$on('destroy', function(){
               if(angular.isFunction(locationWatcher)){
                    locationWatcher();
               }
            });
        }


    };


}]);
