app.directive('arrmap', function () {
    'use strict';
    var directionsDisplay = new google.maps.DirectionsRenderer(),
        directionsService = new google.maps.DirectionsService(),
        geocoder = new google.maps.Geocoder(),
        map,
        marker,
        mapObj,
        infowindow;

    mapObj = {
        restrict: 'EAC',
        scope: {
            origin: '@',
            markerContent: '@',
            zoom: '=',
            type: '@',
            directions: '@'
        },
        replace: true,
        templateUrl: '/views/arrmap.html',
        link: function (scope, element) {
            scope.init = function () {
                var mapOptions = {
                    scrollwheel: false,
                    zoom: scope.zoom !== undefined ? scope.zoom : 10,
                    mapTypeId: scope.type !== undefined ? scope.type.toLowerCase() : 'roadmap',
                    streetViewControl: false
                };
                map = new google.maps.Map(document.getElementById('arrMap'), mapOptions); // todo: use angular-element :)
                scope.startPoint = scope.origin !== undefined ? scope.origin : '1600 Amphitheatre Parkway, Santa Clara County, CA';

                var trafficLayer = new google.maps.TrafficLayer();
                trafficLayer.setMap(map);

                geocoder.geocode({
                    address: scope.startPoint
                }, function (results, status) {
                    var location = results[0].geometry.location;
                    if (status === google.maps.GeocoderStatus.OK) {
                        map.setCenter(location);
                        marker = new google.maps.Marker({
                            map: map,
                            position: location,
                            animation: google.maps.Animation.DROP
                        });
                        infowindow = new google.maps.InfoWindow({content: scope.markerContent !== undefined ? scope.markerContent : 'Airport'});
                        google.maps.event.addListener(marker, 'click', function () {
                            return infowindow.open(map, marker);
                        });

                    } else {
                        alert('Cannot Geocode');
                    }

                });


            };

            scope.init();

            scope.getDirections = function () {
                var request = {
                    origin: scope.startPoint,
                    destination: scope.destination,
                    travelMode: google.maps.DirectionsTravelMode.DRIVING
                };
                directionsService.route(request, function (response, status) {
                    return status === google.maps.DirectionsStatus.OK ? directionsDisplay.setDirections(response) : console.warn(status);
                });
                directionsDisplay.setMap(map);

                directionsDisplay.setPanel(document.getElementById('arrDirectionsList')); // again need to use angular element thats ugly otherwise.
            };

            scope.clearDirections = function () {
                scope.init();
                directionsDisplay.setPanel(null);
                scope.destination = '';
            };

        }
    };

    return mapObj;

});
