'use strict';

/**
 * Push Menu
 * Get control of our multi-level nav on mobile.
 */
angular.module('wpApp.directives')


.directive('pushMenu', ['$log', '$timeout',
    function($log, $timeout) {

    return {
        priority: 15,//so other dom manipulation can happen first
        restrict: 'EA', //Default in 1.3+
        scope: false,
        link: function(scope, iElement, iAttrs, controller) {
            //$log.log('push');
            var onClick=function(event){
                    event.preventDefault();
                        var subject = angular.element(event.currentTarget),
                        relevantSubmenu = subject.next('.sub-menu');

                    scope.faClose.addClass('hidden');
                    relevantSubmenu.addClass('pushmenu-open');
                    scope.$apply();
                },
                    goBack = function(){
                        for (var i = 0; i < scope.menusLeft.length; i++) {
                            var menuEl = angular.element(scope.menusLeft[i]);
                            menuEl.removeClass('pushmenu-open');
                            //menuEl.find('.menu-back-btn').remove();
                        }
                        scope.faClose.removeClass('hidden');
                    };
                $timeout(function(){//Wait a digest cycle so our food-submenu directive can do it's work.
                    scope.navEl = iElement;
                    scope.navEl.addClass('push-menu-parent');
                    scope.menusLeft = scope.navEl.find('.sub-menu');
                    //iOS Z stacking bug causes modal footer X to bleed thru the submenu. Hack a fix here.
                    scope.faClose = angular.element('.modal-footer .fa-times');


                    for (var i = 0; i < scope.menusLeft.length; i++) {
                        var menuEl = angular.element(scope.menusLeft[i]);
                        menuEl.addClass('pushmenu pushmenu-left');
                        menuEl.prev('a').on('click', onClick);
                        menuEl.prepend('<li class="menu-back-btn"><a>Back&nbsp;&nbsp;<i class="fa fa-chevron-right"></i></></li>').on('click', goBack);

                    }
                });

        }
    };


}]);


