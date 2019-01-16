'use strict';
/* Tabbed components */

angular.module('wpApp.directives')

.directive('flyouts', ['$timeout', '$rootScope', '$animate', '$document', '$anchorScroll', '$window', '$log',
    function ($timeout, $rootScope, $animate, $document, $anchorScroll, $window, $log) {
        return {
            restrict: 'C',
            link: function (scope, iElement, iAttrs) {
                var el = angular.element(iElement),
                    footerEl = angular.element('#footer'),
                    footerHeight = footerEl.height(),
                    getDropshadowHeight = function(){
                        return footerHeight > 500 ? 6 : 0;
                    },
                    w = angular.element($window),
                    scrollTop = w.scrollTop(),
                    viewportHeight = w.height(),//Height of the visible page
                    docHeight = $document.height(),//this is the total height of our page...including parts concealed by viewport
                    dropShadowHeight = getDropshadowHeight(),
                    footerInView = (scrollTop + viewportHeight) - (docHeight - footerHeight) - dropShadowHeight,
                    bottomPosition = 0,
                    wrappers = el.find('.flyout-wrapper'),
                    view = angular.element('html'),
                    onResize = function(){
                        
                        footerHeight = footerEl.height();
                        scrollTop = w.scrollTop();
                        viewportHeight = w.height();//Height of the visible page
                        docHeight = $document.height();//this is the total height of our page...including parts concealed by viewport
                        dropShadowHeight = getDropshadowHeight();
                        footerInView = (scrollTop + viewportHeight) - (docHeight - footerHeight) - dropShadowHeight;
                        bottomPosition = 0;
                        
                        
                        
                        var flyoutsEl = angular.element('.flyouts');                          
                        if( footerInView > 0 ) {
                            //How much of the footer is in view.
                            bottomPosition = footerInView;
                            flyoutsEl.css('position', 'relative');
                            flyoutsEl.css('bottom', 'auto');
                        } else {
                            var isRelative = flyoutsEl.css('position') === 'relative';
                            if( isRelative && view.hasClass('flyout-opened') ) {
                                return;
                            }
                            bottomPosition = 0;
                            flyoutsEl.css('position', 'fixed');
                            el.css('bottom', bottomPosition + 'px');
                        }
                        
                    };
                   

                  

                    $animate.on('enter',iElement,function(el, phase){
                        view.removeClass('oversized');
                        if (phase === 'close') {
                            $timeout(function(){
                                var ht = iElement.height();
                                if(ht > viewportHeight) {
                                   view.addClass('oversized');
                                }

                            }, 125);//wait for animation to end                            
                        }
                    });
                    

                w.bind('resize', function(){
                   onResize();
                });


                //Get height of contents
                //$timeout(function(){
                $rootScope.$on('documentReady', function () {
                    w = angular.element($window);
                    footerHeight = footerEl.height();
                    onResize();
                    w.bind('scroll', function(){
                        onResize();

                    });

                });

                // el.on('click', function () {
                //     $timeout(function () {
                //         el.css('height', 'auto');
                      
                //     });
                // });
               
            }
        };
    }
])

.directive('flyout', ['PageAPI',
        function (PageAPI) {
            return {
                restrict: 'E',
                transclude: true,

                scope: false,
                controller: ['$scope', '$element', '$attrs', '$transclude', '$animate', '$timeout', '$window',
                    function ($scope, $element, $attrs, $transclude, $animate, $timeout, $window) {
                        var view = angular.element('html'),
                            w = angular.element($window),
                            initResizeTrigger = function(iElement){
                                $animate.on('enter',iElement,function(el, phase){
                                    if (phase === 'close') {
                                        $timeout(function(){
                                            w.triggerHandler('resize');
                                        }, 250);//wait for animation to end                            
                                    }
                                });
                            };
                        $scope.wrappedScope = null;
                        $scope.wrappedEl = null;
                        $scope.toggle = function () {
                            initResizeTrigger(view);
                            if ($scope.wrappedEl.hasClass('opened')) {
                                $scope.wrappedScope.opened = false;
                                view.removeClass('flyout-opened');
                                return $animate.removeClass($scope.wrappedEl, 'opened');

                            }
                            $scope.wrappedScope.opened = true;
                            view.addClass('flyout-opened');
                            return $animate.addClass($scope.wrappedEl, 'opened');
                        };

                        this.addContent = function (contentScope, contentElement) {
                            $scope.wrappedScope = contentScope;
                            $scope.wrappedScope.opened = false;
                            $scope.wrappedEl = angular.element(contentElement);
                            
                        };

                        


                    }
                ],
                template: '<div class="flyout-wrapper">' +
                    '<a ng-if="!wrappedScope.opened" class="flyout-toggle-btn" ng-click="toggle()"><i class="fa fa-plus"></i>&nbsp;&nbsp;{{wrappedScope.title}}</a>' +
                    '<a ng-if="wrappedScope.opened" class="flyout-toggle-btn" ng-click="toggle()"><i class="fa fa-minus"></i>&nbsp;&nbsp;{{wrappedScope.title}}</a>' +
                    '<div ng-transclude></div>' +
                    '</div>',
                replace: true,

            };
        }
    ])
    .directive('flyoutContent', function () {

        return {
            require: '^flyout',
            restrict: 'E',
            transclude: true,
            scope: {
                title: '@',
                id: '@'
            },
            link: function (scope, element, attrs, flyoutCtrl) {
                flyoutCtrl.addContent(scope, element);
            },
            template: '<div class="flyout-content-wrap" ng-transclude>',
            replace: true

        };
    });
