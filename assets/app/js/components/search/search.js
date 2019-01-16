'use strict';


/* Navigation module */
angular.module('wpApp.search', []);
angular.module('wpApp.search')

.directive('mobileSearchForm', ['$log',
    function($log) {
        return {
            restrict: 'E',
            templateUrl: function(element, attributes) {
                return attributes.templateUrl || 'js/components/search/search-mobile.html';
            },
            scope: {
                formAction: '@'
            },
            link: function(scope, element) {
                var container = angular.element(element);
                var wrap = container.find('#search_form_wrap');
                scope.toggle = function() {
                    wrap.toggleClass('closed');

                };

            }
        };
    }
]);