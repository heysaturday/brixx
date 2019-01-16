'use strict';

angular.module('wpApp.modals', []);
angular.module('wpApp.modals')


.controller('EmailModalController', ['$scope', 'close', 'globals',
    function ($scope, close, globals) {
        $scope.brandImagePath = globals.BRAND_IMAGE;
        $scope.onClose = function (result) {
            close(result, 500); // close, but give 500ms for bootstrap to animate
        };

    }
])


/**
 * MainNavCtrl
 * controller for our modal window
 */
.controller('MobileMainNavModalCtrl', function ($scope, close, globals) {
    $scope.brandImagePath = globals.BRAND_IMAGE;
    $scope.currentPageId = PostInfo.ID;

    $scope.close = function () {
        //delay for bootstrap anim
        close(angular.noop, 1000);
    };


})

/**
 * LocationsWindowCtrl
 * controller for our modal window
 */
.controller('LocationsWindowCtrl', ['$scope', 'close', 'LocationAPI', 'globals', 'GeolocationRes', '$q', 'LocationListFactory', '$filter', 'GeoClass', 'toastr', '$timeout', '$document',
    function ($scope, close, LocationAPI, globals, GeolocationRes, $q, LocationListFactory, $filter, GeoClass, toastr, $timeout, $document) {
        $scope.brandImagePath = globals.BRAND_IMAGE;
        $scope.locations = null;
        $scope.filteredLocations = null;
        LocationAPI.getInstance()
            .then(function (apiInstance) {
                $scope.api = apiInstance;
                $scope.states = $scope.api.statesCollection;
                $scope.currentLocation = $scope.api.currentLocation;
            });
        var getGeoObject = function () {
                return GeolocationRes.get({
                        region: $scope.formData.region
                    })
                    .$promise
                    .then(
                        function (dto) {
                            if (dto.error) {
                                return $q.reject(dto.message);
                            }
                            return dto;

                        }
                    );
            },
            assembleObject = function (dto) {
                var geo = new GeoClass();
                angular.extend(geo, dto.data);
                geo.lng = dto.data.lon;
                return $q.when(geo);
            },
            getLocationList = function (geo) {
                LocationListFactory.getNearest(geo)
                    .then(function (sorted) {
                        $timeout(function(){
                            $scope.filteredLocations = $filter('filter')(sorted, function (val, index, arr) {
                                return val.ID > 1;
                            });
                            $scope.filteredLocations = $scope.filteredLocations.slice(0,6);
                        });                        
                    });

            };
            

        $scope.formData = {
            region: ''
        };

        $scope.clearFilter = function(){
            $scope.formData.region = '';
            $scope.filteredLocations = null;
            var form = this.geosearch;
            form.$rollbackViewValue();
        };
        $scope.findNearest = function () {
            var form = this.geosearch;
            if (!form.$valid) {
                return;
            }
            getGeoObject()
                .then(assembleObject)
                .then(getLocationList)
                .catch(function (err) {
                    toastr.error(err, 'Geo Error');
                });

        };


        $scope.onSelect = function (location) {
            changeLocation(location);
            $scope.close();

        };

        $scope.close = function () {
            // delay for bootstrap anim
            close($scope.currentLocation, 1000);

        };

        function changeLocation(location) {
            $scope.currentLocation = location;
        }

        $scope.$on('vAccordion:onExpandAnimationEnd', function(e){
            var paneEl = e.targetScope.paneElement,
                firstEl = angular.element(paneEl.find('li:first-child a')),
                offset = 59,
                duration = 500,
                wrap = angular.element('.modal-body');
           
            wrap.scrollToElement(firstEl, offset, duration);
            //scroll-to="{{state.group_id}}"
        });


    }
])

/**
 * Add an oversized style to our html wrapper if spawned content exceeds viewport
 */
.directive('checkOversized', ['$animate', '$timeout', '$rootScope', '$window',
    function ($animate, $timeout, $rootScope, $window) {
    return {
        restrict: 'A',
        link: function (scope, iElement, iAttrs) {
            var view = angular.element('html'),
                content = angular.element(iElement.find('.modal-content')),
                w = angular.element($window),
                viewportHeight = w.height();//Height of the visible page;

            $animate.on('enter',iElement,function(el, phase){
                iElement.removeClass('oversized');
                if (phase === 'close') {
                    $timeout(function(){
                        var ht = content.height();
                        if(ht > viewportHeight) {
                           iElement.addClass('oversized');
                        }
                    }, 125);//wait for animation to end                            
                }
            });
            iElement.on('hidden.bs.modal',function(){
                iElement.removeClass('oversized');
            });





            //Get height of contents
            $rootScope.$on('documentReady', function () {
                w = angular.element($window);
                viewportHeight = w.height();//Height of the visible page  
            });
        }
    };
}]);
