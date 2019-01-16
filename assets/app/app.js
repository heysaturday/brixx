/**
 * Created by Darwin Hadley
 */
'use strict';

// Declare app level module
angular.module('wpApp', [
    'templates',
    'ngCookies',
    'ngSanitize',
    'angularModalService',
    'ngAnimate',
    'toastr',
    'ngScrollbar',
    'vAccordion',
    'smoothScroll',
    'duScroll',
    'ui.router',
    'mnBusy',
    'wpApp.models',
    'wpApp.services',
    'wpApp.controllers',
    'wpApp.filters',
    'wpApp.directives',
    'wpApp.apiCalls',
    'wpApp.apiServices',
    'wpApp.components',
    'wpApp.plugins',
    'wpApp.pages',
    'wpApp.menuPages',
    'wpApp.navigation',
    'wpApp.modals',
    'wpApp.tabs',
    'wpApp.specials',
    'wpApp.social',
    'wpApp.locations',
    'wpApp.events',
    'wpApp.search',
    'wpApp.geolocation',
    'wpApp.contact'


])

/**
 * Application Events
 */
.constant('GLOBALS', {
        'BRAND_IMAGE': BlogInfo.themeurl + '/assets/images/logo.svg'

    })
    /**
     * Application Events
     */
    .constant('APP_EVENTS', {
        'MODAL_OPENED': 'modalOpened',
        'MODAL_CLOSED': 'modalClosed',
        'LOCATION_CHANGE': 'locationChange',
        'MAP_MARKER_CLICK': 'mapMarkerClick',
        'REBUILD_SCROLLBAR': 'rebuildNgScrollbar',
        'IS_LOADING': 'loading:show',
        'IS_LOADED': 'loading:hide'

    })
    .provider('EndpointsProvider',[function(){
         // the following data is fetched from the JavaScript variables created by wp_localize_script(), and stored in the Angular rootScope
        var themeurl = BlogInfo.themeurl;//url to selected theme directory http://somesite.com/wp-content/themes/susy-boilerplate/
        var site = BlogInfo.site;//parent site url http://somesite.com"
        var api = AppAPI.url;//wp rest api url http://somesite.com/wp-json/"
        var wp_ajax_url = BlogInfo.ajaxurl;//wordpress ajax url "http://somesite.com/wp-admin/admin-ajax.php"
        var customApi = site + '/wp-content/services/api';//custom services api
        this.$get = function(){
            return {
                getWpAjaxUrl: function(){
                    return wp_ajax_url;
                },
                getWpRestApiUrl: function(){
                    return api;
                },
                getThemeUrl: function(){
                    return themeurl;
                },
                getSiteUrl: function(){
                    return site;
                },
                getCustomApiUrl: function(){
                    return customApi;
                }
            };
        };
    }])

    .config(['$locationProvider',
        function ($locationProvider) {
        //$locationProvider.html5Mode(true);
    }])

    //toastr setup
    .config(function(toastrConfig) {
        angular.extend(toastrConfig, {
            allowHtml: true,
            autoDismiss: false,
            closeButton: false,
            closeHtml: '<button>&times;</button>',
            containerId: 'toast-container',
            extendedTimeOut: 1000,
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning'
            },
            maxOpened: 0,
            messageClass: 'toast-message',
            newestOnTop: true,
            onHidden: null,
            onShown: null,
            positionClass: 'toast-top-right',
            preventDuplicates: true,
            preventOpenDuplicates: false,
            progressBar: false,
            tapToDismiss: true,
            target: 'body',
            templates: {
                toast: 'directives/toast/toast.html',
                progressbar: 'directives/progressbar/progressbar.html'
            },
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast'
        });
    })


/**
 * @see http://angular-ui.github.io/ui-router/sample/#/
 */
.run(function($rootScope, $injector, $state, $stateParams) {
    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    $rootScope.brixxApi = '//brixxpizza.com/wp-content/services/api';


    // the following data is fetched from the JavaScript variables created by wp_localize_script(), and stored in the Angular rootScope
    $rootScope.dir = BlogInfo.url;
    $rootScope.site = BlogInfo.site;
    $rootScope.api = AppAPI.url;


    /**
     * Broadcast jQuery doc ready
     */
    $rootScope.documentReady = false;
    jQuery(document).ready(function() {
        $rootScope.$broadcast('documentReady');
    });

    $rootScope.$on('documentReady', onDocumentReady);

    function onDocumentReady() {
        //Initialize anything you need to. aka: Google analytics.
        //console.log('Document ready fired.');
        $rootScope.documentReady = true;
        //Set other events you need to listen to.
        //document.addEventListener("online", onOnline, false);
        //document.addEventListener("offline", onOffline, false);
        //$rootScope.evalDevice();
    }

});



/* Controllers */
angular.module('wpApp.controllers', []);

angular.module('wpApp.controllers')

/**
 * App Controller. Attached to our application body tag
 */
.controller('AppCtrl', ['$scope', '$rootScope', '$log', '$window', 'ApiRes', 'LocationListFactory', 'GeoFactory', 'toastr', '$q', '$timeout', 'APP_EVENTS', 'ModalService', 'GLOBALS',
    function($scope, $rootScope, $log, $window, ApiRes, LocationListFactory, GeoFactory, toastr, $q, $timeout, APP_EVENTS, ModalService, GLOBALS) {



        /**
         * [doPrint description]
         * @return {[type]} [description]
         */
        $rootScope.doPrint = function() {
            $log.log('Printing');
            $window.print();
        };



        /**
         * Sample post request to WP Rest API plugin
         * @see http://premium.wpmudev.org/blog/delivering-wordpress-content-with-web-apps-using-angularjs/
         * @see http://wp-api.org/guides/getting-started.html#getting-started
         */

        $scope.fetch = function() {




            //Some information for our API resource
            ApiRes.get()
                .$promise
                .then(
                    function(obj) {
                        //$log.info('Available JSON Rest API resources: ', obj);
                    },
                    function(err) {
                        if (err.status === 404) {
                            $log.warn('You\'ll need to install WP REST API plugin to use this theme.');
                        }
                    }

                );




        };

        $scope.fetch();




    }
]);
