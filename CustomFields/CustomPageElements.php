<?php
namespace Brixx\CustomFields;
use  \RedHammer\WordPress\CustomFields\CustomFieldBasic as CustomFieldBasic;
use  \RedHammer\WordPress\CustomFields\MultiSelectTransfer as MultiSelectTransfer;
use  \Brixx\Classes\Flyout as Flyout;

class CustomPageElements extends \RedHammer\WordPress\CustomFields\MetaBox  {

	/**
	 * [$flyoutOptions static list of available shortcodes for flyout menus]
	 * @var array
	 */
	protected $flyoutOptions = [];
	//And to identify our custom meta boxes
	public static $my_meta_box = array(
		'box_post_type'=>'page',
		'box_id_attribute'=>'rh_custom_page_elements_meta_box',
		'box_title'=>'Custom Page Elements',
		'box_fields'=>array(
			'rh_display_title',
			'rh_header_img',
			'rh_poster_img',
			'rh_mobile_img',
			'rh_page_base_color',
			'rh_tab_title',
			'rh_tab_content',
			'rh_flyouts_a',
			'rh_flyouts_b',
			'rh_select_locations',
			'rh_menu_id',
			'rh_is_beer_menu'

		),
	);



	function __construct()
	{

		parent::__construct();
		$flyout = Flyout::getInstance();
		$this->flyoutOptions = $flyout->get_options();



	}//end constructor

	/**
	 * [getSites Get all sites in our network]
	 * @return [array] [array formatted for our multi-select transfter control]
	 * [value]=label
	 */
	public static function getSites(){
		global $wpdb;
		$args = array(
		    'network_id' => $wpdb->siteid,
		    'public'     => null,
		    'archived'   => null,
		    'mature'     => null,
		    'spam'       => null,
		    'deleted'    => null,
		    'limit'      => 1000,
		    'offset'     => 0,
		);
		$sites = wp_get_sites( $args );
		$fieldoptions = [];
		foreach ($sites as $valArray) {
			$fieldoptions[$valArray['blog_id']] = $valArray['domain'];
		}
		return $fieldoptions;

	}

	/**
	 * [getPrimaryFlyouts Get flyout menu(s) if available]
	 * @param  [int] $post_id [description]
	 * @return [type]          [description]
	 */
	public static function getPrimaryFlyouts($post_id){
		return static::getFlyouts($post_id, 'rh_flyouts_a');
	}

	/**
	 * [getSecondaryFlyouts Get flyout menu(s) if available for panel content]
	 * @param  [int] $post_id [description]
	 * @return [type]          [description]
	 */
	public static function getSecondaryFlyouts($post_id){
		return static::getFlyouts($post_id, 'rh_flyouts_b');
	}

	/**
	 * [getFlyouts description]
	 * @param  [type] $post_id [description]
	 * @param  [type] $key     [custom field slug]
	 * @return [type]          [description]
	 */
	protected static function getFlyouts($post_id, $key) {
		$post_id = filter_var($post_id, FILTER_SANITIZE_NUMBER_INT);
		$key = filter_var($key, FILTER_SANITIZE_STRING);
		$selectedFlyouts = get_post_meta( $post_id, $key, true );
		$flyout = Flyout::getInstance();
		if( isset( $selectedFlyouts ) && !empty( $selectedFlyouts ) && is_array($selectedFlyouts) && count($selectedFlyouts)>0 ) {
			ob_start();
				for ($i=0; $i < count($selectedFlyouts) ; $i++) {
					$output = $flyout->get_by_slug($selectedFlyouts[$i]);
					if($output) {
						echo $output;
					}
				}
			$html = ob_get_contents();
			ob_end_clean();
			// return the buffer
			return $html;

		}
	}


	/**
	 * getBaseColor
	 */
	public static function getBaseColor($post_id) {

  	//Check if custom page base color
  	$base_color = get_post_meta($post_id,'rh_page_base_color',true);
		if(isset($base_color)&&!empty($base_color)) {
			return $base_color;
		}else {
			return 'blue';
		}

	}
	/**
	 * getHeaderImage
	 */
	public static function getHeaderImage($post_id) {

	  	//Check if custom page base color
	  	$header_img = get_post_meta($post_id,'rh_header_img',true);

		if(isset($header_img)&&!empty($header_img)) {
			return $header_img;
		}else {
			return false;
		}

	}
	/**
	 * getPosterImage
	 */
	public static function getPosterImage($post_id) {

		//Check if custom page base color
		$img = get_post_meta($post_id, 'rh_poster_img', true);

		if (isset($img) && !empty($img)) {
			return $img;
		} else {
			return '/wp-content/themes/brixx2015/assets/images/masthead-fallback.gif';
		}

	}
	/**
	 * getMobileImage
	 */
	public static function getMobileImage($post_id) {

		//Check if custom page base color
		$img = get_post_meta($post_id, 'rh_mobile_img', true);

		if (isset($img) && !empty($img)) {
			return $img;
		} else {
			return '/wp-content/themes/brixx2015/assets/images/masthead-fallback-mobile.gif';
		}

	}

	/**
	 * Get the is beer menu setting
	 * @return string
	 */
	public static function getIsBeerMenu($post_id) {
		//Check if custom title populated
		$is_beer_menu = get_post_meta($post_id,'rh_is_beer_menu',true);

		if (isset($is_beer_menu) && !empty($is_beer_menu)) {
			return $is_beer_menu;
		} else {
			return false;
		}
	}

	/**
	 * Get the custom display title
	 * @return string
	 */
	public static function getDisplayTitle() {
		global $post;
		if ( in_the_loop() && is_page() ) {
			//Check if custom title populated

			$display_title = get_post_meta($post->ID, 'rh_display_title', true);

		} else {
			trigger_error('getDisplayTitle() must be called within The Loop and can only be used on pages.');
		}
		if (isset($display_title) && !empty($display_title)) {
			return $display_title;
		} else {
			return get_the_title($post->ID);
		}
	}




	/************************
	* The following methods initialize our custom meta boxes
	*/


	public function meta_box_cb() {

		// $post is already set, and contains an object: the WordPress post
		global $post;
		$basic_fields = new CustomFieldBasic();
		$multi = new MultiSelectTransfer();
		//Now get the values
		$values = get_post_custom( $post->ID );

		foreach(static::$my_meta_box['box_fields'] as $val):
			$$val = isset( $values[$val] ) ? array_shift($values[$val]) : '';
		endforeach;

		//We'll use this nonce field later when saving
		wp_nonce_field ('my_doc_meta_box_nonce_id','my_doc_meta_box_nonce_fieldname');
		?>
			<?php
			// Globalize $post
			global $post;
			// Get the page template post meta
			$page_template = get_post_meta( $post->ID, '_wp_page_template', true );
			if($page_template =='page-templates/menu.php'):?>

			<hr class="rh_separator" />

			<!--rh_is_beer_menu-->
			<?php
			$fieldname = 'rh_is_beer_menu';
			$fieldlabel = 'Is this the beer menu?';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = 'Use this toggle to override Single Platform settings and display data from from BeerMenus.com.';
			echo $basic_fields->get_checkbox($fieldname, $fieldlabel, $fieldvalue, $fieldnotes, $fieldplaceholder);
			?>

			<hr class="rh_separator" />

			<!--rh_menu_id-->
			<?php
			$fieldname = 'rh_menu_id';
			$fieldlabel = 'Order Number (Located in Single Platform backend next to Menu title field)';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = 'We use the Single Platform menu Order Number to map this page to the proper menu within the Single Platform api.';
			echo $basic_fields->get_text_input( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder );

			endif; // end if is menu page template
			?>

			<hr class="rh_separator" />

			<!--rh_display_title-->
			<?php
			$fieldname = 'rh_display_title';
			$fieldlabel = 'Page Display Title:';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = '';
			echo $basic_fields->get_text_input( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder );
			?>
			<hr class="rh_separator" />
			<?php
				// Is the currently edited page the front page?
				$is_front = false;
				$front_page_id = get_option('page_on_front');
				if($front_page_id == $post->ID) {
					$is_front = true;
				}
				if($is_front):
			?>
			<h1>Note: Homepage hero area media must respect a precise 16/9 width-to-height ratio for proper front-end display.</h1>
			<?php else: ?>
			<h1>Note: Desktop Masthead media must respect a 1920 x 350 width-to-height ratio for proper front-end display. Additionally, whitespace is required within masthead media at bottom to provide for page title overlap.</h1>
			<?php endif; ?>
			<!--rh_header_img-->
			<?php if($is_front): ?>
				<h3>Video, if populated, will appear in the homepage hero area for desktop screen sizes.</h3>
			<?php else: ?>
				<h3>Video, if populated, will appear in the masthead area for desktop screen sizes. Whitespace is required within the video at bottom to allow for title overlap.</h3>
			<?php endif; ?>
			<?php
			$fieldname = 'rh_header_img';
			$fieldlabel = '<br />Video:';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = '';
			echo $basic_fields->get_browse( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder );
			?>
			<hr class="rh_separator" />
			<!--rh_poster_img-->
			<?php if($is_front): ?>
				<h3>Image, if populated, will appear in the homepage hero area for device screen sizes. If no video, this image will populate for all screen sizes.</h3>
			<?php else: ?>
				<h3>If populated, will appear in the masthead area for desktop screen sizes. If no video populated, this image will display for all screen sizes. Whitespace is required within the image at bottom to allow for title overlap.</h3>
			<?php endif; ?>
			<?php
			$fieldname = 'rh_poster_img';
			$fieldlabel = '<br />Image:';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = '';
			echo $basic_fields->get_browse( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder );
			?>
			<?php if(!$is_front): ?>
			<hr class="rh_separator" />
			<!--rh_mobile_img-->
			<h3>Mobile masthead image. 1920px by 720px image expected.</h3>
			<?php
			$fieldname = 'rh_mobile_img';
			$fieldlabel = '<br />Device Masthead Image:';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = '';
			echo $basic_fields->get_browse( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder );
			?>
			<?php endif; ?>
			<hr class="rh_separator" />

			<!--rh_page_base_color-->
			<?php
			$fieldname = 'rh_page_base_color';
			$fieldlabel = 'Page Base Color:';
			$fieldplaceholder = '';
			$fieldvalue = isset( $$fieldname ) && !empty( $$fieldname )  ? $$fieldname : 'blue';
			$fieldnotes = 'Controls color for page title, page title border, and subheadings.';
			$fieldoptions = array(
					[
						'label' => 'Red',
						'value'	=> 'red'
					],
					[
						'label' => 'Blue',
						'value'	=> 'blue'
					],
					[
						'label' => 'Yellow',
						'value'	=> 'yellow'
					],

				);
			echo $basic_fields->get_radio_group( $fieldname, $fieldvalue, $fieldnotes, $fieldplaceholder, $fieldoptions );

			?>
			<hr class="rh_separator" />
			<!--rh_flyouts_a-->
			<?php
			$fieldname = 'rh_flyouts_a';
			$fieldlabel = 'Optional flyout menus:';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = 'Select from list of available tabs/flyout menus';
			$fieldoptions = $this->flyoutOptions;
			echo $multi->get_option_transfer( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder, $fieldoptions, $maxSelected=-1 );
			?>

			<hr class="rh_separator" />
			<!--rh_select_locations-->
			<?php
			$fieldname = 'rh_select_locations';
			$fieldlabel = 'Optionally restrict display of this page to selected locations:';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = 'Select from list of available tabs/flyout menus';
			$fieldoptions = static::getSites();
			echo $multi->get_option_transfer( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder, $fieldoptions, $maxSelected=-1 );
			?>


			<?php
			// Globalize $post
			global $post;
			// Get the page template post meta
			$page_template = get_post_meta( $post->ID, '_wp_page_template', true );
			if($page_template =='page-templates/tabbed-content.php'):?>
			<hr class="rh_separator" />
			<!--rh_tab_title-->
			<?php
			$fieldname = 'rh_tab_title';
			$fieldlabel = 'Tab Title:';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = 'Shows within the second tab. These fields are only available in the Tabbed Content page template.';
			echo $basic_fields->get_text_input( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder );
			?>

			<!--rh_tab_content-->
			<?php
			$fieldname = 'rh_tab_content';
			$fieldlabel = 'Second Tab Content';
			$fieldplaceholder = '';
			$fieldvalue = $$fieldname;
			$fieldnotes = 'This content will be displayed in the second tab pane. Use the default wysiwyg editor for the first tab pane.';
			echo $basic_fields->get_text_editor( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder );
			?>
			<!--rh_flyouts_b-->
			<?php
			// $fieldname = 'rh_flyouts_b';
			// $fieldlabel = 'Optional flyout menus:';
			// $fieldplaceholder = '';
			// $fieldvalue = $$fieldname;
			// $fieldnotes = 'Select from list of available tabs/flyout menus to show in this panel view';
			// $fieldoptions = $this->flyoutOptions;
			// echo $multi->get_option_transfer( $fieldname, $fieldlabel , $fieldvalue, $fieldnotes, $fieldplaceholder, $fieldoptions, $maxSelected=-1 );



			endif;





	}//end first_meta_box_cb






}//end class
