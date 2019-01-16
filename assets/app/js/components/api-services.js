'use strict';
/**
 * API Services
 * Global client-side api's for use in application directives/controllers
 * @see http://stackoverflow.com/questions/14883476/angularjs-call-method-in-directive-controller-from-other-controller
 */

angular.module('wpApp.apiServices', [])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push(function (ApiInterceptorSrv) {
        return ApiInterceptorSrv;
    });
});

angular.module('wpApp.apiServices')

/**
 * @ngdoc service
 * @name wpApp.apiServices.AppLoader
 * @description
 * Manages all our load behaviors
 */
/**
 * @ngdoc service
 * @name deId.apiCalls.ApiInterceptorSrv
 * @description
 * Holds the service - $http interceptor with extended capabilities
 */
.service('ApiInterceptorSrv', ['$rootScope', '$q', '$timeout',
    function ($rootScope, $q, $timeout) {

        var loadingCount = 0,
            responseCount = 0,
            show = function(){
                $timeout(function(){
                    if(responseCount>= loadingCount) {
                        $rootScope.$broadcast('loading:finish');
                    loadingCount = 0;
                    responseCount = 0;
                    }

                });

            };


        return {
            request: function (config) {
                loadingCount++;
                //if (++loadingCount === 1) $rootScope.$broadcast('loading:progress');
                if(loadingCount > responseCount){
                   $rootScope.$broadcast('loading:progress');
                }
                return config || $q.when(config);
            },

            response: function (response) {
                responseCount++;
                if(responseCount>= loadingCount) {
                   show();
                }
                // if (--loadingCount === 0) {
                //     $timeout(function(){
                //         if(--loadingCount === 0) {
                //             $rootScope.$broadcast('loading:finish');
                //         }
                //     });
                // }

                return response || $q.when(response);
            },

            responseError: function (response) {
                responseCount++;
                if(responseCount>= loadingCount) {
                    show();
                }
                // if (--loadingCount === 0) {

                //     $timeout(function(){

                //         $rootScope.$broadcast('loading:finish');
                //     });

                // }
                return $q.reject(response);
            }
        };
    }
])







/**
 * @ngdoc factory
 * @name wpApp.apiServices.PageAPI
 * @description
 * Returns common interface for page related properties and methods
 */
.service('PageAPI', ['$rootScope', 'LocationAPI', '$animate', '$timeout', 'GeoFactory', 'toastr', 'APP_EVENTS', '$q', '$log', '$window',
    function ($rootScope, LocationAPI, $animate, $timeout, GeoFactory, toastr, APP_EVENTS, $q, $log, $window) {
        var instance,
            deferred;
        return {

            applyWatcher: function () {
                var self = this;
                this.stopWatcher = $rootScope.$watch(
                    function () {
                        return self.locationApi.currentLocationId;
                    },
                    function (newValue, oldValue) {
                        if (newValue !== oldValue) {
                            self.locationChanged();
                        }
                    }
                );
            },

            destroyWatcher: function () {
                this.stopWatcher();
            },

			initializeLocation: function () {
				var self = this;
				self.currentLocation = self.locationApi.currentLocation;
				self.locationSet = self.locationApi.locationSet;
				self.hasError = self.locationApi.hasError;
				if (!GeoFactory.hasSentAlert() && self.hasError) {

					//var alertContent = '<div class="location-alert location-alert-alt"><p>Your store location is not currently selected. Please select a location.</p><a class="location-alert-button" href="/##brixx-location">Select Your Location</a></div>';
					var alertContent = '<div class="location-alert location-alert-alt"><button class="location-alert-close">X</button><p>This is website will not function properly in a private browser. To ensure the best experience and correct information, please revisit this site with private mode disabled.</p></div>';

					$('body').append('<div class="location-alert-bg"></div>');
					if ($('body').hasClass('home')) {
						$('#brixx-hero').append(alertContent);
						$('.fixed-nav').append(alertContent);
					} else {
						$('body').append(alertContent);
					}
					$('body').on('click', '.location-alert-close, .location-alert-button', function(event){
						$('.location-alert-bg, .location-alert').remove();
						if ($('#brixx-location button.btn-change').length > 0) {
							event.preventDefault();
							$('#brixx-location button.btn-change').click();
						}
					});

					/*
					if (self.hasError.permissionDenied()) {
						toastr.info(self.hasError.getPermissionDeniedMessage(), 'Are you sure?', {
							extendedTimeOut: 50000,
							timeOut: 50000
						});
					} else {
						window.toastr.error(self.hasError.getErrorMessage(), 'Error');
					}
					*/
				} else {

					if (typeof window.localStorage !== 'undefined') {

						//window.localStorage.removeItem('location-alert-viewed');
						if (!window.localStorage.getItem('location-alert-viewed')) {

							window.setTimeout(function(){

								var alertContent;
								var locationName = $('#masthead .mobile-nav-wrap .locations-masthead small.ng-binding').text();
								if (!locationName || locationName === '' || locationName === 'Brixx Sites') {

									/*
									alertContent = '<div class="location-alert location-alert-alt"><p>Your store location is not currently selected. Please select a location.</p><a class="location-alert-button" href="/##brixx-location">Select Your Location</a></div>';
									$('body').append('<div class="location-alert-bg"></div>');
									if ($('body').hasClass('home')) {
										$('#brixx-hero').append(alertContent);
										$('.fixed-nav').append(alertContent);
									} else {
										$('body').append(alertContent);
									}
									$('body').on('click', '.location-alert-close, .location-alert-button', function(event){
										$('.location-alert-bg, .location-alert').remove();
										if ($('#brixx-location button.btn-change').length > 0) {
											event.preventDefault();
											$('#brixx-location button.btn-change').click();
										}
									});
									*/

								} else {

									alertContent = '<div class="location-alert"><button class="location-alert-close">X</button><p>Is ' + locationName.toUpperCase() + ' your desired location?</p><button class="location-alert-button">Yes</button><a class="location-alert-button" href="/##brixx-location">No, Change My Location</a></div>';
									$('body').append('<div class="location-alert-bg"></div>');
									if ($('body').hasClass('home')) {
										$('#brixx-hero').append(alertContent);
										$('.fixed-nav').append(alertContent);
									} else {
										$('body').append(alertContent);
									}
									$('body').on('click', '.location-alert-close, .location-alert-button', function(event){
										$('.location-alert-bg, .location-alert').remove();
										if (event.currentTarget.tagName.toLowerCase() === 'a' && $('#brixx-location button.btn-change').length > 0) {
											event.preventDefault();
											$('#brixx-location button.btn-change').click();
										}
									});
								}

							}, 1000);
						}

						try {
							window.localStorage.setItem('location-alert-viewed', 'true');
						} catch (err) {

						}

					}

				}

				self.applyWatcher();

            },

            locationChanged: function () {
                var self = this;
                $timeout(function () {
                    self.setLocation()
                        .then(function(){
                            $window.location.href = '/';
                        });
                });

            },


            setLocation: function () {
                var self = this;
                self.currentLocation = self.locationApi.currentLocation;
                self.locationSet = self.locationApi.locationSet;
                self.hasError = self.locationApi.hasError;
                return $q.when(self);

            },




            /**
             * Initialize our page
             */
            init: function (pageEl) {
                var self = this;
                self.page = pageEl;
                $rootScope.$on('loading:progress', function () {
                    $animate.removeClass(self.page,'reveal');
                });
                $rootScope.$on('loading:finish', function () {
                    $rootScope.$broadcast(APP_EVENTS.REBUILD_SCROLLBAR);
                    $animate.addClass(self.page,'reveal');
                });


				/*
				// show "change location" modal when location is clicked on homepage
				var changeLocationLink = function(event){
					if ($('#brixx-location button.btn-change').length > 0) {
						event.preventDefault();
						$('#brixx-location button.btn-change').click();
					}
				};
				$('body').on('click', '.selector-tab .location h5 a', changeLocationLink);
				$('body').on('mousedown', '.selector-tab .location h5 a', changeLocationLink);
				*/


                return LocationAPI.getInstance()
                    .then(function (apiInstance) {

                        self.locationApi = apiInstance;
                        self.initializeLocation();
                        return self;
                    });


            },

            getInstance: function (pageEl) {
                var self = this;
                if(deferred) {
                    return deferred.promise;
                }
                if (instance) {
                    return $q.when(instance);
                } else {
                    deferred = $q.defer();
                    self.init(pageEl)
                        .then(function (apiInstance) {
                            instance = apiInstance;
                            deferred.resolve(instance);
                            deferred = null;
                        });
                    return deferred.promise;
                }
            }




        };
    }
])
















/**
 * @ngdoc factory
 * @name wpApp.apiServices.LocationAPI
 * @description
 * Returns object with methods for managing location information
 */
.service('LocationAPI', ['$rootScope', '$log', 'LocationListFactory', 'ModalService', 'GLOBALS', 'GeoFactory', '$q', '$filter', '$timeout', 'AdminAjaxRes', '$location',
    function ($rootScope, $log, LocationListFactory, ModalService, GLOBALS, GeoFactory, $q, $filter, $timeout, AdminAjaxRes, $location) {
        return {

            /**
             * Manage locations at global level as it concerns all aspects of application content
             */
            currentLocation: false,
            currentLocationId: null,
            allLocations: null,
            physicalLocations: null,
            locationSet: false,
            modal: null,
            geo: null,
            hasError: false,
            statesCollection: null,
            isLoading: false,
            loadingQ: null,
            deferred: null,

            getCurrentMenus: function () {
                return this.currentLocation.menus;
            },

            locationLoaded: function () {
                this.currentLocation = LocationListFactory.location;
                this.currentLocationId = LocationListFactory.currentLocationId;
                this.locations = LocationListFactory.locations;
                this.physicalLocations = $filter('filter')(this.locations, function (val, i, array) {
                    return +val.ID !== 1;
                });
                this.statesCollection = LocationListFactory.stateGroups;
                this.locationSet = true;
                this.isLoading = false;
                //Set location server side
                AdminAjaxRes.save({action: 'rh-set-selected-location'},{locationId: this.currentLocationId});
            },

            changeLocation: function (id) {
                var self = this;
                if (id > 0) {
                    LocationListFactory.setLocation(id)
                        .then(function () {
                            self.locationLoaded();
                        });
                }
            },


            getPreferredLocationId: function() {
               return LocationListFactory.getPreferredLocation()
                    .then(function(id){
                        return id;
                    });
            },

            processPreferredLocationId: function(preferredLocId) {
                var locPromises = [],
                    loadingQ;
                locPromises.push($q.when({preferredLocId: preferredLocId}));
                if (!preferredLocId) {
                    locPromises.push(
                        GeoFactory.get()
                    );
                }
                //Load all store locations
                locPromises.push(
                    LocationListFactory.load()
                );
                //Present nearest location, or default on error
                return $q.all(locPromises);

            },

            initializePreferredLocation: function(results) {
                var self = this,
                    preferredLocId = results[0].preferredLocId;
                if (preferredLocId) {
                    //Bypass all other measures.
                    return LocationListFactory.findPreferred(preferredLocId);
                } else {
                    self.geo = results[1];
                    self.hasError = self.geo.hasError();
                    if (self.hasError) {
                        return $q.when(LocationListFactory.setNoLocation());

                    } else {
                        return LocationListFactory.findNearest(self.geo);
                    }
                }
            },

            /**
             * Initialize our locations and geolocation information
             */
            init: function () {
                var self = this;
                self.deferred = $q.defer();
                if (!this.isLoading) {
                    this.isLoading = true;
                }
                this.getPreferredLocationId()
                    .then(this.processPreferredLocationId.bind(this))
                    .then(this.initializePreferredLocation.bind(this))
                    .then(function(){
                        self.locationLoaded();
                        self.deferred.resolve(self);
                        self.deferred = null;
                    });
                return self.deferred.promise;
            },
            showLocations: function () {
                var self = this,
                    templateUrl = 'js/components/modals/location-list.html',
                    modalController = 'LocationsWindowCtrl',
                    inputs = {
                        LocationListFactory: LocationListFactory,
                        globals: GLOBALS
                    };
                ModalService.showModal({
                        templateUrl: templateUrl,
                        controller: modalController,
                        inputs: inputs
                    })
                    .then(function (modalInstance) {
                        self.modal = modalInstance;
                        self.modal.element.modal(); //invoke with bootstrap javascript

                        self.modal.close.then(function (selectedLocation) {
                            if (selectedLocation) {
                                self.changeLocation(selectedLocation.ID);
                            } else {
                                $rootScope.$broadcast('loading:finish');
                            }
                        });
                    });
            },



            getInstance: function () {
                var self = this;
                if (self.deferred) {
                    return self.deferred.promise;
                } else {
                    return self.init();
                }
            }




        };
    }
]);
