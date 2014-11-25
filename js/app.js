// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

"use strict";

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

$(document).ready(function() {
	var mapElem = document.getElementById('map');
	var mapOptions = {
		center: {lat: 47.6, lng: -122.3},
		zoom: 12 // 0 = Earth to 21 = Max Zoom
	};


	// create the map
	var map = new google.maps.Map(mapElem, mapOptions);

	var infoWindow = new google.maps.InfoWindow();

	var stations;
	var markers = [];

	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			stations = data;

			data.forEach(function(station) {
                var marker = new google.maps.Marker({
                    position: {
                        lat: Number(station.location.latitude),
                        lng: Number(station.location.longitude)
                    },
                    map: map
                });
                markers.push(marker);

                google.maps.event.addListener(marker, 'click', function() {
                	map.panTo(marker.getPosition());
                	var html = '<p>' + station.cameralabel + '</p>';
                	html += '<img src=' + station.imageurl.url + '>';
                	infoWindow.setContent(html);
                	infoWindow.open(map,this);
                });

                $("#search").bind('search keyup', function() {
                	var query = this.value.toLowerCase();
                	console.log(query);

                	// removes marker if search query does not exist 
                	if (station.cameralabel.toLowerCase().indexOf(query) < 0) {
                		marker.setMap(null);
                	// leaves marker in if search phrase exists
                	} else {
                		marker.setMap(map);
                	}

                });

            });
			//success
		})
		.fail(function(error) {
			window.alert('An error occurred!');
		})
		.always(function() {
			//called on either success or failure
		})
 
});
