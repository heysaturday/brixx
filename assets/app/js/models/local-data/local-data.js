'use strict';

/**
 * API for interacting with browser localStorage
 */

angular.module('wpApp.models')

/**
 * @ngdoc service
 * @name wpApp.models.LocalDataSrv
 * @description
 * Provides an interface for interacting with browser localStorage
 */
.service('LocalDataSrv', ['$window', '$cookies',
    function($window, $cookies) {
        var _storageKeyPrefix = 'brixxsites',
            _hasLocalStorage = true,
            _hasCookieStorage = true;
        var init = function() {
            // Safari, in Private Browsing Mode, looks like it supports localStorage but all calls to setItem
            // throw QuotaExceededError. We're going to detect this and just silently drop any calls to setItem
            // to avoid the entire page breaking, without having to do a check at each usage of Storage.
            try {
                if (typeof $window.localStorage === 'object') {
                    try {
                        $window.localStorage.setItem('localStorage', 1);
                        $window.localStorage.getItem('localStorage');
                        $window.localStorage.removeItem('localStorage');
                    } catch (e) {
                        _hasLocalStorage = false;
                        try {
                            $cookies.put('cookieTest', 1);
                            $cookies.remove('cookieTest');
                        } catch (e) {
                            _hasCookieStorage = false;
                        }
                    //     Storage.prototype._setItem = Storage.prototype.setItem;
                    //     Storage.prototype.setItem = function() {};
                    //     $window.alert('Your web browser does not support storing settings locally. In Safari, the most common cause of this is using "Private Browsing Mode". Some settings may not save or some features may not work properly for you.');
                    }
                }

            } catch (e) {
                // bail on everything
                _hasLocalStorage = false;
                _hasCookieStorage = false;
            }

        };

        this.get = function(key) {
            var value;
            if(_hasLocalStorage) {
                value = $window.localStorage.getItem(_storageKeyPrefix + '.' + key);
            } else if(_hasCookieStorage) {
                value = $cookies.get(_storageKeyPrefix + '.' + key);
            } else {
                value = null;
            }
            if (value !== null && angular.isDefined(value)) {
                value = angular.fromJson(value);
            }

            return value;
        };

        this.set = function(key, value) {
            if (value !== null && angular.isDefined(value)) {
                value = angular.toJson(value);
            }
            if(_hasLocalStorage) {
                $window.localStorage.setItem(_storageKeyPrefix + '.' + key, value);
            } else if(_hasCookieStorage) {
                $cookies.put(_storageKeyPrefix + '.' + key, value);
            }
        };

        this.remove = function(key) {
            if(_hasLocalStorage) {
                $window.localStorage.removeItem(_storageKeyPrefix + '.' + key);
            } else if(_hasCookieStorage) {
                $cookies.remove(_storageKeyPrefix + '.' + key);
            }
        };

        init();

    }
]);
