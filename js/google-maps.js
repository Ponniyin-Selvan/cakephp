function loadMemberMap() {
  if (GBrowserIsCompatible()) {
	var iconRed = new GIcon();
    iconRed.image = 'http://maps.google.com/mapfiles/ms/micons/red-dot.png';
	iconRed.iconSize=new GSize(32,32);
   	iconRed.iconAnchor=new GPoint(16,32);
	iconRed.infoWindowAnchor=new GPoint(16,0);

    var map = new GMap2(document.getElementById("message-map"));
    map.setCenter(new GLatLng(0,0 ), 2);
    map.addControl(new GLargeMapControl());
    map.addControl(new GMapTypeControl());
    map.addControl(new GScaleControl());
    var bounds = new GLatLngBounds();
	for (i = 0 ; i < map_json.postInfo.length ; i++) {
		var map_info = map_json.postInfo[i];
		var point = new GLatLng(map_info['member_latitude'],
                                     map_info['member_longitude']);
        var marker = createMarker(point, map_info, iconRed);
	    function importanceOrder (marker,b) {
	       return GOverlay.getZIndex(marker.getPoint().lat()) + marker.importance*1000000;
	    }
	    marker.importance = map_info['count'] % 10;
        map.addOverlay(marker, {zIndexProcess:importanceOrder});
  		bounds.extend(point);
	}
    map.setZoom(map.getBoundsZoomLevel(bounds));
    map.setCenter(bounds.getCenter());
  } else {
    alert('Sorry, Your browser is not compatible to show Google Maps');
  }
}

function createMarker(point, map_info, icon) {

	var marker = new GMarker(point, icon);
	                                     
	var html =   "<p>" + getMapLabelInfo("Country", map_info['member_country'], true)
	           + getMapLabelInfo("Region", map_info['member_region'], true)
	           + getMapLabelInfo("City", map_info['member_city'], true)
	           + getMapLabelInfo("Messages Posted", map_info['count'], false) + "</p>";

      GEvent.addListener(marker, 'click', function() {
        marker.openInfoWindowHtml(html);
      });
      GEvent.addListener(marker,"mouseover", function() {
        marker.openInfoWindowHtml(html);
      });
	  return marker;
}

function getMapLabelInfo(label, value, linebreak) {
	var text = "";
	if (value != "") {
		text = "<b>" + label + "</b> : " + value;
		if (linebreak) {
			text = text + "<br />";
		}
	}
	return text;
}