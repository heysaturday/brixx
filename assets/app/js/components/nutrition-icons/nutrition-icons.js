'use strict';


angular.module('wpApp.directives')

/**
 * Displays nutrition legend
 */
.directive('nutritionLegend', ['AdminAjaxRes', '$timeout', 'toastr',
    function(AdminAjaxRes, $timeout, toastr) {

    var controller = [ '$scope', '$element', '$attrs', '$transclude',
            function($scope, $element, $attrs, $transclude) {  
                $scope.nutrition_link='#'; 
                AdminAjaxRes.save(
                        {
                            action: 'get_theme_options',
                            formData: {
                                slug: 'nutrition_pdf'
                            }  
                        }
                    )
                    .$promise
                    .then(
                        function(dto) {
                            if (dto.error) {
                                toastr.error(dto.message, 'Error');                                
                            }
                            $timeout(function(){
                                $scope.nutrition_link = dto.data;
                            });
                    
                        },
                        function(err) {
                            toastr.error(err, 'Error');
                        }
                    );
                
            }
        ],
        templateUrl = function(element, attributes) {
            if (attributes.templateUrl) {
                return 'js/components/nutrition-icons/' + attributes.templateUrl;
            }
            return 'js/components/nutrition-icons/nutrition-legend.html';
        };

    return {
        restrict: 'EA', //Default in 1.3+
        scope: {},
        controller: controller,
        templateUrl: templateUrl,
        link: function(scope, iElement, iAttrs, controller) { 
            

        }
    };


}])

/**
 * Displays icons next to our menu item headings
 */
.directive('nutritionIcons', ['$timeout',
    function($timeout) {

    var controller = [ '$scope', '$element', '$attrs', '$transclude',
            function($scope, $element, $attrs, $transclude) {    
                
            }
        ],
        templateUrl = function(element, attributes) {
            if (attributes.templateUrl) {
                return 'js/components/nutrition-icons/' + attributes.templateUrl;
            }
            return 'js/components/nutrition-icons/nutrition-icons.html';
        };

    return {
        restrict: 'EA', //Default in 1.3+
        scope: {
            nutritionAtts:'='
        },
        controller: controller,
        templateUrl: templateUrl,
        link: function(scope, iElement, iAttrs, controller) { 
            if(scope.nutritionAtts['gluten-free']) {
                scope.nutritionAtts.glutenFree = true;               
            } else {
                scope.nutritionAtts.glutenFree = false;
            }
           

        }
    };


}]);
