/**
 * API Resources
 * Calls assume installation of JSON REST API Plugin from Ryan McCue
 * @see http://wp-api.org/
 */

'use strict';

/**
 *
 * # API Resources
 *
 *
 */
angular.module('wpApp.apiCalls', ['ngResource']);

angular.module('wpApp.apiCalls')

/**
 * @ngdoc service
 * @name wpApp.apiCalls.EmmaRes
 * @description
 * Returns object with methods for communicating with My Emma accounts
 */
.factory('EmmaRes', ['$resource', '$rootScope', '$log',
    function($resource, $rootScope, $log) {
    /**
     * @ngdoc method
     * @name query
     * @methodOf wpApp.apiCalls.ApiRes
     * @param {Object} params Parameters for query.
     * @param {String} params.route Choose from list of available routes in the JSON REST API Plugin
     * @returns {Object} Returns object with $promise. See $resource documentation for more info
     * @description Queries for WordPress objects by route
     */

    var URL = $rootScope.brixxApi,
        resource    = '/emma/',
        urlTemplate = ':verb';

    return $resource(URL + resource + urlTemplate, {}, {
        
    }, {
        stripTrailingSlashes: false
    });
}])


/**
 * @ngdoc service
 * @name wpApp.apiCalls.SendMailRes
 * @description
 * Returns object with methods for sending email
 */
.factory('SendMailRes', ['$resource', '$rootScope', '$log',
    function($resource, $rootScope, $log) {
    /**
     * @ngdoc method
     * @name query
     * @methodOf wpApp.apiCalls.ApiRes
     * @param {Object} params Parameters for query.
     * @param {String} params.route Choose from list of available routes in the JSON REST API Plugin
     * @returns {Object} Returns object with $promise. See $resource documentation for more info
     * @description Queries for WordPress objects by route
     */

    var URL = $rootScope.brixxApi,
        resource    = '/sendmail/',
        urlTemplate = '';

    return $resource(URL + resource + urlTemplate, {}, {
        
    }, {
        stripTrailingSlashes: false
    });
}])


/**
 * @ngdoc service
 * @name wpApp.apiCalls.GeolocationRes
 * @description
 * Returns geolocation information
 */
.factory('GeolocationRes', function($resource, $rootScope, $log) {
    /**
     * @ngdoc method
     * @name get
     * @methodOf wpApp.apiCalls.GeolocationRes
     * @param {Object} params Parameters for get.
     * @param {String} params.location_slug In Single Platform UI, dbl-click a location. In the url for that location is the slug
     * @returns {Object} Returns object with $promise. See $resource documentation for more info
     * @description Queries for Single Platform API by location
     */


    var URL = $rootScope.brixxApi,
        resource = '/geolocation/';

    return $resource(URL + resource,{},{},{stripTrailingSlashes:false});    
    
})


/**
 * @ngdoc service
 * @name wpApp.apiCalls.AdminAjaxRes
 * @description
 * Built to work with calls to WordPress admin-ajax.php. 
 * In functions.php:
 * Some ajax/wordpress calls
        add_action('wp_ajax_rh-get-locations', array($this, 'get_locations_cb') );
        add_action('wp_ajax_nopriv_rh-get-locations', array($this, 'get_locations_cb') );
    And in this example the action parameter would be 'rh-get-locations'
 */
.factory('AdminAjaxRes', function($resource, $rootScope, $log, $http) {
    

    var URL = BlogInfo.ajaxurl;

    return $resource(URL,
        {   
            action: '@action'

        },{
            get: {
                method: 'GET',
                transformResponse: function(data){
                    return angular.fromJson(data);
                }
            }

        },{stripTrailingSlashes:false});  

    
})


/**
 * @ngdoc service
 * @name wpApp.apiCalls.ThemeOptionsRes
 * @description
 * Returns theme options information
 */
.factory('ThemeOptionsRes', function($resource, $rootScope, $log) {
    /**
     * @ngdoc method
     * @name get
     * @methodOf wpApp.apiCalls.ThemeOptionsRes
     * @param {Object} params Parameters for get.
     * @param {String} params.location_slug In Single Platform UI, dbl-click a location. In the url for that location is the slug
     * @returns {Object} Returns object with $promise. See $resource documentation for more info
     * @description Queries for Single Platform API by location
     */


    var URL = $rootScope.brixxApi,
        resource = '/themeoptions/';

    return $resource(URL + resource,{},{},{stripTrailingSlashes:false});    
    
})


/**
 * @ngdoc service
 * @name wpApp.apiCalls.SinglePlatformRes
 * @description
 * Returns stuff from Single Platform API
 */
.factory('SinglePlatformRes', function($resource, $rootScope, $log) {
    /**
     * @ngdoc method
     * @name get
     * @methodOf wpApp.apiCalls.SinglePlatformRes
     * @param {Object} params Parameters for get.
     * @param {String} params.location_slug In Single Platform UI, dbl-click a location. In the url for that location is the slug
     * @returns {Object} Returns object with $promise. See $resource documentation for more info
     * @description Queries for Single Platform API by location
     */


    var URL = $rootScope.brixxApi,
        resource = '/singleplatform/';
        
    return $resource(URL + resource,{
        location_slug:'@location_slug'
    },{
        getMenus: {
            method:'get',
            params: {
                menus:true,
                location_slug:'@location_slug'
            }
        }

    },{stripTrailingSlashes:false});    
    
})



/**
 * @ngdoc service
 * @name wpApp.apiCalls.ApiRes
 * @description
 * Returns object with methods for getting wordpress post object
 */
.factory('ApiRes', function($resource, $rootScope, $log) {
    /**
     * @ngdoc method
     * @name query
     * @methodOf wpApp.apiCalls.ApiRes
     * @param {Object} params Parameters for query.
     * @param {String} params.route Choose from list of available routes in the JSON REST API Plugin
     * @returns {Object} Returns object with $promise. See $resource documentation for more info
     * @description Queries for WordPress objects by route
     */


    var URL = $rootScope.api,
        urlTemplate = ':route';

    return $resource(URL + urlTemplate,{},{
    	query: {
    		isArray: true,
    		transformRequest:function(data){
    			//$log.log('data: ', data);
    		}
    	}

    });
})

/**
 * @ngdoc service
 * @name wpApp.apiCalls.PostRes
 * @description
 * Returns object with methods for getting wordpress post object
 */
.factory('PostsRes', ['$resource', '$rootScope', '$log',
    function($resource, $rootScope, $log) {
    var URL = $rootScope.api,
        resource = 'posts',
        urlTemplate = '/:id';

    return $resource(URL + resource + urlTemplate,{},{});
}])


/**
 * @ngdoc service
 * @name wpApp.apiCalls.PostBySlugRes
 * @description
 * Returns object with methods for getting wordpress post object by slug
 */
.factory('PostsBySlugRes', ['$resource', '$rootScope', '$log',
    function($resource, $rootScope, $log) {
    var URL = $rootScope.api,
        resource = 'posts',
        urlTemplate = '?filter[name]=:slug';

    return $resource(URL + resource + urlTemplate,{},{});
}])

/**
 * @ngdoc service
 * @name wpApp.apiCalls.CustomPostsRes
 * @description
 * Returns custom post types
 */
.factory('CustomPostsRes', ['$resource', '$rootScope', '$log',
    function($resource, $rootScope, $log) {
    var URL = $rootScope.api,
        resource = 'posts',
        urlTemplate = '?type[]=:postType&filter[post_status]=publish&filter[posts_per_page]=-1&filter[orderby]=post_title&filter[order]=asc';

    return $resource(URL + resource + urlTemplate,{},{});
}])



/**
 * @ngdoc service
 * @name wpApp.apiCalls.TaxRes
 * @description
 * Returns object with methods for getting wordpress taxonomy objects
 */
.factory('TaxRes', ['$resource', '$rootScope', '$log',
    function($resource, $rootScope, $log) {
    /**
     * @ngdoc method
     * @name query
     * @methodOf wpApp.apiCalls.TaxRes
     * @param {Object} params Parameters for query.
     * @returns {Object} Returns object with $promise. See $resource documentation for more info
     * @description Queries for taxonomies
     */


    var URL = $rootScope.api,
        resource = 'taxonomies',
        urlTemplate = '/:taxonomy';

    return $resource(URL + resource + urlTemplate,{},{
        query: {
            isArray: true,
            transformRequest:function(data){
                //$log.log('data: ', data);
            }
        }

    });
}])

/**
 * @ngdoc service
 * @name wpApp.apiCalls.TaxTermsRes
 * @description
 * Returns object with methods for getting terms for a given taxonomy
 */
.factory('TaxTermsRes', ['$resource', '$rootScope', '$log',
    function($resource, $rootScope, $log) {
    
    var URL = $rootScope.api,
        resource = 'taxonomies',
        urlTemplate = '/:taxonomy/terms/';

    return $resource(URL + resource + urlTemplate,{},{});
}]);
