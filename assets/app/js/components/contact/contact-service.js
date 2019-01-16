'use strict';

/* Locations */


angular.module('wpApp.contact')


/**
 * @ngdoc service
 * @name wpApp.contact.ContactClass
 *
 * @description
 * Returns class representing contact information for a given Brixx location
 */
.factory('ContactClass', [
    function() {

        var ContactClass = function(dto) {
            angular.extend(this, dto);
            var self = this;
            this.ID = +dto.ID;

        };

        ContactClass.prototype = {
            ID: null,
            
            constructor: ContactClass
        };

        return ContactClass;
    }
])


/**
 * ContactFactory is an angular service(singleton) for creating instances of our contact class
 * @ngdoc service
 * @name wpApp.contact.ContactFactory
 * @description Provides functionality for creating LocationClass instances
 */
.service('ContactFactory', ['ContactClass', 'AdminAjaxRes', '$q',
    function(ContactClass, AdminAjaxRes, $q) {
        var instance;
        /**
         * @ngdoc method
         * @name create
         * @methodOf wpApp.locations.LocationFactory
         * @param {Object} info Custom php Location class dto
         * @returns {LocationClass} Instance of LocationClass
         * @description Creates an instance of LocationClass from given DTO
         */
        this.create = function(dto) {

            return new ContactClass(dto);
        };

        this.load = function(locationId) {
            var self = this;
            return AdminAjaxRes.get({
                    action: 'rh-get-contact-info',
                    site_id: locationId
                })
                .$promise
                .then(
                    function(dto) {
                        if (dto.error) {
                            $q.reject(dto.error);
                        } else {
                            //Do we have contacts?
                            if (dto && dto.data) {
                                dto.data.ID = locationId;
                                return self.create(dto.data);
                            }
                            return true;
                        }
                    },
                    function(err) {
                        $q.reject('Error: ', err);
                    }

                );
        };

        /**
         * @ngdoc method
         * @name getList
         * @methodOf wpApp.locations.LocationFactory
         * @param {Array.<Object>} slideList List of DTO's
         * @returns {Array.<SlideClass>} Array of SlideClass instances
         * @description Creates an array of instances of SlideClass from given DTO's list
         */
        this.getInstance = function(locationId) {
            if (!locationId) {
                return;
            }
            return this.load(locationId);

        };

    }
]);
