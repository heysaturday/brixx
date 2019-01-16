'use strict';

angular.module('wpApp.components')

/**
 * Dynamically append Single Platform food menu items to existing WordPress nav
 */

.directive('foodMenuItems', ['$timeout', 'PageAPI', 'MenuCollection', '$q',
    function ($timeout, PageAPI, MenuCollection, $q) {
        return {
            priority: 0,
            restrict: 'EA',
            transclude: false,
            scope: true,
            controller: ['$scope', function ($scope) {
                var menus = [],
                    setMenuCollection = function () {
                        if (!$scope.api.locationApi.currentLocation) {
                            return $q.reject();
                        }
                        var menuItems = $scope.api.locationApi.getCurrentMenus(),
                            menuCollection = new MenuCollection(menuItems);
                        return $q.when(menuCollection);
                    };

                this.addMenu = function (menu) {
                    menus.push(menu);
                };

                PageAPI.getInstance($scope.page)
                    .then(function (apiInstance) {
                        $scope.api = apiInstance;
                        setMenuCollection()
                            .then(function(menuCollection){
                                for (var i = 0; i < menus.length; i++) {
                                    menus[i].installSubMenu(menuCollection);
                                }
                        });
                });

            }],
            replace: false
        };
    }
])

.directive('addFoodMenuItems', ['$q', 'PageAPI', 'MenuCollection', '$timeout', '$log',
    function ($q, PageAPI, MenuCollection, $timeout, $log) {
        return {
            require: 'foodMenuItems',
            priority: 5,
            restrict: 'EA',
            scope: false,
            link: function (scope, iElement, iAttrs, menuCtrl) {
                menuCtrl.addMenu(scope);
                var nav = angular.element(iElement),
                    anchors = nav.find('.menu-ul > li > a'),
                    foodMenuParent,
                    installHtml = function (html) {
                        foodMenuParent.after(html);
                    };

                if (anchors.length) {
                    for (var i = 0; i < anchors.length; i++) {
                        var a = angular.element(anchors[i]);
                        var href = a.attr('href').toLowerCase();
                        if (href.indexOf('menu') > -1) {
                            foodMenuParent = a;
                            break;
                        }
                    }
                }
                scope.installSubMenu = function (menuCollection) {
                        if (foodMenuParent) {
                            menuCollection.buildNavHtml()
                                .then(installHtml);
                        }
                };




            }
        };
    }
]);
