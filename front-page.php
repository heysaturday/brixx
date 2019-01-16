<?php use \Brixx\Classes\Media as Media; ?>
<?php use \Brixx\Classes\HomepageMedia as HomepageMedia; ?>
<div class="front-page-wrap">
	<div id="brixx-hero" hero-area>
		<?php
			$media = new HomepageMedia();
			echo $media;
		?>
		<scroll-btn></scroll-btn>
			<nav class="hero-nav-container desktop-nav-items" >
				<?php include get_stylesheet_directory() . '/inc/primary-nav.php'; ?>
		    </nav>
	    <div class="hero-selector selector-tab" location-selector template-url="desktop-selector.html" has-heading="true"></div>
	</div>
	<!-- Desktop fixed homepage navigation navigation -->
	<div class="fixed-nav" at-top>
    	<main-nav class="desktop"></main-nav>
    </div>
    <div id="brixx-location-table">
    	<div id="brixx-location-table-row">
			<div id="brixx-location" class="hero" location-selector></div>

		</div>
	</div>
	<!-- Hours -->
	<location-hours></location-hours>

	<!-- <div class="filter-form-wrap" location-selector template-url="filter-selector.html" ng-show="api.locationApi.currentLocationId < 0"></div> -->

	<div class="filter-form-wrap" ng-show="api.locationApi.currentLocationId < 0">
		<form class="form-inline filter-form">
		  <div class="form-group">
		    <label>Filter By</label>
		    <input ng-click="api.locationApi.showLocations()" type="text" class="form-control" placeholder="State or Zip">
		  </div>
		  <!-- form-group -->
		</form>
	</div>
	<!-- Map -->

    <!--<iframe src="https://www.google.com/maps/embed/v1/place?key=AIzaSyDk5fO87L8WDLReyLDcynSPmVjdzs9VX7o&q=+Brixx+Woodfire+Pizza+E+7th+St,+Charlotte,+NC" width="600" height="450" frameborder="0" style="border:0" allowfullscreen></iframe>-->

	<google-map></google-map>
	<div class="locale-wrap" ng-show="api.locationApi.currentLocationId>0">
		<!-- Manager -->

		<div id="brixx-manager" class="hero" ng-controller="ContactCtrl" ng-style="{'background-image': 'url('+api.currentLocation.locationOptions.location_manager_image+')'}">
			<div id="brixx-manager-content">
				<h5>Your<br />Manager</h5>
				<strong>{{api.currentLocation.locationOptions.location_manager}}</strong><br />
				<button class="btn btn-change" ng-click="openEmailModal()"><i class="fa fa-plus"></i> Contact</button>
			</div>
		</div>
		<tabs class="tabbed-nav-wrap desktop" >
			<pane title="Specials" class="desktop specials-pane">
				<div class="scrollme" ng-scrollbar rebuild-on-resize rebuild-on="rebuildNgScrollbar" is-bar-shown="barShown">
  					<div specials class="specials-wrap" show-all="true"></div>
				</div>

			</pane>
			<pane title="Events/Happy Hours">
				<div brixx-events class="events-wrap"></div>
			</pane>
		</tabs>

		<tabs class="tabbed-nav-wrap mobile" >
			<pane title="Specials">
				<specials show-all="false"></specials>
			</pane>
			<pane title="Events/Happy Hours">
				<brixx-events></brixx-events>
			</pane>
		</tabs>

	</div>
</div>
<!-- #front-page-wrap -->

