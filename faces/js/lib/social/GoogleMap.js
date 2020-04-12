var gMap = null;
var gMarker = null;

(function() {
	if (!window.google)
	   alert("Unable to load google maps API");
})();

var gMapWin = new google.maps.InfoWindow({ 
	size: new google.maps.Size(1300,700)
});

//12.910289641614233,77.60423755593365

ui.init_googleMaps = function(node) {
	
	var latlng = node.getAttribute("latlng");
	
	var ops = {
		zoom: 13,
		center: new google.maps.LatLng(12.9109589,77.60347366),
		mapTypeControl: true,
		mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
		navigationControl: true,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	}
	
	gMap = new google.maps.Map(node,ops);
	google.maps.event.addListener(gMap, 'click', function() {
		gMapWin.close();
	 });

	google.maps.event.addListener(gMap, 'click', function(event) {
		  
		//call function to create marker
	         if (gMarker) {
	        	 gMarker.setMap(null);
	        	 gMarker = null;
	         }
	         gMarker = createMarker(event.latLng);
	  });
	
	if (latlng) {
		var l = latlng.split(",");
		latlng = new google.maps.LatLng(l[0],l[1]);
		createMarker(latlng);
		
		var radius = node.getAttribute("radius");
		
		if (radius) {
			
			
			 var populationOptions = {
				      strokeColor: '#8FAF65',
				      strokeOpacity: 0.8,
				      strokeWeight: 2,
				      fillColor: '#6A9531',
				      fillOpacity: 0.35,
				      map: gMap,
				      center: latlng,
				      radius: radius*500
				    };

			 new google.maps.Circle(populationOptions);
		}
		
	}
	
}

function createMarker(latlng) {
    var marker = new google.maps.Marker({
        position: latlng,
        map: gMap,
        zIndex: Math.round(latlng.lat()*-100000)<<5
    });

    google.maps.event.addListener(marker, 'click', function() {
    	gMapWin.open(gMap,marker);
    	gAddress(marker.position);
    });
    google.maps.event.trigger(marker, 'click');    
    return marker;
}

function gAddress(latlng) {
	latlng = latlng.lat()+","+latlng.lng();

	var gc = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+latlng+"&sensor=false";
	
	$.get(gc,function(data) {
		if (typeof data == 'string')
		  data =  JSON.parse(data);
		if (data['status'] == 'OK') {
		  data = data['results'][0];
		  var address = new Address();
		  for ( var i = 0, inp; inp=data['address_components'][i++];) {
			  var type = inp['types'][0];
			  
			  switch (type) {
			  case "route" :
				  address.address1 = inp['long_name'];
				  break;
			  case "neighborhood" :
				  address.address2 = inp['long_name'];
				  break;	
			  case "sublocality" :
				  address.area = inp['long_name'];
				  break;	  
			  case "postal_code" :
				  address.pin = inp['long_name'];
				  break;
			  }
		  }
		  
//		  var e = {};
//		  e.name = EventName.entity("Address");
//		  e.data = address;
//		  eventQueue.publish(e);
		}
	});
}