'use strict';

/**
 * Loader
 * Our loading spinner directive
 */
angular.module('wpApp.directives')


.directive('loader', ['$rootScope', '$animate',
    function($rootScope, $animate) {

    var controller = ['$rootScope', '$scope', '$element', '$attrs', '$transclude', '$animate',
            function($rootScope, $scope, $element, $attrs, $transclude, $animate) {
                $scope.hidden = false;
                


            }
        ],
        templateUrl = function(element, attributes) {
            if (attributes.templateUrl) {
                return 'js/components/loader/' + attributes.templateUrl;
            }
            return 'js/components/loader/loader.html';
        };

    return {
        restrict: 'EA', //Default in 1.3+
        scope: {},
        controller: controller,
        templateUrl: templateUrl,
        link: function(scope, iElement, iAttrs, controller) {
            $rootScope.$on('loading:progress', function(){
                scope.hidden = false;
                $animate.addClass(iElement,'reveal');
            });
            $rootScope.$on('loading:finish', function(){
                $animate.removeClass(iElement,'reveal')
                    .then(function(){
                        scope.hidden = true;
                    });
            });
            
        }
    };


}]);
