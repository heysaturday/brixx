'use strict';



/**
 * Google Map Controller
 * Required:
 * WP Rest API plugin
    * @see http://premium.wpmudev.org/blog/delivering-wordpress-content-with-web-apps-using-angularjs/
    * @see http://wp-api.org/guides/getting-started.html#getting-started
 * Google Maps API v3
 * @see https://developers.google.com/maps/documentation/javascript/reference
 * Place the following in your head tag:
    <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDSHw4gizx3Hg6k6I6BxYQ6DfNh_0wommQ"></script>

    */
/* Google Map Directive */
angular.module('wpApp.directives')



.directive('googleMap', ['EndpointsProvider', function (EndpointsProvider) {

    var controller = ['$scope', '$rootScope', '$http', '$q', '$filter', '$timeout', '$log', 'LocationListFactory', '$sanitize', '$window', '$interval', 'APP_EVENTS', 'LocationAPI', 'EndpointsProvider',
            function ($scope, $rootScope, $http, $q, $filter, $timeout, $log, LocationListFactory, $sanitize, $window, $interval, APP_EVENTS, LocationAPI, EndpointsProvider) {
                //@see https://developers.google.com/maps/documentation/javascript/styling
                var mapStyles = [{
                        featureType: 'all',
                        elementType: 'all',
                        stylers: [{
                                saturation: -100
                            } // <-- THIS
                        ]
                    }],
                    mapOptions = {
                        styles: mapStyles,
                        draggable: true,
                        disableDefaultUI: true,
                        scrollwheel: false,
                        zoomControl: true,


                    };


                $scope.markers = []; //We'll gather these then apply them to map
                $scope.api = {};
                $scope.locations = null;
                LocationAPI.getInstance()
                    .then(function (apiInstance) {
                        $scope.api = apiInstance;
                    });




                $scope.findMarkerById = function (ID) {
                    var deferred = $q.defer();
                    var marker = null;
                    if ($scope.markers) {
                        marker = $filter('filter')($scope.markers,
                            function (val, index, arr) {
                                return +val.data.ID === ID;
                            });
                        if (marker) {
                            deferred.resolve(marker[0]); //There can only be one!
                        } else {
                            deferred.resolve(null);
                        }
                    } else {
                        deferred.resolve(marker);
                    }
                    return deferred.promise;
                };

                /**
                 * Helper for building address string
                 */
                $scope.assembleAddress = function (locationOptions) {
                    var address = '';
                    address += locationOptions.street_1 ? locationOptions.street_1 + '+' : '';
                    address += locationOptions.street_2 ? locationOptions.street_2 + '+' : '';
                    address += locationOptions.city ? locationOptions.city + '+' : '';
                    address += locationOptions.state ? locationOptions.state + '+' : '';
                    address += locationOptions.zip ? locationOptions.zip + '+' : '';
                    if (address) {
                        return $sanitize(address);
                    } else {
                        return null;
                    }
                };


                // InfoWindow attachment
                // but that message is not within the marker's instance data.
                $scope.attachInfo = function (marker) {
                    var data = marker.data.locationOptions;

                    var html = '<div id="infoWindow">';
                    html += marker.data.title + '<br />';
                    html += data.street_1 ? data.street_1 + '<br />' : '';
                    html += data.street_2 ? data.street_2 + '<br />' : '';
                    html += data.city && data.state && data.zip ? data.city + ', ' + data.state + ' ' + data.zip + '<br />' : '';
                    html += '</div>';
                    var infowindow = new google.maps.InfoWindow({
                        content: html
                    });
                    marker.addListener('click', function() {
                       infowindow.open($scope.map, marker);
                    });


                };



                /**
                 * Map Bounds
                 */

                //  Create a new viewpoint bound
                $scope.bounds = new google.maps.LatLngBounds();

                $scope.getMapBound = function (marker) {
                    var deferred = $q.defer();
                    $scope.bounds.extend(marker.getPosition());
                    deferred.resolve($scope.bounds);
                    return deferred.promise;
                };

                $scope.getMapBounds = function () {
                    var promises = [];
                    //  Make an array of the LatLng's of the markers you want to show
                    angular.forEach($scope.markers, function (marker, key) {
                        promises.push($scope.getMapBound(marker));
                    });
                    return $q.all(promises);
                };





                /**
                 * Generate location markers for our map
                 */


                $scope.createMarker = function (address, info) {
                    if (!info.locationOptions.latlng) {
                        return;
                    }
                    var deferred = $q.defer();

                    //In this case it creates a marker, but you can get the lat and lng from the location.LatLng
                    var marker = new google.maps.Marker({
                        position: info.latLng,
                        data: info,
                        icon: BlogInfo.themeurl + 'assets/images/Brixx_MapMarker.png'
                    });

                    //Attach information to our marker
                    $scope.attachInfo(marker);

                    //Add a listener to our marker
                    google.maps.event.addListener(marker, 'click', function () {
                        // $scope.map.setCenter(marker.getPosition());
                        // $scope.api.changeLocation(marker.data.ID);

                    });


                    $scope.markers.push(marker);
                    deferred.resolve(marker);

                    return deferred.promise;
                };

                $scope.createLatLngObj = function (location) {
                    if (!location.hasLatLng) {
                        return;
                    }
                    var latLng = new google.maps.LatLng(+location.lat, +location.lng);
                    return latLng;
                };

                $scope.createMarkers = function () {
                    var self = this,
                        address,
                        locations = LocationListFactory.locations,
                        currentLocation = LocationListFactory.getCurrent(),
                        deferred = $q.defer(),
                        assemble = function (theLocation) {
                            if (!theLocation.hasLatLng) {
                                return false;
                            }
                            var info = {
                                'ID': theLocation.ID,
                                'title': theLocation.blogname,
                                'locationOptions': theLocation.locationOptions,
                                'latLng': $scope.createLatLngObj(theLocation)
                            };

                            var address = $scope.assembleAddress(theLocation.locationOptions);
                            if (!address) {
                                return false;
                            }
                            return {
                                'address': address,
                                'info': info
                            };
                        };
                    //console.log('Locations exist. Creating markers...');
                    $rootScope.locations = locations;

                    var promises = [];
                    if (currentLocation && +currentLocation.ID !== 1) {
                        address = assemble(currentLocation);
                        if (address) {
                            promises.push($scope.createMarker(address.address, address.info));
                        }

                    } else {
                        for (var i = 0; i < locations.length; i++) {
                            //Assemble pertinent info re: our location
                            var theLocation = locations[i];
                            address = assemble(theLocation);
                            if (!address) {
                                continue;
                            }
                            promises.push($scope.createMarker(address.address, address.info));

                        }
                    }

                    return $q.all(promises);
                };

                /**
                 * Set options for our map
                 */
                $scope.setMapOptions = function () {
                    //google.maps.controlStyle = 'azteca';
                    $scope.map.setOptions(mapOptions);
                };

                /**
                 * Stop pan on scroll for mobile devices
                 */
                var dragFlag = false;
                var start = 0, end = 0;

                function thisTouchStart(e)
                {
                    dragFlag = true;
                    start = e.touches[0].pageY;
                }

                function thisTouchEnd()
                {
                    dragFlag = false;
                }

                function thisTouchMove(e)
                {
                    if ( !dragFlag ) return;
                    end = e.touches[0].pageY;
                    window.scrollBy( 0,( start - end ) );
                }

                /**
                 * Set events for our map
                 */
                $scope.setMapEvents = function () {
                    google.maps.event.addDomListener(window, 'resize', function () {
                        var center = $scope.map.getCenter();
                        google.maps.event.trigger($scope.map, 'resize');
                        $scope.map.setCenter(center);
                    });
                    //On mobile profile...stop pan on scroll down page
                    //@see http://stackoverflow.com/questions/7534888/embed-google-maps-on-page-without-overriding-iphone-scroll-behavior
                    document.getElementById('map-canvas').addEventListener('touchstart', thisTouchStart, true);
                    document.getElementById('map-canvas').addEventListener('touchend', thisTouchEnd, true);
                    document.getElementById('map-canvas').addEventListener('touchmove', thisTouchMove, true);
                };

                /**
                 * Create the map
                 */
                $scope.initMap = function initialize() {
                    var deferred = $q.defer();

                    $scope.map = new google.maps.Map(document.getElementById('map-canvas'));
                    $scope.setMapOptions();
                    $scope.setMapEvents();

                    // To add the marker to the map, call setMap();
                    // angular.forEach($scope.markers, function(marker, key) {
                    //     marker.setMap($rootScope.map);
                    // });
                    for (var i = $scope.markers.length - 1; i >= 0; i--) {
                        $scope.markers[i].setMap($scope.map);
                        if (i === 0) {
                            //  Fit these bounds to the map
                            $scope.map.fitBounds($scope.bounds);
                            deferred.resolve();
                        }
                    }

                    return deferred.promise;
                };

                /**
                 * Our final action...create the map
                 */
                $scope.createMap = function () {
                    var deferred = $q.defer();
                    $scope.initMap().then(
                        function () {
                            $rootScope.$broadcast('MAP_READY');
                            deferred.resolve();
                        }

                    );
                    return deferred.promise;
                };



                $scope.centerOnCurrentLocation = function () {
                    if (!$scope.api.currentLocation) {
                        return;
                    }
                    $scope.findMarkerById($scope.api.currentLocation.ID)
                        .then(
                            function (marker) {
                                if (marker) {
                                    $timeout(function () {
                                        $scope.map.setCenter(marker.position);
                                        $scope.map.setZoom(12);
                                    }, 100);

                                }
                            }


                        );


                };



                /**
                 * Our promise chain
                 */
                $scope.launchPromiseChain = function () {
                    $scope.locations = $scope.api.physicalLocations;
                    $timeout(function () {
                        if (!$scope.locations.length) {
                            return;
                        }
                        $scope.createMarkers()
                            .then($scope.getMapBounds)
                            .then($scope.createMap)
                            .then($scope.centerOnCurrentLocation);


                    }, 500);

                };


                $scope.unregisterLocationWatcher = $scope.$watch(
                    function () {
                        return $scope.api.currentLocationId;
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            // Only increment the counter if the value changed
                            $scope.launchPromiseChain();
                        }
                    }
                );



                $window.onbeforeunload = function () {

                    if (typeof $scope.unregisterLocationWatcher === 'function') {
                        $scope.unregisterLocationWatcher();
                    }

                    if (typeof $scope.unregisterLocationsWatcher === 'function') {
                        $scope.unregisterLocationsWatcher();
                    }
                };





            }
        ],
        templateUrl = function (element, attributes) {
            return attributes.templateUrl || EndpointsProvider.getThemeUrl() + 'assets/app/js/components/map/map.html';
        };

    return {
        restrict: 'EA', //Default in 1.3+
        scope: {
            datasource: '='
        },
        controller: controller,
        templateUrl: templateUrl
    };


}]);
