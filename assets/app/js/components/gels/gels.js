'use strict';


angular.module('wpApp.components')

.directive('gels', ['$interval', '$timeout',
    function ($interval, $timeout) {
        return {
            scope: true,
            restrict: 'C',
            link: function (scope, iElement, iAttrs) {
                var flipContainers = iElement.find('.flip-container'),
                    i = 0,
                    howManyTimes = flipContainers.length + 1,
                    flipDelay = 3000,
                    flipBack = function () {
                        for (var z = 0; z < flipContainers.length; z++) {
                            angular.element(flipContainers[z]).toggleClass('hover');
                        }
                        i = 0;
                        init();
                    },

                    init = function () {
                        i++;
                        //First container flips 3 seconds after page load
                        var container = angular.element(flipContainers[i - 1]);
                        if (i === 1 && i < howManyTimes) {
                            $timeout(function () {
                                container.toggleClass('hover');
                                init();
                            }, 4000);
                            return;
                        }
                        //Subsequent containers follow by 3 seconds each
                        if (i > 1 && i < howManyTimes) {
                            $timeout(function () {
                                container.toggleClass('hover');
                                init();

                            }, 3000);
                            return;
                        }
                        $timeout(flipBack, 3000);
                    };
               
                $timeout(function () {
                    howManyTimes = flipContainers.length + 1;
                    init();
                });

            }
        };
    }
]);
