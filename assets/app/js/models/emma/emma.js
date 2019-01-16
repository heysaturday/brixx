'use strict';

/**
 * Factory for Emma DTO production
 */


angular.module('wpApp.models')

/**
 * @ngdoc factory
 * @name wpApp.models.EmmaClass
 *
 * @description
 * Returns class representing value object
 */
.factory('EmmaClass', ['$q', 'EmmaRes', 'LocationAPI',
    function($q, EmmaRes, LocationAPI) {
        var GENERAL_INTEREST = 'general_interest',
        	BEER_NEWS = 'beer_news',
            COUPON = 'coupon';
        var EmmaClass = function(formData) {
            this.init(formData);
        };
        EmmaClass.prototype = {
            locations: [],
            emailAddress: '',
            firstName: '',
            locationName: '',
            locationId: '',
            init: function(formData){
            	var self = this;
                angular.extend(self, formData);
                self.getLocations();

            },
            getLocations: function(){
                var self = this;
                return LocationAPI.getInstance()
    	            .then(function (apiInstance) {
    	            	self.locations = apiInstance.physicalLocations;
                        return self.locations;
    	            });
            },
            setLocation: function (locationId) {
                var self = this,
                	location;
                return self.getLocations()
                    .then(function(locations) {
                        for (var i = 0; i < self.locations.length; i++) {
                            if( +self.locations[i].ID === +locationId ) {
                                location = self.locations[i];
                                break;
                            }
                        }
                        if(!location){
                            return $q.reject('Location not found');
                        }
                        self.locationName = location.blogname;
                        self.locationId = location.ID;
                        return location;
                    });
            },
            addContact: function (mailingListType) {
            	var self = this;
            	return self.setLocation(self.locationId)
            		.then(function(){
            			 return EmmaRes.save({verb: mailingListType }, self).$promise;
                    });
            },

            constructor: EmmaClass
        };

        return EmmaClass;
    }
])



/**
 * @ngdoc service
 * @name wpApp.models.EmmaFactory
 * @description
 * Responsible for creating instances of EmmaClass
 */
.service('EmmaFactory', ['EmmaClass', '$q',
    function(EmmaClass, $q) {

        var _create = function(formData) {
            var emma = new EmmaClass(formData);
            return $q.when(emma);
        };

        this.getInstance = function(formData){
        	return _create(formData);
        };
    }
]);
