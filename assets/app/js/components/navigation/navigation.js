'use strict';

/* Navigation components */
angular.module('wpApp.navigation', []);

angular.module('wpApp.navigation')


.directive('mainNav', ['$timeout', function ($timeout) {
    var controller = ['$scope', '$element', '$attrs', '$transclude', 'MenuFactory', 'ModalService', 'GLOBALS',
            function ($scope, $element, $attrs, $transclude, MenuFactory, ModalService, GLOBALS) {
                $scope.homeUrl = BlogInfo.site;
                $scope.brandImagePath = GLOBALS.BRAND_IMAGE;

                $scope.mainNavActive = false;

                this.showMainNav = function (isMobile) {
                    if (isMobile) {
                        $scope.showMobileMainNav();
                    } else {
                        $scope.showDesktopMainNav();
                    }
                };

                $scope.showDesktopMainNav = function () {

                    $scope.mainNavActive = !$scope.mainNavActive;
                };

                $scope.showMobileMainNav = function () {

                    var templateUrl = 'main-nav-modal.html', //located in footer.php
                        modalController = 'MobileMainNavModalCtrl',
                        inputs = {
                            globals: GLOBALS

                        };
                    ModalService.showModal({
                            //templateUrl: 'main-nav-modal.html',
                            template: document.getElementById('main-nav-modal.html').innerHTML,
                            controller: modalController,
                            inputs: inputs
                        })
                        .then(function (modalInstance) {
                            $scope.modal = modalInstance;
                            $scope.modal.element.modal(); //invoke with bootstrap javascript


                        });

                };

                /**
                 * Close nav on click outside
                 */
                var inside = angular.element($element),
                    outside = angular.element('body');
                inside.on('click', function(e){
                    e.stopPropagation();
                });
                outside.on('click', function(){
                    if($scope.mainNavActive) {
                        $timeout(function(){
                            $scope.mainNavActive = false;
                        });
                    }
                });




            }
        ],
        templateUrl = function (element, attributes) {
            if (attributes.templateUrl) {
                return 'js/components/navigation/' + attributes.templateUrl;
            }
            return 'js/components/navigation/main-nav.html';
        };

    return {
        restrict: 'EA',
        scope: false,
        controller: controller,
        templateUrl: templateUrl,
        transclude: true,
        replace: true

    };
}])

.directive('mainNavToggle', function () {
    var templateUrl = function (element, attributes) {
        if (attributes.templateUrl) {
            return 'js/components/navigation/' + attributes.templateUrl;
        }
        return 'js/components/navigation/toggle-btn.html';
    };
    return {
        require: '^mainNav',
        restrict: 'EA',
        transclude: true,
        scope: {},
        link: function (scope, element, attrs, navCtrl) {
            scope.showMainNav = navCtrl.showMainNav;
            scope.isMobile = attrs.isMobile === 'true' ? true : false;
        },
        templateUrl: templateUrl,
        replace: true
    };
})

.directive('mainNavItems', ['MenuCollection', 'PageAPI', '$q', '$timeout', '$rootScope',
    function (MenuCollection, PageAPI, $q, $timeout, $rootScope) {
        var templateUrl = 'main-nav-desktop.html'; //located in footer.php
        return {
            priority: 0,
            restrict: 'EA',
            transclude: true,
            scope: false,
            link: function (scope, element, attrs, menuCtrl) {},
            templateUrl: templateUrl,
            replace: true
        };
    }
])




/**
 * @ngdoc service
 * @name wpApp.singlePlatform.MenuClass
 *
 * @description
 * Returns class representing menu items for a WordPress menu
 */
.factory('MenuClass', ['$log', '$filter', '$q',
    function ($log, $filter, $q) {

        var MenuClass = function (dto) {
            angular.extend(this, dto);
            this.init();
        };
        MenuClass.prototype = {

            init: function () {
                var self = this;
                self.sanitizeChildItems();
                self.assembleChildItems();

            },
            assembleChildItems: function () {
                var self = this;
                for (var i = 0; i < self.parentMenuItems.length; i++) {
                    var parentId = self.parentMenuItems[i].ID;
                    var children = $filter('filter')(self.childMenuItems, {
                        menu_item_parent: parentId
                    });
                    if (children.length) {
                        self.parentMenuItems[i].hasChildren = children;
                    } else {
                        self.parentMenuItems[i].hasChildren = null;
                    }
                }
            },
            sanitizeChildItems: function () {
                var self = this;
                var cleanItems = [];
                //convert id to numeric
                angular.forEach(self.childMenuItems, function (item) {
                    item.menu_item_parent = +item.menu_item_parent;
                    cleanItems.push(item);
                });
                self.childMenuItems = cleanItems;

            },

            constructor: MenuClass
        };

        return MenuClass;
    }
])




/**
 * @ngdoc service
 * @name wpApp.menuItems.MenuFactory
 * @description
 * Loads locations list data from server
 */
.service('MenuFactory', ['$q', 'MenuClass', '$filter', 'AdminAjaxRes', '$log', 'toastr',
    function ($q, MenuClass, $filter, AdminAjaxRes, $log, toastr) {
        var MenuFactory = {

            load: function (siteId) {
                var self = this;
                return AdminAjaxRes.get({
                        action: 'get_main_nav',
                        site_id: siteId
                    })
                    .$promise
                    .then(
                        function (dto) {
                            if (dto.error) {
                                toastr.error(dto.message, 'Error');
                                return $q.reject();
                            }
                            return new MenuClass(dto.data);

                        },
                        function (err) {
                            toastr.error(err, 'Error');
                        }

                    );

            },

            loadSpecials: function (siteId) {
                var self = this;
                return AdminAjaxRes.get({
                        action: 'get_specials_nav',
                        site_id: siteId
                    })
                    .$promise
                    .then(
                        function (dto) {
                            if (dto.error) {
                                toastr.error(dto.message, 'Error');
                                return $q.reject();
                            }
                            return new MenuClass(dto.data);

                        },
                        function (err) {
                            toastr.error(err, 'Error');
                            return $q.reject();
                        }
                    );

            },

            loadSocialItems: function (siteId) {
                var self = this;
                return AdminAjaxRes.get({
                        action: 'get_social_nav',
                        site_id: siteId
                    })
                    .$promise
                    .then(
                        function (dto) {
                            if (dto.error) {
                                toastr.error(dto.message, 'Error');
                                return $q.reject();
                            }
                            return new MenuClass(dto.data);

                        },
                        function (err) {
                            toastr.error(err, 'Error');
                            return $q.reject();
                        }
                    );

            }


        };

        return MenuFactory;


    }
])

/**
 * This directive helps us manage submenu behaviors
 */

.directive('menuUl', ['$timeout', 'PageAPI',
    function ($timeout, PageAPI) {


        return {
            scope: false,
            priority: 0,
            restrict: 'C',
            link: function (scope, element) {
                var init = function () {
                    var parent = element;
                    var submenus = parent.find('.sub-menu');
                    var hoverElements = angular.element(parent.find('.sub-menu').prev());
                    hoverElements.mouseenter(function () {
                        var el = angular.element(this);
                        var submenu = angular.element(el.next('.sub-menu'));
                        $timeout(function () {
                            submenu.addClass('hovered');
                        }, 100);

                        submenu.hover(
                            function () {
                                $timeout(function () {
                                    submenu.addClass('hovered');
                                }, 100);

                            },
                            function () {
                                submenu.addClass('fadeout');
                                $timeout(function () {
                                    submenu.removeClass('hovered');
                                    submenu.removeClass('fadeout');
                                }, 250);
                            }
                        );

                    });
                    hoverElements.mouseleave(function () {
                        var el = angular.element(this);
                        var submenu = angular.element(el.next('.sub-menu'));
                        $timeout(function () {
                            submenu.removeClass('hovered');
                        }, 100);

                    });

                    submenus.mouseenter(function () {
                        var el = angular.element(this),
                            parentTab = angular.element(el.prev('a'));
                        if (el.hasClass('hovered')) {
                            parentTab.addClass('active');
                        }

                    });
                    submenus.mouseleave(function () {
                        var el = angular.element(this),
                            parentTab = angular.element(el.prev('a'));
                        if (el.hasClass('hovered')) {
                            parentTab.removeClass('active');
                        }

                    });
                };

                PageAPI.getInstance(scope.page)
                    .then(function (apiInstance) {
                        $timeout(function(){
                            init();
                        });
                    });







            }
        };


    }
]);
