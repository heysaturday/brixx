'use strict';
angular.module('wpApp.menuPages', []);
/**
 * The Location Wrap directive serves as parent directive for all location-aware components. It supplies child directives with location information
 * and provides a common interface for location changes.
 */
angular.module('wpApp.menuPages')


.directive('menuPage', [
    function() {

        var controller = ['$rootScope', '$scope', '$element', '$attrs', '$transclude', 'PageAPI', 'MenuCollection', 'toastr', '$location', '$timeout', 'AdminAjaxRes',
            function($rootScope, $scope, $element, $attrs, $transclude, PageAPI, MenuCollection, toastr, $location, $timeout, AdminAjaxRes) {
                $rootScope.$broadcast('loading:progress');
                $scope.page = angular.element($element);
                $scope.menuCollection = null;
                $scope.currentMenu = null;
                var getMenuId = function() {
                        var post_id = +PostInfo.ID;
                        return AdminAjaxRes.save({
                                action: 'get_custom_meta',
                                formData: {
                                    slug: 'rh_menu_id',
                                    postId: post_id
                                }
                            })
                            .$promise
                            .then(
                                function(dto) {
                                    if (dto.error) {
                                        toastr.error(dto.message, 'Error');

                                    }
                                    return +dto.data;

                                },
                                function(err) {
                                    toastr.error(err, 'Error');
                                }
                            );
                    },
                    setPageTitle = function() {
                        $scope.page_title = 'Starters';
                    },
                    noMenuAlert = function() {
                        toastr.warning('Please select a location to view menu.', 'No Location Selected');
                    },
                    setMenus = function() {
                        if (!$scope.api.locationApi.currentLocation) {
                            noMenuAlert();
                            return;
                        }
                        var menus = $scope.api.locationApi.getCurrentMenus();
                        $scope.menuCollection = new MenuCollection(menus);
                    },

                    getDefaultBeerMenu = function(menuId) {
                        var post_id = +PostInfo.ID;
                        return AdminAjaxRes.save({
                                action: 'get_default_beer_menu_id'
                            })
                            .$promise
                            .then(
                                function(dto) {
                                    if (dto.error) {
                                        toastr.error(dto.message, 'Error');
                                    }
                                    var defaultBeerMenuId = +dto.data || false;
                                    var args = {
                                        defaultBeerMenuId: defaultBeerMenuId,
                                        menuId: menuId
                                    };
                                    return args;
                                },
                                function(err) {
                                    toastr.error(err, 'Error');
                                }
                            );
                    },

                    getBeerMenu = function(args) {
                        var menuId = args.menuId;
                        var defaultBeerMenuId = args.defaultBeerMenuId;

                        var post_id = +PostInfo.ID;

                        return AdminAjaxRes.save({
                                action: 'get_custom_meta',
                                formData: {
                                    slug: 'rh_is_beer_menu',
                                    postId: post_id
                                }
                            })
                            .$promise
                            .then(
                                function(dto) {
                                    if (dto.error) {
                                        toastr.error(dto.message, 'Error');
                                    }
                                    var args = {
                                        isBeerMenu: +dto.data || false,
                                        beerMenuId: defaultBeerMenuId,
                                        menuId: menuId
                                    };
                                    if (args.isBeerMenu) {
                                        var localBeerMenuId = $scope.api.currentLocation.beerMenuOptions.location_beermenu;
                                        if(localBeerMenuId) {
                                            args.beerMenuId = localBeerMenuId;
                                        }
                                    }
                                    return args;
                                },
                                function(err) {
                                    toastr.error(err, 'Error');
                                }
                            );
                    },

                    setMenu = function(args) {
                        var menuId = args.menuId;
                        if(args.isBeerMenu && args.beerMenuId) {
                            $scope.beerMenusScriptSrc = 'https://www.beermenus.com/menu_widgets/' + args.beerMenuId;
                            $scope.beerMenuId = args.beerMenuId;
                            $scope.isBeerMenu = true;
                            // myElement = "<script>").attr({src: $scope.beerMenusScriptSrc}).appendTo("body");
                            var scriptTag = '<script src="https://www.beermenus.com/menu_widgets/' + $scope.beerMenuId + '" type="text/javascript" charset="utf-8"></script>';
                            angular.element(document.body).append(scriptTag);
                            return;
                        }
                        $scope.isBeerMenu = false;
                        if (!$scope.api.locationApi.currentLocation) {
                            return;
                        }

                        if (!menuId) {
                            $timeout(function() {
                                $scope.currentMenu = $scope.menuCollection.getInitial();
                            });
                        } else {
                            $scope.currentMenu = $scope.menuCollection.getMenuByOrderNum(menuId);
                        }
                    },

                    initMenu = function(menuId) {
                        $scope.isBeerMenu = false;
                        getDefaultBeerMenu(menuId)
                            .then(getBeerMenu)
                            .then(setMenu);
                    },

                    pathWatcher = $scope.$watch(
                        // This function returns the value being watched. It is called for each turn of the $digest loop
                        function() {
                            return $location.path();
                        },
                        // This is the change listener, called when the value returned from the above function changes
                        function(newValue, oldValue) {
                            if (newValue !== oldValue) {
                                // Only increment the counter if the value changed
                                initMenu();
                            }
                        }
                    );

                PageAPI.getInstance($scope.page)
                    .then(function(apiInstance) {
                        $scope.api = apiInstance;
                        setMenus();


                        getMenuId()
                            .then(initMenu);

                        setPageTitle();

                    });




                $scope.$on('$destroy', function() {
                    if (angular.isFunction(pathWatcher)) {
                        pathWatcher();
                    }
                });


            }
        ];

        return {
            restrict: 'EA', //Default in 1.3+
            controller: controller,
        };


    }
])



/**
 * MenuCollection represents data for a collection of menus currently received via SinglePlatform API
 */
.factory('MenuCollection', ['$log', '$q', '$filter', 'Menu',
    function($log, $q, $filter, Menu) {

        var MenuCollection = function(dto) {
            this.initMenus(dto);
        };

        MenuCollection.prototype = {
            menus: [],
            initMenus: function(rawMenus) {
                if (!rawMenus) {
                    return;
                }
                this.menus = rawMenus.map(function(val, k, arr) {
                    return new Menu(val);
                });
            },
            getInitial: function() {
                return this.menus[0];
            },
            getMenuById: function(id) {
                var self = this;
                var menu = $filter('filter')(self.menus, function(val, index, arr) {
                    return +val.id === +id;
                })[0];
                return menu;
            },
            getMenuByOrderNum: function(orderNumber) {
                var self = this;
                var menu = $filter('filter')(self.menus, function(val, index, arr) {
                    return +val.order_num === +orderNumber;
                })[0];
                return menu;
            },
            buildNavHtml: function() {
                var html,
                    self = this;
                if (!self.menus.length) {
                    return $q.reject('No menu items found.');
                }

                html = '<ul class="sub-menu">';
                for (var z = 0; z < self.menus.length; z++) {
                    var menu = self.menus[z];
                    html += '<li  class="menu-item menu-item-type-post_type menu-item-object-page"><a href="/menu/#/' +
                        menu.id + '">' + menu.name + '</a></li>';
                }
                html += '</ul>';
                return $q.when(html);
            },
            constructor: MenuCollection
        };

        return MenuCollection;
    }
])

/**
 * Menu represents data for a single menu currently received via SinglePlatform API
 */
.factory('Menu', ['$log', '$q', '$filter', 'MenuSectionCollection',
    function($log, $q, $filter, MenuSectionCollection) {

        var Menu = function(dto) {
            angular.extend(this, dto);
            this.sections = new MenuSectionCollection(this.sections);

        };
        Menu.prototype = {
            getFirstSection: function() {
                return this.sections.getFirstSection();
            },
            getSectionById: function(id) {
                var self = this;
                $filter('filter')(self.sections, function(val, index, arr) {
                    return +val.id === +id;
                });
            },
            constructor: Menu
        };

        return Menu;
    }
])

/**
 * MenuSectionCollection represents data for a collection of menu sections currently received via SinglePlatform API
 */
.factory('MenuSectionCollection', ['$log', '$q', '$filter', 'MenuSection',
    function($log, $q, $filter, MenuSection) {

        var MenuSectionCollection = function(sectionsArray) {
            this.initSections(sectionsArray);
        };
        MenuSectionCollection.prototype = {
            collection: [],
            getFirstSection: function() {
                return this.sections[0];
            },
            initSections: function(sectionsArr) {

                this.collection = sectionsArr.map(function(val, index, arr) {
                    return new MenuSection(val);
                });
            },
            constructor: MenuSectionCollection
        };

        return MenuSectionCollection;
    }
])

/**
 * MenuSection represents data for a menu section currently received via SinglePlatform API
 */
.factory('MenuSection', ['$log', '$q', '$filter', 'MenuItemClass',
    function($log, $q, $filter, MenuItemClass) {

        var MenuSection = function(dto) {
            angular.extend(this, dto);
            this.initItems();
        };
        MenuSection.prototype = {
            menuItems: [],
            initItems: function() {
                this.menuItems = this.items.map(function(val, k, arr) {
                    return new MenuItemClass(val);
                });
            },
            constructor: MenuSection
        };

        return MenuSection;
    }
])

/**
 * MenuItemClass represents data for a given menu item currently received via SinglePlatform API
 */
.factory('MenuItemClass', ['$q', '$filter',
    function($q, $filter) {

        var MenuItemClass = function(dto) {
            angular.extend(this, dto);
            this.setPrice();
            this.setOptions();

        };
        MenuItemClass.prototype = {
            price: null,
            options: [],
            setPrice: function() {
                if (!this.choices.length) {
                    return;
                }
                this.price = this.choices[0].prices.max || this.choices[0].prices.min;

            },
            setOptions: function() {
                if (!this.choices.length) {
                    return;
                }
                this.choices.splice(0, 1); //remove first element..it is our parent choice and used for price
                this.options = this.choices.map(function(val, k, arr) {

                    return {
                        name: val.name,
                        price: val.prices.max || val.prices.min
                    };
                });

            },
            constructor: MenuItemClass
        };

        return MenuItemClass;
    }
]);
