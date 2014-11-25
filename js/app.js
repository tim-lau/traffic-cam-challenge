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
		zoom: 12 
	};

	// create the map
	var map = new google.maps.Map(mapElem, mapOptions);
	var infoWindow = new google.maps.InfoWindow();

	var stations;
	var markers = [];

	$.getJSON('http://data.seattle.gov/resource/65fc-btcc.json')
		.done(function(data) {
			stations = data;
			// Populates map with markers according to latitude/longitude data
			data.forEach(function(station) {
				var marker = new google.maps.Marker({
					position: {
						lat: Number(station.location.latitude),
						lng: Number(station.location.longitude)
					},
					map: map
				});
				markers.push(marker);

                // Shows info window when a marker is clicked
                google.maps.event.addListener(marker, 'click', function() {
                	map.panTo(marker.getPosition());
                	var html = '<p>' + station.cameralabel + '</p>';
                	html += '<img src=' + station.imageurl.url + '>';
                	infoWindow.setContent(html);
                	infoWindow.open(map,this);

                	// When clicked, marker bounces for about 2 seconds
                	marker.setAnimation(google.maps.Animation.BOUNCE);
                	setTimeout(function() {
                		marker.setAnimation(null);	
                	}, 2150);
                });

                // If user clicks on the map, close the info window
                google.maps.event.addListener(map, 'click', function() {
                	infoWindow.close();
                });

                // Filters the markers based on user input
                $("#search").bind('search keyup', function() {
                	var query = this.value.toLowerCase();
                	// removes marker if user search input does not match
                	if (station.cameralabel.toLowerCase().indexOf(query) < 0) {
                		marker.setMap(null);
                	// leaves marker in if user search input matches
                	} else {
                		marker.setMap(map);
                	}
            	}); 

            });
		}) 

		// If there is an error loading data
		.fail(function(error) {
			window.alert(error);
		})
	});