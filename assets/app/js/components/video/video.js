'use strict';
/* Video components */

angular.module('wpApp.components')

.directive('video', ['$timeout', '$rootScope',
    function ($timeout, $rootScope) {
    return {
        restrict: 'E',
        link: function (scope, iElement, iAttrs) {
            var video = angular.element(iElement),
            duration;
            video.attr('preload', 'metadata');
            video.attr('autoplay', 'autoplay');
            video.attr('loop', 'loop');
            //video.css('opacity', 0);
            video.bind('progress', function(e){
                //video.animate( { opacity: 1 }, 'slow');
                video.unbind('progress');
            });
            // $rootScope.$on('documentReady', function(){
            //     video.animate( { opacity: 1 }, 'slow');
            // });






        }
    };
}]);