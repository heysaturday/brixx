'use strict';

/**
 * notification Issues notification alerts from a location's theme options page
 */


angular.module('wpApp.models')
/**
 * @ngdoc factory
 * @name wpApp.models.NotificationClass
 *
 * @description
 * Returns class representing value object
 */
.factory('NotificationClass', ['$q', 'AdminAjaxRes',
    function($q, AdminAjaxRes) {
        var _private = '';
        var NotificationClass = function(siteId) {
            this.init(siteId);
        };
        NotificationClass.prototype = {  
            siteId: '',
            message: '',
            init: function(siteId){
                this.siteId = siteId;
            },
            load: function() {
                var self = this;
                return AdminAjaxRes.get({
                        action: 'rh-get-notification',
                        site_id: self.siteId
                    })
                    .$promise
                    .then(
                        function(dto) {
                            if (dto.error) {
                                return $q.reject(dto.message);
                            }
                            self.message = dto.data;
                            return self;
                        },
                        function(err) {
                            return $q.reject(err);
                            
                        }
                    );

            },
            constructor: NotificationClass
        };

        return NotificationClass;
    }
])



/**
 * @ngdoc service
 * @name wpApp.models.NotificationFactory
 * @description
 * Responsible for creating instances of NotificationClass
 */
.service('NotificationFactory', ['NotificationClass', '$q',
    function(NotificationClass, $q) {
        var _instance = null; 
        var _deferred = null;       
        var _create = function(siteId) {
            var notification = new NotificationClass(siteId);
            notification.load()
                    .then(function(){
                        _instance = notification;
                        _deferred.resolve(_instance);
                        _deferred = null;
                    });
        };        

        this.getInstance = function(siteId){
            if(_deferred) {
                return _deferred.promise;
            }
            _deferred = $q.defer();
            if(!_instance) {
                _create(siteId);
            } else if (_instance.siteId !== siteId) {
                _create(siteId);
            } else {
                _deferred.resolve(_instance);
            }

            return _deferred.promise;
        };
        
        
    }
]);



