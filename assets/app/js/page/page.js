'use strict';

angular.module('wpApp.pages', []);
/**
 * The Location Wrap directive serves as parent directive for all location-aware components. It supplies child directives with location information
 * and provides a common interface for location changes.
 */
angular.module('wpApp.pages')



.directive('page', [
    function() {

        var controller = ['$rootScope', '$scope', '$element', '$attrs', '$transclude', 'PageAPI', 'GeoFactory', 'toastr', '$timeout', '$q', '$animate', 'APP_EVENTS',
            function($rootScope, $scope, $element, $attrs, $transclude, PageAPI, GeoFactory, toastr, $timeout, $q, $animate, APP_EVENTS) {
                $rootScope.$broadcast('loading:progress');
                var controls = [];
                this.addControl = function(scope){
                    controls.push(scope);  
                };
                $scope.page = angular.element($element);

                PageAPI.getInstance( $scope.page)
                    .then(
                        function(apiInstance){
                            $scope.api = apiInstance; 
                            for (var i = 0; i < controls.length; i++) {
                                controls[i].api = $scope.api;
                            }
                        },
                        function(err){
                            toastr.error(err, 'Error');
                        }
                    ); 


               


            }
        ];

        return {
            scope: true,
            restrict: 'EA', //Default in 1.3+
            controller: controller,
            transclude: false,
            replace: false,
            link: function postLink(scope, elmt, attrs, pageCtrl) {}
        };


    }
]);


