'use strict';

/**
 * plugins
 * This modules is instantiated here allowing use to tap into the app scripts via plugins.
 * In our plugins we call angular.module('wpApp.plugins') at the top of our scripts and pass sub-modules to it:
 * 
    'use strict';
    //Inject into existing wpApp plugins module. Assumes Red Hammer pattern.

    angular.module('wpApp.plugins')

    .filter('searchFilter',['$filter', function($filter){
        return function(list, categoryName){
            var filteredItems = [];
            var arrayFilter=[categoryName];
            for (var i = 0; i < list.length; i++) {
                if(list[i].terms && list[i].terms.category) {                    
                    var hasCategory = $filter('inArray')(list[i].terms.category,arrayFilter, 'slug');
                    if(hasCategory.length>0) {
                        filteredItems.push(list[i]);
                        
                    }
                }
            }
            return filteredItems;
        };
    }]) 
 */

angular.module('wpApp.plugins', []);





