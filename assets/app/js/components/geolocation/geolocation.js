'use strict';


/* Controllers */
angular.module('wpApp.geolocation', []);

angular.module('wpApp.geolocation')

/**
 * @ngdoc service
 * @name wpApp.geolocation.GeoErrorClass
 *
 * @description
 * Returns class representing error object for navigator.geolocation.getCurrentPosition
 */
.factory('GeoErrorClass', ['$q',
    function($q) {

        var GeoErrorClass = function(error) {
            this.error = error;//cannot extend prototype..and we need it...so just set the error object
        };

        GeoErrorClass.prototype = {
            error: null,
            getPermissionDeniedMessage: function(){
                return 'Location information disallowed. Please reconsider so we can share information from the Brixx nearest you. Otherwise, please selected a location';

            },
            permissionDenied: function() {
                if (this.error.code === this.error.PERMISSION_DENIED) {
                    return true;
                }
                return false;
            },
            getErrorMessage: function() {
                var self = this,
                    error = this.error;
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        return 'Location information disallowed. Please reconsider so we can share information from the Brixx nearest you. Currently showing general information for default location.';
                    case error.POSITION_UNAVAILABLE:
                        return 'Location information is unavailable. Showing general information.';
                    case error.TIMEOUT:
                        return 'The request to get user location timed out. Showing general information.';
                    case error.UNKNOWN_ERROR:
                        return 'An unknown error occurred. Showing general information.';
                }
            },

            constructor: GeoErrorClass
        };

        return GeoErrorClass;
    }
])


/**
 * @ngdoc service
 * @name wpApp.geolocation.GeoClass
 *
 * @description
 * Returns class representing available geolocation data for a user
 */
.factory('GeoClass', ['$q', 'GeoErrorClass', '$timeout',
    function($q, GeoErrorClass, $timeout) {

        var GeoClass = function() {

        };

        GeoClass.prototype = {
            lat: '0',
            lng: '0',
            latlng: null,
            accuracy: '0',
            error: null,
            successMsg: 'Showing information for the Brixx location nearest you.',


            hasError: function() {
                if (this.error) {
                    return this.error;
                }
                return false;
            },

            load: function() {
                var self = this;
                return this.testBrowser()
                    .then(function() {
                        return self.getLocation();
                    })
                    .then(function() {
                        return self;
                    });
            },

            definePosition: function(position) {
                var self = this;
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.accuracy = position.coords.accuracy;
                this.latlng = new google.maps.LatLng(self.lat, self.lng);
            },

            defineError: function(error) {
                var self = this;
                self.error = new GeoErrorClass(error);


            },



            getLocation: function() {
                var deferred = $q.defer(),
                    self = this,
                    geolocFail = function () {
                        self.error = 'An unknown geolocation error has occurred.';
                        deferred.reject(['Cannot use geolocation', 'Notice']);
                    },
                    location_timeout = $timeout(geolocFail, 4000);

                // Get the user's current position
                // @see http://stackoverflow.com/questions/3397585/navigator-geolocation-getcurrentposition-sometimes-works-sometimes-doesnt
                if(navigator.geolocation && navigator.geolocation.getCurrentPosition) {
                    navigator.geolocation.getCurrentPosition(
                        function(position) {
                            $timeout.cancel(location_timeout);
                            self.definePosition(position);
                            deferred.resolve(true);
                        },
                        function(error) {
                            $timeout.cancel(location_timeout);
                            self.defineError(error);
                            deferred.reject([self.error, 'Notice']);
                        },
                        {
                            maximumAge:60000, timeout:5000, enableHighAccuracy:true
                        }
                    );
                } else {
                    $timeout.cancel(location_timeout);
                    geolocFail();
                }
                return deferred.promise;
            },

            testBrowser: function() {
                var deferred = $q.defer();

                if (Modernizr.geolocation) {
                    deferred.resolve(true);
                } else {
                    deferred.reject(['Geolocation is not supported in your browser', 'Notice']);
                }
                return deferred.promise;

            },
            constructor: GeoClass
        };

        return GeoClass;
    }
])


/**
 * GeoFactory is an angular service(singleton) for creating instances of our geo class
 * @ngdoc service
 * @name wpApp.geolocation.GeoFactory
 * @description Provides functionality for creating GeoClass instances
 */
.service('GeoFactory', ['GeoClass', '$q', 'LocalDataSrv',
    function(GeoClass, $q, LocalDataSrv) {
        this.instance = null;
        this.alertItemKey = 'geo_alert';
        this.alertIssued = false;

        this.clearStorage = function(){
            LocalDataSrv.remove(this.alertItemKey);

        };

        /**
         * [hasSentAlert Getter/Setter if value passed. We only need to alert visitors once that they did not authenticate]
         * @return {Boolean} [description]
         */
        this.hasSentAlert = function(setter){
            if(setter) {
                this.alertIssued = true;
                LocalDataSrv.set(this.alertItemKey, this.alertIssued);
                return this.alertIssued;
            }
            //check local storage/getter
            if(!this.alertIssued) {
                this.alertIssued = LocalDataSrv.get(this.alertItemKey);
            }
            return this.alertIssued;
        };


        /**
         * @ngdoc method
         * @name create
         * @methodOf wpApp.geolocation.GeoFactory
         * @param {Object} info Custom php Location class dto
         * @returns {GeoClass} Instance of GeoClass
         * @description Creates an instance of GeoClass from given DTO
         */
        this.create = function() {
            var self = this;
            self.instance = new GeoClass();
            return self.instance.load()
                .then(function() {
                    return self.instance;
                })
                .catch(function() {
                    return self.instance;
                });
        };

        /**
         * @ngdoc method
         * @name get
         * @methodOf wpApp.geolocation.LocationFactory
         * @returns {Object.<GeoClass>} GeoClass instances
         * @description Creates or returns current geo class instance
         */
        this.get = function() {
            if (!this.instance) {
                return this.create();
            } else {
                return $q.when(this.instance);
            }


        };

    }
]);
