'use strict';

/* Services */


// Demonstrate how to register services
// In this case it is a simple value service.
angular.module('wpApp.services', []);


angular.module('wpApp.services')
        .factory('AppUtilities', function() {
            var AppUtilities = {
                /**
                 * Remove items from client side array by id property
                 */
                deleteById: function(id, sourceArray) {
                    var found=false;
                    for (var i = 0; i < sourceArray.length; i++) {
                        if (Number(sourceArray[i].id) == Number(id)) {
                            sourceArray.splice(i, 1);
                            found = id;
                        }
                    }
                    return found;
                }
            };
            return AppUtilities;
        })
        
        
        .factory('MessageService', function($rootScope, $timeout) {
            return {
                setMessage: function(message) {
                    $rootScope.statusMessage = message;
                },
                clearMessage: function() {
                    $rootScope.statusMessage = null;
                },
                setTempMessage: function(message, delay, readyMsg) {
                    var readyMessage = !readyMsg ? 'Ready.' : readyMsg;
                    var delayTime =  delay || 2000;
                    $rootScope.statusMessage = message;
                    $timeout(function() {
                        $rootScope.statusMessage = readyMessage;
                    }, delayTime);
                }
            };
        })
        
        /**
         * Found the following methods on the web. Transforms angular posts to a format OAuth2.0 requires
         * 
         */
        // I provide a request-transformation method that is used to prepare the outgoing
        // request as a FORM post instead of a JSON packet.
        .factory(
                'transformRequestAsFormPost',
                function() {

                    // I prepare the request data for the form post.
                    function transformRequest(data, getHeaders) {
                        var headers = getHeaders();
                        headers[ 'Content-Type' ] = 'application/x-www-form-urlencoded';
                        return(serializeData(data));
                    }


                    // Return the factory value.
                    return(transformRequest);


                    // ---
                    // PRVIATE METHODS.
                    // ---


                    // I serialize the given Object into a key-value pair string. This
                    // method expects an object and will default to the toString() method.
                    // --
                    // NOTE: This is an atered version of the jQuery.param() method which
                    // will serialize a data collection for Form posting.
                    // --
                    // https://github.com/jquery/jquery/blob/master/src/serialize.js#L45
                    function serializeData(data) {

                        // If this is not an object, defer to native stringification.
                        if (!angular.isObject(data)) {

                            return((data == null) ? '' : data.toString());

                        }

                        var buffer = [];

                        // Serialize each key in the object.
                        for (var name in data) {

                            if (!data.hasOwnProperty(name)) {

                                continue;

                            }

                            var value = data[ name ];

                            buffer.push(
                                    encodeURIComponent(name) +
                                    '=' +
                                    encodeURIComponent((value == null) ? '' : value)
                                    );

                        }

                        // Serialize the buffer and clean it up for transportation.
                        var source = buffer
                                .join('&')
                                .replace(/%20/g, '+')
                                ;

                        return(source);

                    }

                }
        );











