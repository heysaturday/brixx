'use strict';

/* Controllers */
angular.module('wpApp.events', []);

angular.module('wpApp.events')

/**
 * Events directive.
 */
.directive('brixxEvents', [
    function() {

        var controller = ['$scope', '$element', '$attrs', '$transclude', 'LocationAPI', '$animate', '$timeout','APP_EVENTS',
                function($scope, $element, $attrs, $transclude, LocationAPI, $animate, $timeout, APP_EVENTS) {
                    $scope.content = '';
                    $scope.parentEl = $element;
                    //$scope.parentEl.addClass('animate');
                    $scope.contentWrap = $scope.parentEl.find('.event-inner .content .inside');
                    //$scope.contentWrap.addClass('animate');
                    $scope.dateWrap = $scope.parentEl.find('.event-inner .date');
                    //$scope.dateWrap.addClass('animate');
                    $scope.noEventMessage = 'No events currently on tap. Please check back soon.';

                    $scope.onEventIndex = function(){
                        // $animate.removeClass($scope.dateWrap, 'reveal');
                        // $animate.removeClass($scope.contentWrap, 'reveal')
                        //     .then(function() {
                                $timeout(function() {
                                    //$animate.addClass($scope.contentWrap, 'reveal');
                                    //$animate.addClass($scope.dateWrap, 'reveal');
                                    $scope.$broadcast(APP_EVENTS.REBUILD_SCROLLBAR);
                                    setLocation();
                                }, 250);

                            //});

                    };

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

                            //});

                    }

                    function setLocation() {
                        $scope.currentLocation = $scope.api.currentLocation;
                        // $animate.addClass($scope.parentEl, 'reveal');
                        // $animate.addClass($scope.contentWrap, 'reveal');
                        // $animate.addClass($scope.dateWrap, 'reveal');
                    }

                    LocationAPI.getInstance()
                        .then(function(apiInstance) {
                            $scope.api = apiInstance;
                            setLocation();
                            applyWatcher();
                        });

                }
            ],
            templateUrl = function(element, attributes) {
                if (attributes.templateUrl) {
                    return 'js/components/vents/' + attributes.templateUrl;
                }
                return 'js/components/events/default-events.html';
            };

        return {
            restrict: 'EA', //Default in 1.3+
            controller: controller,
            templateUrl: templateUrl
        };


    }
])

/**
 * @ngdoc service
 * @name wpApp.events.EventClass
 *
 * @description
 * Returns class representing data available for a given Brixx location event
 */
.factory('EventClass', ['$log', '$q', '$filter',
    function($log, $q, $filter) {

        var EventClass = function(dto) {
            angular.extend(this, dto);
            this.setDate();
        };

        EventClass.prototype = {
            date: null,
            month: null,
            monthName: null,
            setDate: function() {
                var self = this;
                self.date = new Date(self.start_date + ' 12:00:00');
                self.month = self.date.getMonth();
                self.monthName = self.monthNames[self.month];
            },
            monthNames: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            constructor: EventClass
        };

        return EventClass;
    }
])


/**
 * EventFactory is an angular service(singleton) for creating instances of our event class
 * @ngdoc service
 * @name wpApp.events.EventFactory
 * @description Provides functionality for creating EventClass instances
 */
.service('EventFactory', ['EventClass', '$log', '$q', 'SinglePlatformRes', 'AdminAjaxRes',
    function(EventClass, $log, $q, SinglePlatformRes, AdminAjaxRes) {

        this.create = function(dto) {

            return new EventClass(dto);
        };


        this.getList = function(list) {
            if (!list) {
                return;
            }
            var self = this;

            return list.map(function(dto) {
                return self.create(dto);
            });
        };

    }
])



/**
 * @ngdoc service
 * @name wpApp.events.EventMenuClass
 *
 * @description
 * Returns class representing menu items for events menu
 */
.factory('EventMenuClass', ['$log', '$filter', '$q', '$timeout',
    function($log, $filter, $q, $timeout) {

        var EventMenuClass = function(eventList) {
            this.eventList = eventList;
            this.today = new Date();
            this.setNearestEvent();
        };
        EventMenuClass.prototype = {
            today: null,
            eventList: null,
            currentEvent: null,
            currentEventIndex: null,

            indexEvents: function(direction) {

                if (direction < 0) {
                    //go back
                    this.currentEventIndex--;
                    if (this.currentEventIndex < 0) {
                        this.currentEventIndex = this.eventList.length - 1;
                    }
                }
                if (direction > 0) {
                    //go forward
                    this.currentEventIndex++;
                    if (this.currentEventIndex > this.eventList.length - 1) {
                        this.currentEventIndex = 0;
                    }
                }
                this.currentEvent = this.eventList[this.currentEventIndex];

                return this.currentEvent;

            },

            getCurrentEvent: function() {
                return this.currentEvent;
            },

            setNearestEvent: function() {
                var self = this;
                for (var i = 0; i < self.eventList.length; i++) {
                    if (self.eventList[i].date.getTime() >= self.today.getTime()) {
                        self.currentEventIndex = i;
                        self.currentEvent = self.eventList[i];
                        return;
                    }
                }
            },




            constructor: EventMenuClass
        };

        return EventMenuClass;
    }
])

/**
 * @ngdoc service
 * @name wpApp.events.EventListFactory
 * @description
 * Loads event list data from server
 */
.service('EventListFactory', ['$q', 'EventFactory', '$filter', 'AdminAjaxRes', '$log', 'EventMenuClass',
    function($q, EventFactory, $filter, AdminAjaxRes, $log, EventMenuClass) {
        var EventListFactory = {
            events: [],
            eventMenu: null,
            event: null,

            setEventMenu: function(events) {
                this.eventMenu = new EventMenuClass(events);
            },


            getCurrent: function() {
                return this.event;
            },
            setEvent: function(id) {
                var self = this;
                this.event = $filter('filter')(this.events, {
                    id: id
                })[0];
            },

            setEvents: function(eventObjects) {
                var eventClasses = EventFactory.getList(eventObjects);
                if (!eventClasses) {
                    return false;
                }

                var sorted = $filter('orderBy')(eventClasses, 'start_date');
                EventListFactory.events = sorted;
                EventListFactory.setEventMenu(sorted);
                return sorted;
            },


            load: function(siteId) {
                var self = this;
                return AdminAjaxRes.get({
                        action: 'rh_get_events',
                        site_id: siteId
                    })
                    .$promise
                    .then(
                        function(dto) {
                            if (dto.error) {
                                $q.reject(dto.message);
                            } else {
                                //Do we have locations?
                                if (dto && dto.data.length > 0) {
                                    return self.setEvents(dto.data);
                                }
                                return true;
                            }
                        },
                        function(err) {
                            $q.reject('Error: ', err);
                        }

                    );
            }



        };

        return EventListFactory;


    }
]);
