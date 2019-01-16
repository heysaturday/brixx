<?php use \Brixx\CustomFields\CustomPageElements as CustomPageElements; ?>
<?php use \Brixx\Classes\Location as Location; ?>
<?php
// Establish our beer menu display
// global $post;
// $useBeerMenu = false;
// $is_beer_menu =  CustomPageElements::getIsBeerMenu($post->ID);
// $is_beer_menu = !isset($is_beer_menu) || empty($is_beer_menu) || $is_beer_menu === 0 ? false: true;
// if($is_beer_menu) {
// 	$locationEmbedCode = false;
// 	$defaultLocation = new Location(1);
// 	$defaultEmbedCode = $defaultLocation->getBeerMenu();
// 	if( isset(  $_SESSION['selectedLocationId'] ) && !empty(  $_SESSION['selectedLocationId'] ) && $_SESSION['selectedLocationId'] > 0 ) {
// 		$currentLocationId = $_SESSION['selectedLocationId'];
// 		$loc = new Location($currentLocationId);
// 		// Check for embed code
// 		$locationEmbedCode = $loc->getBeerMenu();
// 	}
// 	$embedCode = $locationEmbedCode ? $locationEmbedCode : $defaultEmbedCode;
//
// 	if($embedCode) {
// 		$useBeerMenu = $embedCode;
// 	}
// }
?>
<nutrition-legend></nutrition-legend>

<div class="menus-wrap">
	<section id="menu_{{currentMenu.id}}" class="menu-wrap">
		<?php //if($useBeerMenu): ?>
			<div class="sections-wrap" ng-if="isBeerMenu">
				<div class="section-wrap">
					<div id="menu_widget">
				    <div id="menu_widget_{{beerMenuId}}">
				      <a href="https://www.beermenus.com/?ref=widget">Powered by BeerMenus</a>
				    </div>
				  </div>
				  <!-- <script ng-src="https://www.beermenus.com/menu_widgets/{{beerMenuId}}" type="text/javascript" charset="utf-8"></script> -->
				  <!-- <script src="https://www.beermenus.com/menu_widgets/{{beerMenuId}}" type="text/javascript" charset="utf-8"></script> -->
					<?php //echo $useBeerMenu; ?>
					<!-- <div id="menu_widget">
						 <div id="menu_widget_31419">
						   <a href="https://www.beermenus.com/?ref=widget">Powered by BeerMenus</a>
						 </div>
					</div>
					<script src="https://www.beermenus.com/menu_widgets/31419" type="text/javascript" charset="utf-8"></script> -->
				</div>
			</div>
		<?php //endif; ?>
		<?php //if(!$useBeerMenu): ?>
			<div class="sections-wrap" ng-if="!isBeerMenu">
				<div id="section_{{section.id}}" class="section-wrap" ng-repeat="section in currentMenu.sections.collection">
					<h3 ng-if="currentMenu.sections.collection.length > 1">{{section.name}}</h3>
					<p>{{section.description}}</p>
					<ul class="items-list">
						<li ng-repeat="item in section.menuItems">
							<h5>{{item.name}}&nbsp;&nbsp;<span class="nutrition-icons-stack" nutrition-icons nutrition-atts="item.attributes" ></span></h5>
							<span class="description">{{item.description}}</span>
							<em>{{item.price | currency:"$"}}</em>
							<em ng-repeat="option in item.options">{{option.name}} &nbsp;&nbsp; {{option.price | currency:"$"}}</em>
						</li>
					</ul>
				</div>
				<!-- #section-wrap -->
			</div>
			<!-- #sections-wrap -->
		<?php //endif; ?>
	</section>
	<!-- #menu-wrap -->

</div>
<!-- #menus-wrap -->

<?php
// global $post;
// $flyoutContent = CustomPageElements::getPrimaryFlyouts($post->ID);
// if($flyoutContent) {
// 	echo $flyoutContent;
// }


?>


<!-- <flyout>
	<flyout-content title="Full Menu" id="menu-nav-flyout">
		<nav class="block-nav">
			<ul>
				<li ng-repeat="menu in menuCollection.menus"><a ng-click="changeMenu(menu.id)">{{menu.name}}</a></li>
			</ul>
		</nav>
	</flyout-content>
</flyout>
<div class="flyout-wrapper nutrition">
	<a href="http://redhammerworks.com" class="flyout-toggle-btn "><i class="fa fa-plus"></i>&nbsp;&nbsp;View Nutrition</a>
</div> -->