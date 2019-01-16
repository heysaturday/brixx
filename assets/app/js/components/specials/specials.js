'use strict';

/* Specials */
angular.module('wpApp.specials', []);

angular.module('wpApp.specials')


/**
 * Specials directive.
 */
.directive('specials', [
    function() {

    var controller = ['$scope', '$element', '$attrs', '$transclude', 'LocationAPI', '$animate', '$timeout',
            function($scope, $element, $attrs, $transclude, LocationAPI, $animate, $timeout) {
                
                $scope.parentEl = $element;
                $scope.parentEl.addClass('animate');

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
                    $animate.removeClass($scope.parentEl, 'reveal')
                        .then(function() {
                            $timeout(function() {
                                setLocation();
                            }, 250);

                        });

                }

                function setLocation(showAll){
                    $scope.currentLocation = $scope.api.currentLocation; 
                    $animate.addClass($scope.parentEl, 'reveal');
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
                return 'js/components/specials/' + attributes.templateUrl;
            }
            return 'js/components/specials/default-specials.html';
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
.factory('SpecialMenuClass', ['$log', '$filter', '$q',
    function($log, $filter, $q) {

        var SpecialMenuClass = function(dto) {
            angular.extend(this, dto);
            this.todayIndex = new Date().getDay();
        };
        SpecialMenuClass.prototype = {
            todayIndex: null,
            relevantSpecials: null,

            indexSpecials: function(direction){
                
                if(direction <0) {
                    //go back
                    this.todayIndex--;
                    if(this.todayIndex < 0) {
                        this.todayIndex = 6;
                    } 
                }
                if(direction > 0) {
                    //go forward
                    this.todayIndex++;
                    if(this.todayIndex > 6 ) {
                        this.todayIndex = 0;
                    } 
                }
                var dayObj = this.getDayObjectByIndex(this.todayIndex);
                var specials = this.getDailySpecial(dayObj);
                return specials;

            },

            getAllSpecials: function(){
                var specials = [];
                var today = this.getTodayObject();
                var todayIndex = today.index;
                for (var i = 0; i < this.days.length; i++) {
                    if(todayIndex > 6) {
                        todayIndex = 0;
                    }
                    var todayObj = this.getDayObjectByIndex(todayIndex);
                    var todaySpecial = this.getSpecialByDay(todayObj)[0];
                    specials.push(todaySpecial);
                    todayIndex = todayIndex + 1;
                }
                specials[0].highlightMe = true;//Topmost item is today's special to be highlighted in nav
                return specials;
            },



            getTodaySpecial: function(){
                var todayObj = this.getTodayObject();
                return this.getDailySpecial(todayObj);
            },

            getTomorrowSpecial: function(todayObj){
                var special,
                    tomorrowIndex,
                    tomorrowObj;
                //What is our day index
                if(todayObj.index===6) {
                    tomorrowIndex = 0;
                } else {
                    tomorrowIndex = todayObj.index + 1;
                }

                tomorrowObj = this.getDayObjectByIndex(tomorrowIndex);
                return this.getSpecialByDay(tomorrowObj);

            },

            getDailySpecial: function(dayObj){
                var todayObj = dayObj;
                var todaySpecial = this.getSpecialByDay(todayObj);
                var tomorrowSpecial = this.getTomorrowSpecial(todayObj);
                todaySpecial.push.apply(todaySpecial, tomorrowSpecial);
                
                return todaySpecial;
            },

            getSpecialByDay: function(todayObj) {
                var self = this;
                var relevantSpecials = $filter('filter')(self.parentMenuItems, function(value, index) {
                    return value.title.toLowerCase()===todayObj.day.toLowerCase();
                });
                return relevantSpecials;

            },

            getTodayObject: function(){
                var self = this;
                var todayObj = self.getDayObjectByIndex(self.todayIndex);
                return todayObj;
            },


            getDayObjectByName: function(threeLetterName){
                var dayObj = $filter('filter')(this.days, {day: threeLetterName})[0];
                return dayObj;
            }, 

            getDayObjectByIndex: function(dayIndex){
                var dayObj = $filter('filter')(this.days, {index: +dayIndex})[0];
                return dayObj;
            },

            /**
             * An assembly of days. In javascript Date.getDay() returns values 0 thru 6 with 0 representing Sunday
             */
            days: [{
                    index: 0,
                    day: 'Sun'
                }, {
                    index: 1,
                    day: 'Mon'
                }, {
                    index: 2,
                    day: 'Tue'
                }, {
                    index: 3,
                    day: 'Wed'
                }, {
                    index: 4,
                    day: 'Thu'
                }, {
                    index: 5,
                    day: 'Fri'
                }, {
                    index: 6,
                    day: 'Sat'
                },

            ],


            constructor: SpecialMenuClass
        };

        return SpecialMenuClass;
    }
])



/**
 * @ngdoc service
 * @name wpApp.specials.SpecialMenuFactory
 * @description
 * Loads specials menu data from server
 */
.service('SpecialMenuFactory', ['$q', 'SpecialMenuClass', 'MenuFactory',
    function($q, SpecialMenuClass, MenuFactory) {
        var SpecialMenuFactory = {
            load: function(siteId) {
                var self = this;
                return MenuFactory.loadSpecials(siteId)
                    .then(function(menu) {
                        return new SpecialMenuClass(menu);
                    });
            }

        };

        return SpecialMenuFactory;


    }
]);
