'use strict';

/**
 * scrollBtn
 * simply scroll btn
 */
angular.module('wpApp.directives')


.directive('scrollBtn', ['$timeout',
    function($timeout) {

    var controller = ['$scope', '$element', '$window',
            function($scope, $element, $window) {

            }
        ],
        templateUrl = function(element, attributes) {
            if (attributes.templateUrl) {
                return 'js/components/scroll-btn/' + attributes.templateUrl;
            }
            return 'js/components/scroll-btn/scroll-btn.html';
        };

    return {
        restrict: 'EA', //Default in 1.3+
        scope: {},
        controller: controller,
        templateUrl: templateUrl,
        link: function(scope, iElement, iAttrs, controller) {            
        }
    };


}]);
