<?php
namespace Brixx\Options;

class Menu extends \RedHammer\WordPress\Options\Menu {

	public function __construct($menuArgs=array()) {


		parent::__construct($menuArgs);


	 }
	
	

	 /**
	 * [theme_options_page_load Here's our chance to load scripts and styles for our options page]
	 * @return [type] [description]
	 */
	function theme_options_page_load() {
	    //Enqueue styles and scripts
	    $uri= content_url() . '/src/RedHammer/WordPress/ThemeCustomization/assets';
	    wp_enqueue_script('rh-theme-options-admin-script', $uri .  '/js/options-page-scripts.js' , array('jquery'));
	    wp_enqueue_style('rh-theme-options-admin-style', $uri .  '/css/options-page-styles.css');

	    wp_enqueue_script('brx-theme-options-admin-script',get_stylesheet_directory_uri() .  '/Options/assets/js/options-page-scripts.js' , array('jquery'), NULL, true);

	    

	}

	public function setLatLng($oldvalue, $newvalue) {
		if(array_key_exists('street_1',$newvalue)) {
			//Then we are dealing with a saved addres...check for presence of necessary params
			extract($newvalue, EXTR_SKIP);
			
			if(rh_isset($street_1) && rh_isset($city) && rh_isset($state)) {
				$addressString = urlencode(implode(' ', $newvalue));
				
				
			}
		}
	}

	 

	
	

	
	
	
}//end class


