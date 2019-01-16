'use strict';

/**
 * Hero Area
 * Get control of height to fold for display of nav items.
 */
angular.module('wpApp.directives')


.directive('heroArea', ['$timeout',
    function($timeout) {

    var controller = [ '$scope', '$element', '$window',
            function($scope, $element, $window) {
                $scope.heroHeight = $element.height();
                $scope.windowHeight = $window.innerHeight;
            }
        ];

    return {
        restrict: 'EA', //Default in 1.3+
        scope: {
            datasource: '='
        },
        controller: controller,
        link: function(scope, iElement, iAttrs, controller) {
            var currentHeight = iElement.height(),
                currentWidth = iElement.width(),
                videos = iElement.find('video'),
                images = iElement.find('img'),
                sizeMedia = function(){
                    var mediaEl;
                    if( videos.length < 1 && images < 1 ){
                        return;
                    }
                    if(videos.length>0) {
                        mediaEl = angular.element(videos[0]);
                    } else {
                        mediaEl = angular.element(images[0]);
                        if(mediaEl.height() < iElement.height()){
                            mediaEl.height(iElement.height());
                        }
                        if(mediaEl.width() < iElement.width()){
                            mediaEl.css('height', '');
                            mediaEl.width(iElement.width());
                        }
                    }
                };

            if(currentHeight > scope.windowHeight) {
                iElement.height(scope.windowHeight);
            }
            sizeMedia();

            iElement.bind('resize', function(){
                sizeMedia();
            });


        }
    };


}]);
