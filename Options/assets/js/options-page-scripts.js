var geocoder;
var addressArray;
function initAddress(e) {
	e.preventDefault();
	var dataArray = jQuery('#rh_theme_options_form').serializeArray();
	var street_1 = _.filter(dataArray, function(obj){
		return obj.name.indexOf('rh_settings[street_1]')>-1;
	})[0].value;
	var street_2 = _.filter(dataArray, function(obj){
		return obj.name.indexOf('rh_settings[street_2]')>-1;
	})[0].value;
	var city = _.filter(dataArray, function(obj){
		return obj.name.indexOf('rh_settings[city]')>-1;
	})[0].value;
	var state = _.filter(dataArray, function(obj){
		return obj.name.indexOf('rh_settings[state]')>-1;
	})[0].value;
	var zip = _.filter(dataArray, function(obj){
		return obj.name.indexOf('rh_settings[zip]')>-1;
	})[0].value;
	if(street_1 && city && state) {
		addressArray = [ street_1, street_2, city, state, zip];
		codeAddress();
	} else {
		alert("You will need to populate the address fields before using this button.");
	}
  	
}
function initialize() {
	geocoder = new google.maps.Geocoder();
	addressArray = [];
	var btn = document.getElementById("rh_settings_getlatlng_");
	if(btn) {
		btn.onclick = initAddress;
	}
	
}	
function codeAddress() {
	addressString = addressArray.join(',');
	var address= addressString;
	
	geocoder.geocode({'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {

			if (results.length) {
				var location = results[0].geometry.location;
				var latLngField = jQuery('#rh_settings_latlng_');				
				latLngField.val(location.lat() + ', ' + location.lng());
				alert('Coordinates set. You now need to click Save Changes to preserve your changes.');
				
			} else {
				alert('No results found');
			}
		} else {
			alert('Geocoder failed due to: ' + status);
		}
	});
}

google.maps.event.addDomListener(window, 'load', initialize);
