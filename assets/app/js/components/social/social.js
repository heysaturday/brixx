'use strict';

/* Social items */
angular.module('wpApp.social', []);

angular.module('wpApp.social')


/**
 * Social directive.
 */
.directive('social', ['EndpointsProvider',
    function(EndpointsProvider) {

    var controller = ['$scope', '$element', '$attrs', '$transclude', 'LocationAPI', '$animate', '$timeout', 'SocialMenuFactory',
            function($scope, $element, $attrs, $transclude, LocationAPI, $animate, $timeout, SocialMenuFactory) {
                
                $scope.parentEl = $element;
                $scope.menuItems = null;

                function applyWatcher() {
                    $scope.stopWatcher = $scope.$watch(
                        function() {
                            return $scope.api.currentLocationId;
                        },
                        function(newValue, oldValue) {
                            if (newValue !== oldValue) {
                                locationChanged();
                            }
                        }
                    );
                }
                
                $scope.destroyWatcher = function() {
                    $scope.stopWatcher();
                };
               
                function locationChanged() {
                    // $animate.removeClass($scope.parentEl, 'reveal')
                    //     .then(function() {
                            $timeout(function() {
                                setLocation();
                            }, 250);

                       // });

                }

                function setLocation(showAll){
                    $scope.currentLocation = $scope.api.currentLocation;
                    var locId = -1;
                    if($scope.currentLocation) {
                        locId = $scope.currentLocation.ID;
                    }
                    SocialMenuFactory.load(locId)
                        .then(function(menu){
                            $scope.menuItems = menu.menu_items;
                        });
                    
                }

                LocationAPI.getInstance()
                    .then(function(apiInstance){
                        $scope.api = apiInstance;
                        var showAll = $attrs.showAll;
                        setLocation(showAll);
                        applyWatcher();
                    });

            }
        ],
        templateUrl = function(element, attributes) {
            if(attributes.templateUrl) {
                return 'js/components/social/' + attributes.templateUrl;
            }
            return 'js/components/social/social-nav.html';
        };

    return {
        restrict: 'EA', //Default in 1.3+
        controller: controller,
        templateUrl: templateUrl,
        link: function(scope, element, attrs) {
          scope.showAll = attrs.showAll;
        },

    };


}])

/**
 * @ngdoc service
 * @name wpApp.specials.SpecialMenuClass
 *
 * @description
 * Returns class representing menu items for specials
 */
.factory('SocialMenuClass', ['$log', '$filter', '$q',
    function($log, $filter, $q) {

        var SocialMenuClass = function(dto) {
            angular.extend(this, dto);
            this.menu_items = dto.parentMenuItems;
        };
        SocialMenuClass.prototype = {   
            menu_items:[],  

            constructor: SocialMenuClass
        };

        return SocialMenuClass;
    }
])



/**
 * @ngdoc service
 * @name wpApp.specials.SpecialMenuFactory
 * @description
 * Loads specials menu data from server
 */
.service('SocialMenuFactory', ['$q', 'SocialMenuClass', 'MenuFactory', '$injector',
    function($q, SocialMenuClass, MenuFactory, $injector) {
        var SocialMenuFactory = {
            social_items: null,

            load: function(siteId) {                
                var self = this;
                if(!siteId || siteId <1) {
                    siteId = 1;
                }
                return MenuFactory.loadSocialItems(siteId)
                    .then(function(menu) {
                        self.social_items = new SocialMenuClass(menu);
                        return self.social_items;
                    });
            }
            

        };

        return SocialMenuFactory;


    }
]);
