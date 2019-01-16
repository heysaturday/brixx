<?php 
/* 
 * Template Name: Style Guide 
*/
?>
<?php 
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup;
?>
<div class="style-guide-wrap" ng-controller="StyleGuideCtrl">
<h1>Style Guide</h1>

<div>
	<h3>Geocoding Services</h3>
	


</div>

<div>
	<h3>Google Map</h3>
	<div id="map-canvas" style="width: 100%; height: 150px"></div>


</div>

<div>
	<h3>Typography</h3>
	<h4>Homepage Headline</h4>
	<div class="page-title">
		<h1>Your <i class="icon-marker-icon-font-01 shift"></i> Brixx</h1>
	</div>
	<h4>Social Icon Fonts</h4>
	<i class="fa fa-facebook"></i>
	<i class="fa fa-twitter"></i>
	<i class="fa fa-instagram"></i>


</div>

<div>
	<h3>Theme Options</h3>
	<p>Single platform slug for currently selected location: {{currentLocation.locationOptions.single_platform_location_slug}}</p>
</div>

<div>
	<h3>Single Platform info for current location</h3>
	<p>Phone: {{currentLocation.phone}}</p>
	<h4>Menu categories:</h4>
	<ul>
		<li ng-repeat="menu in currentLocation.menu">{{menu.name}}</li>	

	</ul>



</div>

<h3>Angular Loop</h3>
<!-- display all post titles in a list -->
<ul>
	<li ng-repeat="post in postdata">{{post.title}}</li>
</ul>
<h3>WordPress Loop:</h3>
<?php get_template_part('loop') ?>

</div>
<!-- style-guide-wrap -->