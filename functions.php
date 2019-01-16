<?php
use \RedHammer\API\ResponseObject as ResponseObject;

/**
 * Our theme's functions.php file
 * This theme utilizes the Red Hammer Core Framework. A framework of methods and classes to speed custom theme development.
 */



//Theme autoloader
// instantiate the loader
require_once "Psr4Autoloader.php";
$loader = new \Brixx\Psr4Autoloader;
// register the autoloader
$loader->register();
// register the base directories for the namespace prefix
$loader->addNamespace( 'Brixx', dirname( __FILE__ ) );



if ( !defined( 'RH_FRAMEWORK_PATH' ) ) {
	/**
	 * Initialize the Red Hammer Framework. This must occur at the top of the subject theme's functions.php file.
	 */
	include WP_CONTENT_DIR . DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . 'RedHammer' . DIRECTORY_SEPARATOR . 'rh_config.php';

	/**
	 * Override Red Hammer Theme class to customize this theme
	 */
	require_once get_template_directory() . '/inc/Theme.php';
	$theme = new Theme();

	/**
	 * Grab our custom Location class
	 */
	\Brixx\Classes\Location::init();

	/**
	 * And our menu class
	 */
	new \Brixx\Classes\Menu();


	/**
	 * And our event class
	 */
	new \Brixx\Classes\Event();

	/**
	 * And our notification class
	 */
	new \Brixx\Classes\Notification();

	/**
	 * And our contact class
	 */
	new \Brixx\Classes\Contact();

	/**
	 * Gels shortcodes
	 */
	new \Brixx\Classes\Gel();




}

include get_template_directory() . '/inc/shortcodes.php';

/**
 * Location aware methods for controlling access to content
 */

//Ajax method for retrieving location selection from the server. Useful when site has been reached via a mapped domain or subdomain
function rh_get_selected_location_cb(){
	$responseObject = new \RedHammer\API\ResponseObject();
	$preferred_id = filter_var($_REQUEST['pid'], FILTER_SANITIZE_NUMBER_INT);
	if(!$preferred_id) {
		$preferred_id = -1;
	}
	$data = $preferred_id;
	$message = NULL;
	$error = false;
	$responseObject->set( $data, $message, $error );
	echo json_encode( $responseObject );
	die();

}
add_action( 'wp_ajax_rh-get-selected-location', 'rh_get_selected_location_cb' );
add_action( 'wp_ajax_nopriv_rh-get-selected-location', 'rh_get_selected_location_cb' );


//Ajax method for syncing up our location selection to a server side session variable

function rh_set_selected_location_cb(){
	// get the raw POST data
    $rawData = file_get_contents("php://input");
    $postData = json_decode($rawData);

    if( isset( $postData->locationId ) && !empty( $postData->locationId ) ) {
    	$locationId = filter_var($postData->locationId, FILTER_VALIDATE_INT);
    	if($locationId){
    		$_SESSION['selectedLocationId'] = $locationId;
    		die();
    	}
    }

}
add_action('wp_ajax_rh-set-selected-location', 'rh_set_selected_location_cb' );

/**
 * Hide menu items for pages that are exclusive to a set of locations via rh_select_locations in our custom page meta
 * @param  [type] $items [description]
 * @param  [type] $menu  [description]
 * @param  [type] $args  [description]
 * @return [type]        [description]
 */
function exclude_select_location_menu_items( $items, $menu, $args ) {
	if( isset(  $_SESSION['selectedLocationId'] ) && !empty(  $_SESSION['selectedLocationId'] ) ) {
		$currentLocationId = $_SESSION['selectedLocationId'];
	} else {
		$currentLocationId = -1;
	}

    // Iterate over the items to search and destroy.
    // Note: object_id is the object the menu points to, while ID is the menu ID, these are different.
    foreach ( $items as $key => $item ) {
    	$selectedLocations = maybe_unserialize( get_post_meta($item->object_id, 'rh_select_locations', true) );
    	if( isset( $selectedLocations ) && !empty( $selectedLocations ) && count($selectedLocations)>0 ) {
    		if(!in_array($currentLocationId, $selectedLocations)){
    			 unset( $items[$key] );
    		}
    	}
    }

    return $items;
}

add_filter( 'wp_get_nav_menu_items', 'exclude_select_location_menu_items', null, 3 );

/**
 * Lock down subsites
 * Only allow the parent site content to be visible. If any other network blog is being visited...die
 */

/**
 * This callback happens just prior to template_include and gives us a chance to check post values
 * called on template_include
 */
function template_redirect_cb() {
	global $selectedLocationId;
	$blog_id = get_current_blog_id();
	$parentUrl = \Brixx\Classes\Blog::getParentSiteUrl();
	if($blog_id !== 1) {
		wp_redirect($parentUrl . '?pid=' . $blog_id); //If user vists via mapped url or subdomain we pass desired blog id
		exit();
	}

	//Check to see if the optional Select Locations meta has been populated for this page
	global $post;
	if( isset( $post ) && !empty( $post ) ) {
		$selectLocations = maybe_unserialize( get_post_meta($post->ID, 'rh_select_locations', true) );
		if( isset( $selectLocations ) && !empty( $selectLocations ) && count($selectLocations)>0 ) {
			if( !isset( $_SESSION['selectedLocationId'] ) || empty( $_SESSION['selectedLocationId'] ) ) {
				//Exclusive content. Redirect if no location established
				wp_redirect($parentUrl);
				exit();
			}
			if(!in_array($_SESSION['selectedLocationId'], $selectLocations)) {
				wp_redirect($parentUrl);
				exit();
			}
		}
	}

}

/**
 * Swap in login page for template when appropriate
 * called on template_include
 */
function template_include_cb( $template ) {

	//If logged in, return desired page/post template

	return $template;
}
add_action( 'template_redirect', 'template_redirect_cb', 0 );
add_filter( 'template_include', 'template_include_cb', 0 );






//Ajax means of fetching our states list
add_action( 'wp_ajax_rh_get_states', 'rh_get_states_cb' );
add_action( 'wp_ajax_nopriv_rh_get_states', 'rh_get_states_cb' );
function rh_get_states_cb() {

	$responseObject = new \RedHammer\API\ResponseObject();
	$data = \RedHammer\Geography\State::$states_list_of_arrays;
	$message = NULL;
	$error = false;
	$responseObject->set( $data, $message, $error );
	echo json_encode( $responseObject );

	die();
}


//Alter media insertion for responsive images
function filter_image_send_to_editor($html, $id, $caption, $title, $align, $url, $size, $alt) {
  $html = sprintf('<div><img class="img-responsive" alt="%3$s" src="%1$s" /></div>', esc_attr(esc_url($url)), esc_attr($title),  esc_attr($alt));

  return $html;
}
add_filter('image_send_to_editor', 'filter_image_send_to_editor', 10, 8);





/**
 * Contact form customization
 */
include get_template_directory() . '/contactform/contactform-functions.php';


/**
 * Init Emma account information
 * @return [type] [description]
 */
function init_emma() {
    /**
	 * MyEmma
	 */
	$emmaAccount = \Brixx\Classes\EmmaAccount::getInstance();

}
add_action( 'wp_loaded', 'init_emma' );


/**
 * Beer News
 */
function beer_news_success_cb(){
	do_action('rh_capture_form_submit_success');
	die();
}
add_action( 'wp_ajax_rh-fire-beer-news-success', 'beer_news_success_cb' );
add_action( 'wp_ajax_nopriv_rh-fire-beer-news-success', 'beer_news_success_cb' );


/**
 * A generic ajax method for retrieving data from custom fields
 */

function rh_get_ajax_formdata(){
    $payload = json_decode(file_get_contents("php://input"));
    unset($payload->action);//delete the wordpress ajax action just to be safe
    //Our script expects a json formData property to carry all of our data
    if(!isset($payload->formData)) {
        throw new \RedHammer\Exception("Ajax method requires formData property", 1);
    }
    return $payload->formData;
}

function get_custom_meta_cb()
{
	$responseObject = new ResponseObject();
	try {
		$formData = rh_get_ajax_formdata();
		$slug = filter_var($formData->slug, FILTER_SANITIZE_STRING);
		if( !isset( $slug ) || empty( $slug ) ) {
			throw new \Exception("Custom meta slug required.");
		}
		$post_id = filter_var($formData->postId, FILTER_VALIDATE_INT);
		if( !isset( $post_id ) || empty( $post_id ) ) {
			throw new \Exception("Valid post ID required.");
		}
		$meta = get_post_meta($post_id, $slug, true);
		if( isset( $meta ) && !empty( $meta ) ) {
			$responseObject->set($meta, NULL, false);
		} else {
			if($slug!=='rh_is_beer_menu') {
				throw new \Exception("No meta data available. Please populate the custom field in the WordPress backend.");
			}
		}
	} catch (\Exception $e) {
		$data = NULL;
		$message = $e->getMessage();
		$error = true;
		$responseObject->set($data, $message, $error);

	}
	echo json_encode( $responseObject );
	die();
}
add_action( 'wp_ajax_get_custom_meta', 'get_custom_meta_cb' );
add_action( 'wp_ajax_nopriv_get_custom_meta', 'get_custom_meta_cb');



/**
 * Add desktop search form as last item in footer navigation
 */
function add_search_box_to_menu( $items, $args ) {
    if( $args->theme_location == 'footer-menu' ) {
    	ob_start();
			?>
			<li>
				<!-- Desktop search -->
		        <div id="desktop_search_form_wrap" class="clearfix">
		          <form class="form-search" role="form" action="<?php echo home_url(); ?>" id="footersearchform" method="get">
		            <div class="form-group">
		                <button onclick="document.getElementById('footersearchform').submit();" class="btn" type="button"><span class="fa fa-search fa-flip-horizontal "></span></button>
		                <input class="form-control" type="search" id="s" name="s" value="" />
		           </div>
		         </form>
		        </div>
	        </li>
			<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
        //return $items."<li class='menu-header-search'><form action='http://example.com/' id='searchform' method='get'><input type='text' name='s' id='s' placeholder='Search'></form></li>";
        return $items.$html;
    }

    return $items;
}
add_filter('wp_nav_menu_items','add_search_box_to_menu', 10, 2);



/**
 * Ajax means of fetching the Super Admin options values
 */
function get_admin_options_cb()
{
	$responseObject = new ResponseObject();
	try {

		$formData = rh_get_ajax_formdata();
		$slug = filter_var($formData->slug, FILTER_SANITIZE_STRING);
		if( !isset( $slug ) || empty( $slug ) ) {
			throw new \Exception("Admin option slug required.");
		}
		$optionGroup = new \RedHammer\WordPress\Options\OptionGroup( 'rh_admin_options' );
      	$optionValue = $optionGroup->getValue( $slug );
		if( isset( $optionValue ) && !empty( $optionValue ) && $optionValue ) {
			$responseObject->set($optionValue, NULL, false);
		} else {
			throw new \Exception("No option data available for slug: " . $slug . ". Please populate the custom field in the WordPress backend.");
		}
	} catch (\Exception $e) {
		$data = NULL;
		$message = $e->getMessage();
		$error = true;
		$responseObject->set($data, $message, $error);

	}
	echo json_encode( $responseObject );
	die();
}
add_action( 'wp_ajax_get_admin_options', 'get_admin_options_cb' );
add_action( 'wp_ajax_nopriv_get_admin_options', 'get_admin_options_cb');

/**
 * Ajax means of fetching the the rh_settings theme option group...the General theme options values
 */
function get_theme_options_cb()
{
	$responseObject = new ResponseObject();
	try {

		$formData = rh_get_ajax_formdata();
		$slug = filter_var($formData->slug, FILTER_SANITIZE_STRING);
		if( !isset( $slug ) || empty( $slug ) ) {
			throw new \Exception("Theme option slug required.");
		}
		$optionGroup = new \RedHammer\WordPress\Options\OptionGroup( 'rh_settings' );
      	$optionValue = $optionGroup->getValue( $slug );
		if( isset( $optionValue ) && !empty( $optionValue ) && $optionValue ) {
			$responseObject->set($optionValue, NULL, false);
		} else {
			throw new \Exception("No option data available for slug: " . $slug . ". Please populate the custom field in the WordPress backend.");
		}
	} catch (\Exception $e) {
		$data = NULL;
		$message = $e->getMessage();
		$error = true;
		$responseObject->set($data, $message, $error);

	}
	echo json_encode( $responseObject );
	die();
}

add_action( 'wp_ajax_get_theme_options', 'get_theme_options_cb' );
add_action( 'wp_ajax_nopriv_get_theme_options', 'get_theme_options_cb');


/**
 * Ajax means of fetching the the parent side beermenus.com beer menu id. This is the fallback if location menu id is not provided
 */
function get_default_beer_menu_id_cb()
{
	$responseObject = new ResponseObject();
	try {
		$defaultLocation = new \Brixx\Classes\Location(1);
	 	$defaultBeerMenuId = $defaultLocation->getBeerMenu();
		if( isset( $defaultBeerMenuId ) && !empty( $defaultBeerMenuId ) && $defaultBeerMenuId ) {
			$responseObject->set($defaultBeerMenuId, NULL, false);
		} else {
			$responseObject->set(false, NULL, false);
		}
	} catch (\Exception $e) {
		$data = NULL;
		$message = $e->getMessage();
		$error = true;
		$responseObject->set($data, $message, $error);

	}
	echo json_encode( $responseObject );
	die();
}

add_action( 'wp_ajax_get_default_beer_menu_id', 'get_default_beer_menu_id_cb' );
add_action( 'wp_ajax_nopriv_get_default_beer_menu_id', 'get_default_beer_menu_id_cb');

if( function_exists('acf_add_options_page') ) {
	
    if( get_current_blog_id() == 1 ) {
        
        // register the options page for root here
        acf_add_options_page();
        
    } else {
        
        // register the options page for other sites
        acf_add_options_page();
        
    }
	
}
if( function_exists('acf_add_local_field_group') ):

if( get_current_blog_id() == 1 ) {
acf_add_local_field_group(array(
	'key' => 'group_5baea31bd3ee9',
	'title' => 'Google URL',
	'fields' => array(
		array(
			'key' => 'field_5baea32a63eb2',
			'label' => 'Google URL',
			'name' => 'google_url',
			'type' => 'url',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'options_page',
				'operator' => '==',
				'value' => 'acf-options',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => 1,
	'description' => '',
));
} else {
acf_add_local_field_group(array(
	'key' => 'group_5baea31bd3ee9',
	'title' => 'Google URL',
	'fields' => array(
		array(
			'key' => 'field_5baea32a63eb2',
			'label' => 'Google URL',
			'name' => 'google_url',
			'type' => 'url',
			'instructions' => '',
			'required' => 0,
			'conditional_logic' => 0,
			'wrapper' => array(
				'width' => '',
				'class' => '',
				'id' => '',
			),
			'default_value' => '',
			'placeholder' => '',
		),
	),
	'location' => array(
		array(
			array(
				'param' => 'options_page',
				'operator' => '==',
				'value' => 'acf-options',
			),
		),
	),
	'menu_order' => 0,
	'position' => 'normal',
	'style' => 'default',
	'label_placement' => 'top',
	'instruction_placement' => 'label',
	'hide_on_screen' => '',
	'active' => 1,
	'description' => '',
));
}
endif;

function custom_remove_admin_menus (){

  // Check that the built-in WordPress function remove_menu_page() exists in the current installation
  if ( function_exists('remove_menu_page') ) { 

    /* Remove unwanted menu items by passing their slug to the remove_menu_item() function.
    You can comment out the items you want to keep. */

    // remove_menu_page('index.php'); // Dashboard tab
    // remove_menu_page('edit.php'); // Posts
    // remove_menu_page('edit.php?post_type=page'); // Pages
    // remove_menu_page('upload.php'); // Media
    // remove_menu_page('link-manager.php'); // Links
    // remove_menu_page('edit-comments.php'); // Comments
    remove_menu_page('themes.php'); // Appearance
    remove_menu_page('plugins.php'); // Plugins
    // remove_menu_page('users.php'); // Users
    remove_menu_page('tools.php'); // Tools
    remove_menu_page('options-general.php'); // Settings
    remove_menu_page('edit.php?post_type=acf-field-group');

  }

}
// Add our function to the admin_menu action
add_action('admin_menu', 'custom_remove_admin_menus'); 


?>
