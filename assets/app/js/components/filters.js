'use strict';

/* Filters */
angular.module('wpApp.filters', []);
angular.module('wpApp.filters')

.filter('urlencode', function() {
    return function(input) {
        return window.encodeURIComponent(input);
    };
})

.filter('interpolate', ['version', function(version) {
        return function(text) {
            return String(text).replace(/\%VERSION\%/mg, version);
        };
    }])
    .filter('escapeHTML', function(text) {
        if (text) {
            return text.
            replace(/&/g, '&amp;').
            replace(/</g, '&lt;').
            replace(/>/g, '&gt;').
            replace(/'/g, '&#39;').
            replace(/"/g, '&quot;');
        }
        return '';
    })

//We already have a limitTo filter built-in to angular,
//let's make a startFrom filter
.filter('startFrom', function() {
        return function(input, start) {
            if (input) {
                start = +start; //parse to int
                return input.slice(start);
            }

        };
    })
    //For filtering an array BY an array. Equivalent to php in_array.
    //@param [array] list The list to filter
    //@param [array] arrayFilter the array to filter by
    //@param [string] The property to filter on
    .filter('inArray', function($filter) {
        return function(list, arrayFilter, element) {
            var filteredItems = [];
            for (var i = 0; i < arrayFilter.length; i++) {
                for (var z = 0; z < list.length; z++) {
                    var filter = arrayFilter[i].toString();
                    var item = list[z][element].toString();
                    if (filter === item) {
                        filteredItems.push(list[z]);
                        break;
                    }
                }
            }
            return filteredItems;
        };
    });
