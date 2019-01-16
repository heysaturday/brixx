'use strict';

/* Locations */

angular.module('wpApp.locations', ['ngGeodist']);
angular.module('wpApp.locations')


/**
 * @ngdoc service
 * @name wpApp.locations.LocationClass
 *
 * @description
 * Returns class representing data available for a given Brixx location
 */
.factory('LocationClass', ['$log', 'SinglePlatformRes', '$q', 'AdminAjaxRes', '$filter', 'SpecialMenuFactory', 'EventListFactory', 'LocalDataSrv',
    function($log, SinglePlatformRes, $q, AdminAjaxRes, $filter, SpecialMenuFactory, EventListFactory, LocalDataSrv) {

    var LocationClass = function(dto) {
        angular.extend(this,dto);
        var self = this;
        this.ID = +dto.ID;
        this.setLatLng();

    };

    LocationClass.prototype = {
        lat: null,
        lng: null,
        hasLatLng: false,
        _singlePlatformLoaded: false,
        regularHours: null,
        sundayHours: null,
        specials: null,
        currentSpecials: null,
        allSpecials: null,
        eventMenu: null,

        indexEvents: function(direction){
            this.eventMenu.indexEvents(direction);
        },


        loadEvents: function(){
            var self = this;
            if (self.events) {
                return $q.when(self.events);
            }
            return EventListFactory.load(self.ID)
                .then(function(events){
                    self.eventMenu = EventListFactory.eventMenu;
                });
        },


        indexSpecials: function(direction){
            this.currentSpecials = this.specials.indexSpecials(direction);
        },

        loadSpecials: function(){
            var self = this;
            if (self.specials) {
                return $q.when(self.specials);
            }
            return SpecialMenuFactory.load(self.ID)
                .then(function(menu){
                    self.specials = menu;
                    self.currentSpecials = self.specials.getTodaySpecial();
                    self.allSpecials = self.specials.getAllSpecials();
                });

        },




        setHoursOfOperation: function(){
            if(!this._singlePlatformLoaded || !this.location.hours.Monday || !this.location.hours.Sunday) {
                return;
            }
            //Days as defined by Single Platform
            var days = [
                {
                    key: 'Monday',
                    label: 'Mon'
                },
                {
                    key: 'Tuesday',
                    label: 'Tue'
                },
                {
                    key: 'Wednesday',
                    label: 'Wed'
                },
                {
                    key: 'Thursday',
                    label: 'Thr'
                },
                {
                    key: 'Friday',
                    label: 'Fri'
                },
                {
                    key: 'Saturday',
                    label: 'Sat'
                },
                {
                    key: 'Sunday',
                    label: 'Sun'
                }
            ];
            this.dailyHours = [];
            for (var i = 0; i < days.length; i++) {
                 var opening = this.location.hours[days[i].key][0].opening.replace(':00','') ;
                    if(opening.indexOf('0')===0) {
                        opening = opening.substr(1);
                    }
                    var closing = this.location.hours[days[i].key][0].closing.replace(':00','') ;
                    if(closing.indexOf('0')===0) {
                        closing = closing.substr(1);
                    }
                    this.dailyHours.push(
                        {
                            dt: days[i].label,
                            dd: opening + ' - ' + closing
                        }
                    );
            }



            var mondayOpening = this.location.hours.Monday[0].opening.replace(':00','') ;
            if(mondayOpening.indexOf('0')===0) {
                mondayOpening = mondayOpening.substr(1);
            }
            var mondayClosing = this.location.hours.Monday[0].closing.replace(':00','') ;
            if(mondayClosing.indexOf('0')===0) {
                mondayClosing = mondayClosing.substr(1);
            }
            //The following lines are depracated as of 2/29/16...but leave it...these people often change their minds.
            var sundayOpening = this.location.hours.Sunday[0].opening.replace(':00','') ;
            if(sundayOpening.indexOf('0')===0) {
                sundayOpening = sundayOpening.substr(1);
            }
            var sundayClosing = this.location.hours.Sunday[0].closing.replace(':00','') ;
            if(sundayClosing.indexOf('0')===0) {
                sundayClosing = sundayClosing.substr(1);
            }

            this.regularHours = {
                open: mondayOpening,
                close: mondayClosing
            };
            this.sundayHours = {
                open: sundayOpening,
                close: sundayClosing
            };


        },

        setLatLng: function(){
            if(this.locationOptions.latlng) {
                var latlng = this.locationOptions.latlng.split(',');
                if(!latlng.length || latlng.length!==2) {
                    return;
                }
                this.lat = latlng[0].trim();
                this.lng = latlng[1].trim();
                this.hasLatLng = true;
            }
        },


        /**
         * [loadLocationOptions We return this option group with our location dto. But just in case we need to reload this data...we have this ajax call available]
         * @return {[array]} [location options]
         */
        loadLocationOptions: function(){
            var self = this;

            return AdminAjaxRes.get({action: 'rh-get-location-options', siteId: self.ID })
                            .$promise
                            .then(function(dto){
                                if(dto.error) {
                                    return $q.reject(dto.error);
                                } else {
                                    self.locationOptions  = dto.data;
                                    return self.locationOptions;
                                }

                            });
        },





		getSinglePlatformLocationSlug: function(){
			return this.singlePlatformOptions.single_platform_location_slug;
		},


        /**
         * [parseSinglePlatformMenus parse menus from single platform]
         * @return {[type]} [description]
         * @description
         * Single platform data arrives with a 'menus' array representing all the primary menus populated.
         * At the time of this writing those menus are:
         *     Main Menu, Desserts & Treats, Kids, Beer, Wine
         *
         */
        parseSinglePlatformMenus: function(){
            if(!this.menus) {
                return;
            }


        },

        processSinglePlatform: function(sp_data) {
            var self = this;
            angular.extend(self,sp_data);
            self._singlePlatformLoaded=true;
            self.setHoursOfOperation();
            self.parseSinglePlatformMenus();
        },

        loadSinglePlatform: function() {
            var deferred = $q.defer(),
                self = this,
                location_slug = this.getSinglePlatformLocationSlug(),
                local_storage_key = 'sp_data';



			// Add "Order Online" menu options
			if (this.miscOptions && this.miscOptions.misc_order_online_url) {

				var menus = angular.element('.nav-menu .menu-ul');
				if (menus.length > 0) {
					var menuOption = menus.find('a:contains("Menu")');
					if (menuOption.length > 0) {
						var menuSubmenu = menuOption.parent().find('.sub-menu');
						if (menuSubmenu.length > 0 && menuSubmenu.get(0).innerHTML.indexOf('Order Online') === -1) {
							menuSubmenu.append('<li><a href="' + this.miscOptions.misc_order_online_url + '" target="_blank">Order Online</a></li>');
						}
					}
				}

				var mobileMenu = document.getElementById('main-nav-modal.html');
				if (mobileMenu) {
					var mobileMenuHtml = mobileMenu.innerHTML;
					if (mobileMenuHtml && mobileMenuHtml.indexOf('Order Online') === -1) {
						mobileMenuHtml = mobileMenuHtml.replace('</ul>', '<li><a href="' + this.miscOptions.misc_order_online_url + '" target="_blank">Order Online</a></li></ul>');
						mobileMenu.innerHTML = mobileMenuHtml;
					}
				}

				var menuMenu = angular.element('#menu-flyout-food-menu-1');
				if (menuMenu && menuMenu.length > 0 && menuMenu.get(0).innerHTML.indexOf('Order Online') === -1) {
					menuMenu.append('<li><a href="' + this.miscOptions.misc_order_online_url + '" target="_blank">Order Online</a></li>');
				}

			}


            if(!location_slug) {
                deferred.resolve(false);
            }
            if(self._singlePlatformLoaded) {
                deferred.resolve(self);
            }
            var sp_data = LocalDataSrv.get(local_storage_key);
            if(sp_data && sp_data.location.location_id === location_slug) {
                self.processSinglePlatform(sp_data);
                deferred.resolve( self );
            } else {
                LocalDataSrv.remove(local_storage_key);//clear pre-existing local storage single platform data
                SinglePlatformRes.get({
                    location_slug:location_slug
                })
                .$promise
                .then(
                    function(dto){
                        if(dto.error) {
                            deferred.resolve(dto.message);
                        } else {
                            if(!dto.data) {
                               deferred.resolve('Error: No data available from Single Platform');
                               return;
                            }
                            if(dto.data.errorMessage) {
                                deferred.reject('Error: ' + dto.data.errorMessage);
                                return;
                            }
                            var sp_data = dto.data.data;
                            LocalDataSrv.set(local_storage_key, sp_data);
                            self.processSinglePlatform(sp_data);
                            deferred.resolve( self );
                        }
                    },
                    function(err){
                        deferred.reject('Error: ' + err);
                    }

                );
            }

            return deferred.promise;

        },
        constructor: LocationClass
    };

    return LocationClass;
}])


/**
 * LocationFactory is an angular service(singleton) for creating instances of our location class
 * @ngdoc service
 * @name wpApp.locations.LocationFactory
 * @description Provides functionality for creating LocationClass instances
 */
.service('LocationFactory', ['LocationClass', '$log', '$q','SinglePlatformRes', 'AdminAjaxRes',
    function(LocationClass, $log, $q, SinglePlatformRes, AdminAjaxRes) {
        /**
         * @ngdoc method
         * @name create
         * @methodOf wpApp.locations.LocationFactory
         * @param {Object} info Custom php Location class dto
         * @returns {LocationClass} Instance of LocationClass
         * @description Creates an instance of LocationClass from given DTO
         */
        this.create = function(dto) {

            return new LocationClass(dto);
        };

        /**
         * @ngdoc method
         * @name getList
         * @methodOf wpApp.locations.LocationFactory
         * @param {Array.<Object>} slideList List of DTO's
         * @returns {Array.<SlideClass>} Array of SlideClass instances
         * @description Creates an array of instances of SlideClass from given DTO's list
         */
        this.getList = function(locationList) {
            if(!locationList) {
                return;
            }
            var self = this;

            return locationList.map(function(dto) {
                return self.create(dto);
            });
        };

    }
])

/**
 * @ngdoc service
 * @name wpApp.locations.LocationListFactory
 * @description
 * Loads locations list data from server
 */
.service('LocationListFactory', ['$q', 'LocationFactory','$filter', 'AdminAjaxRes', '$log', 'ngGeodist', '$window', 'SocialMenuFactory', 'LocalDataSrv',
    function($q, LocationFactory, $filter, AdminAjaxRes, $log, ngGeodist, $window, SocialMenuFactory, LocalDataSrv) {
        var LocationListFactory = {
            locations: [],
            location: null,
            currentLocationId: null,//used for our watchers
            defaultLocationId: null,
            preferredLocationId: null,
            preferredLocationKey: 'preferred_location',
            stateGroups: {},

            /**
             * [getCurrent get currently selected location
             * @return {[LocationClass]} [description]
             */
            getCurrent: function(){
                return this.location;
            },

            /**
             * [findNearest description]
             * @param  {[GeoClass]} geo [An instance of our custom GeoClass object]
             * @return {[LocationClass]}     [a location class instance representing nearest location to user's geographic position]
             */
            findNearest: function(geo){
                var self = this;

                return self.getNearest(geo)
                    .then(function(sorted){
                        LocationListFactory.locations = sorted;
                        self.setLocation(self.locations[0].ID)//set to nearest
                            .then(function(){
                                return self.location;
                            });
                    });
            },

            /**
             * [getNearest Get list of location sorted by proximity to user submitted location]
             * @param  {[GeoClass]} geo [An instance of our custom GeoClass object]
             * @return {[LocationClass]}     [a location class instance representing nearest location to user's geographic position]
             */
            getNearest: function(geo){
                var self = this;
                return self.load()
                    .then(function(){
                        for (var i = 0; i < self.locations.length; i++) {
                            if(self.locations[i].hasLatLng) {
                                var store = self.locations[i];
                                var storeLoc = {lat: store.lat, lng: store.lng};
                                var userLoc = {lat: geo.lat, lng: geo.lng};
                                var distance = ngGeodist.getDistance(userLoc, storeLoc);
                                self.locations[i].distance = distance;
                            } else {
                                self.locations[i].distance = Number.MAX_VALUE;
                            }
                        }
                        var sorted = $filter('orderBy')(self.locations, 'distance');
                        return sorted;

                    });
            },

            findPreferred: function(id) {
                var self = this;
                return self.setLocation(id)
                        .then(function(){
                            return self.location;
                        });
            },



            getDefaultLocationId: function(){
                var self = this;
                if(self.defaultLocationId) {
                    return $q.when(self.defaultLocationId);
                }

                return AdminAjaxRes.get({action: 'rh-get-default-location-id'})
                    .$promise
                    .then(function(dto){
                        if(dto.error) {
                            $q.reject(dto.error);
                        } else {
                            if(!dto.data) {
                                self.defaultLocationId = 1;//Assume parent site ID==1 if not populated.
                                return self.defaultLocationId;
                            }
                            self.defaultLocationId = +dto.data;
                            return self.defaultLocationId;

                        }

                    });


            },



            setNoLocation: function(){
                return this.setLocation(-1);
            },

            getUrlParameter: function(param, dummyPath) {
                    var sPageURL = dummyPath || window.location.search.substring(1),
                        sURLVariables = sPageURL.split(/[&||?]/),
                        res;

                    for (var i = 0; i < sURLVariables.length; i += 1) {
                        var paramName = sURLVariables[i],
                            sParameterName = (paramName || '').split('=');

                        if (sParameterName[0] === param) {
                            res = sParameterName[1];
                        }
                    }

                    return res;
            },

            getServerPreferredLocation: function() {
                var pid = this.getUrlParameter('pid');
                if(!pid) {
                    return $q.when(-1);
                }
                return AdminAjaxRes.get({action: 'rh-get-selected-location', 'pid': pid})
                    .$promise
                    .then(function(dto){
                        if(dto.error) {
                            $q.reject(dto.error);
                        } else {
                            return dto.data;
                        }

                    });
            },

            /**
             * [getPreferredLocation get value from local storage]
             * @return {[mixed]} [value or null if key does not exist]
             */
            getPreferredLocation: function(){
                var self = this,
                    d = $q.defer(),
                    preferredLocationId = LocalDataSrv.get(this.preferredLocationKey);
                if(preferredLocationId) {
                    this.preferredLocationId = preferredLocationId;
                    d.resolve(this.preferredLocationId);
                } else {
                    self.getServerPreferredLocation()
                        .then(function(id){
                            if(id && id > -1) {
                                self.preferredLocationId = id;
                            } else {
                                self.preferredLocationId = null;
                            }
                            d.resolve(self.preferredLocationId);
                        });
                }
                return d.promise;
            },

            setPreferredLocation: function(id){
                if(id) {
                    LocalDataSrv.set(this.preferredLocationKey, id);
                }
            },

            setLocation: function(id) {
                if(!id) {
                    return this.setNoLocation();
                }
                var self = this;

                if(id>0) {
                    this.location = $filter('filter')(this.locations, function(val, index, arr){
                        return +val.ID === +id;
                    })[0];
                    if(!this.location) {
                        return this.setNoLocation();
                    }
                    this.setPreferredLocation(this.location.ID);
                    this.getDefaultLocationId();
                    var promises = [];
                    promises.push( this.location.loadSinglePlatform());
                    promises.push( this.location.loadSpecials() );
                    promises.push( this.location.loadEvents() );
                    this.currentLocationId = this.location.ID;
                    return $q.all(promises);
                }
                //Filter for our base site...and use the base site menu as default menu when no location selected
                this.location = $filter('filter')(this.locations, function(val, index, arr){
                    return +val.ID === 1;//Get the default site
                })[0];
                return this.location.loadSinglePlatform()
                    .then(function(){
                        self.currentLocationId = id;
                        return self.currentLocationId;
                    });

            },

            setLocations: function(locationObjects) {
                var locationClasses = LocationFactory.getList(locationObjects);
                if(!locationClasses) {
                    return false;
                }

                var sorted = $filter('orderBy')(locationClasses, ['stateName', 'blogname'] );
                this.setStateGroups(sorted);
                LocationListFactory.locations = sorted;
                return sorted;
            },

            setStateGroups: function(sortedList) {
                var self = this,
                    stateCounter = 1;
                this.stateGroups = {};
                for (var i = 0; i < sortedList.length; i++) {
                    if(+sortedList[i].ID===1) {
                        continue;//ignore default site for state groups
                    }
                    if( !self.stateGroups.hasOwnProperty(sortedList[i].locationOptions.state) ) {
                        self.stateGroups[sortedList[i].locationOptions.state] = {
                            heading: sortedList[i].stateName,
                            group_id: 'group-' + stateCounter,
                            collection: []
                        };
                        stateCounter++;
                    }
                    //Using filter attributes only
                    var location = {
                        ID: sortedList[i].ID,
                        blogname: sortedList[i].blogname,
                        state: sortedList[i].locationOptions.state,
                        stateName: sortedList[i].stateName,
                        zip: sortedList[i].locationOptions.zip
                    };
                    self.stateGroups[sortedList[i].locationOptions.state].collection.push(location);
                }
            },

            load: function() {
                var self = this;
                if(self.locations.length) {
                    return  $q.when(self.locations);
                }
                return AdminAjaxRes.get({action: 'rh-get-locations'})
                    .$promise
                    .then(
                        function(dto){
                            if(dto.error) {
                                $q.reject(dto.error);
                            } else {
                               //Do we have locations?
                                if(dto && dto.data && dto.data.length>0) {

                                   return self.setLocations(dto.data);

                                }
                                return true;
                            }
                        },
                        function(err){
                            $q.reject('Error: ', err);
                        }

                    );
            },





        };

        return LocationListFactory;


    }
])
/**
 * @ngdoc service
 * @name wpApp.locations.LocationMenuFactory
 * @description
 * Loads menus for a given location. At the time of this writing, this interface leverages SinglePlatform. We use the Factory pattern here
 * to give us one interface for changing the delivery service down the road if necessary.
 */
.service('LocationMenuFactory', ['$q', 'LocationFactory','$filter', 'AdminAjaxRes', '$log', 'ngGeodist', '$window',
    function($q, LocationFactory, $filter, AdminAjaxRes, $log, ngGeodist, $window) {
        var LocationListFactory = {

        };

        return LocationListFactory;


    }
]);
