<?php
namespace Brixx\CustomFields;

/**
 * Sample Custom Post Type Declaration using the Red Hammer Core Framework
 */
class Special extends \RedHammer\WordPress\CustomFields\PostType  {
	// Container for associated custom fieldnames
	protected static $custom_fields = array();

	//Define variables for our post type admin area
	public static $codename='rh_special';
	public static $singular_name='Special';
	public static $plural_name='Specials';
	public static $url_slug='brixx-special';
	/**
	 * set up any custom arguments for our custom post type
	 */
	public $register_post_type_args = array(
		'supports' => array( 'title', 'editor', 'author', 'thumbnail', 'revisions', 'page-attributes' ),
		'capability_type' => 'post',
		'taxonomies'=>array()
		);

	/**
	 * Override to initialize ajax methods associated with this post type
	 */
	public function initAjaxMethods() {

		//Example:
		//            add_action('wp_ajax_nopriv_ap_read_person', array(&$this, 'ap_read_person'));
		//            add_action('wp_ajax_ap_read_person', array(&$this, 'ap_read_person'));
		//            add_action('wp_ajax_nopriv_ap_read_people', array(&$this, 'ap_read_people'));
		//            add_action('wp_ajax_ap_read_people', array(&$this, 'ap_read_people'));
	}

	
	/**
	 * addMetaBox Override to initialize associated meta box
	 *
	 * @return void
	 */
	public function addMetaBox() {
		//new SampleMetaBox();
	}


	/**
	 * Override to add associated custom fields to this post type
	 */
	public function init_custom_fields() {
		//static::$custom_fields = CB_Staff_Details_Meta_Box::$my_meta_box['box_fields'];
	}


	/**
	 * The following methods define the look of our edit all admin area
	 */
	public function my_post_type_edit_columns( $columns ) {
		$columns = array(
			"cb"    => "<input type=\"checkbox\" />",
			"id"    => 'ID',
			"title"    => 'Title',

			);

		return $columns;
	}

	public function my_post_type_custom_columns( $column ) {
		global $post;
		$values = get_post_custom( $post->ID );
		switch ( $column ) {
			case "id":
			echo $post->ID;
			break;

			default:
			break;

		}
	}//end my_post_type_custom_columns




}//end class
