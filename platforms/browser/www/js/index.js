var app = {
    initialize: function () {
        this.bindEvents();
    },
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
        app.getPosition();
    },
    receivedEvent: function (id) {
    },
    getPosition: function () {
        // Api key for the weather api as string
        var weatherApiKey = null;
        var long = 0;
        var lat = 0;
        var options = {
            enableHighAccuracy: true,
            maximumAge: 3600000
        }
        if(weatherApiKey != null){
            navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
            function onSuccess(position) {
                long = position.coords.longitude;
                lat = position.coords.latitude;
                // Weather url
                var queryString = 'http://api.openweathermap.org/data/2.5/weather?lat='
                    + lat + '&lon=' + long + '&appid=' + weatherApiKey + '&units=metric';
                // Get weather
                $.getJSON(queryString, function (results) {
                    if (results.weather.length) {
                        $('#title').text(results.name);
                        $('#temperature').text(results.main.temp);
                        $('#wind').text(results.wind.speed);
                        $('#humidity').text(results.main.humidity);
                        $('#visibility').text(results.weather[0].main);
                        var sunriseDate = new Date(results.sys.sunrise * 1000);
                        $('#sunrise').text(sunriseDate.toLocaleTimeString());
                        var sunsetDate = new Date(results.sys.sunset * 1000);
                        $('#sunset').text(sunsetDate.toLocaleTimeString());
                    }else{
                        alert("No weather data!");
                    }
                });
                // Get map and places
                map = new google.maps.Map(document.getElementById("map"), {
                    center: new google.maps.LatLng(0, 0),
                    zoom: 13,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                });
                var location = new google.maps.LatLng(lat, long);
                var marker = new google.maps.Marker({ 
                    position: location,
                    title: 'YOU',
                    icon: {url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
                });
                marker.setMap(map);
                map.setCenter(marker.getPosition());
                // Get nearby locations
                var request = {
                    location: location,
                    radius: '10000',
                    type: ['restaurant']
                };
                var service = new google.maps.places.PlacesService(map);
                service.nearbySearch(request, function(result){
                    // Set marker for each location
                    result.forEach(function(place){
                        var marker = new google.maps.Marker({ 
                            position: place.geometry.location,
                            title: place.name,
                            label: {
                                color: 'black',
                                fontWeight: 'bold',
                                text: place.name
                            },
                        });
                        marker.setMap(map);
                    });
                });
    
            };
    
            function onError(error) {
                alert("No location data!");
            }
        }else{
            alert("Please, add the weather api key (in the index.js) and the google maps api key (in the index.html file)");
        }
        
    }
};
