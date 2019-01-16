'use strict';

/* Directives */
angular.module('wpApp.directives', []);

angular.module('wpApp.directives')
    /**
     * App version
     */
    .directive('appVersion', ['version', function(version) {
        return function(scope, elm, attrs) {
            elm.text(version);
        };
    }])

/**
 * Prevent default on anchor tags under conditions
 */
.directive('a', function() {
    return {
        restrict: 'E',
        link: function(scope, elem, attrs) {
            if(attrs.ngClick || attrs.href === '' || attrs.href === '#'){
                elem.on('click', function(e){
                    e.preventDefault();
                });
            }
        }
   };
})

/**
 * This directive assigns an 'active' class to an element when it reaches the top of the screen
 */
.directive('atTop', function($window) {
    return {
        scope: {},
        link: function(scope, element, attrs) {
            var windowEl = angular.element($window);
            var subjEl = angular.element(element);
            var handler = function() {
                scope.scroll = windowEl.scrollTop();
                scope.elementScroll = subjEl.prop('offsetTop');
                var delta = scope.elementScroll - scope.scroll;
                if(delta <= 0) {
                	subjEl.addClass('active');
                } else {
                	subjEl.removeClass('active');
                }
            };
            windowEl.on('scroll', scope.$apply.bind(scope, handler));
            handler();
        }
    };
})
/**
 * passServerValue simple directive for passing values from form controls to the angular controller
 */
.directive('passServerValue', [function () {
    return {
        scope: false,
        restrict: 'A',
        link: function (scope, iElement, iAttrs) {
            scope.formData[iAttrs.name] = iAttrs.value;
        }
    };
}])
.directive('integer', function () {
        return {
            require: 'ngModel',
            link: function (scope, elm, attrs, ctrl) {
                var INTEGER_REGEXP = /^\-?\d+$/;
                ctrl.$validators.integer = function (modelValue, viewValue) {
                    if (ctrl.$isEmpty(modelValue)) {
                        // consider empty models to be valid
                        return true;
                    }

                    if (INTEGER_REGEXP.test(viewValue)) {
                        // it is valid
                        return true;
                    }

                    // it is invalid
                    return false;
                };
            }
        };
    })
    .directive('equals', [function () {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, elem, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // watch own value and re-validate on change
                scope.$watch(attrs.ngModel, function () {
                    validate();
                });

                // observe the other value and re-validate on change
                attrs.$observe('equals', function (val) {
                    validate();
                });

                var validate = function () {
                    // values
                    var val1 = ngModel.$viewValue;
                    var val2 = attrs.equals;

                    // set validity
                    if (val1 || val2) {
                        ngModel.$setValidity('equals', !val1 || !val2 || val1.toLowerCase() === val2.toLowerCase());
                    }
                };
            }
        };
    }]);
