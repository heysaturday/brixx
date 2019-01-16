<?php
namespace Brixx\Classes;
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup;
use \RedHammer\Geography\State as State;
/**
 * Location
 * The location class manages information for Brixx locations
 */
class Location {

  public $ID;
  public $blogname;
  public $details;
  public $locationOptions;
  public $stateName;
  public $singlePlatformOptions;
  public $notification;
  public $contactUsOptions;
  public $myEmmaOptions;
  public $beerMenuOptions;
  public $miscOptions;
  // Container for arbitrary custom data. Works with our magic methods
  public $custom_data = array();

  /**
   * [__construct constructor]
   */
  function __construct( $location_id ) {
    $this->ID = $location_id;
    $this->setBlogDetails();
    $this->setLocationOptions();

  }

  public static function init() {
    //Some ajax/wordpress calls
    add_action( 'wp_ajax_rh-get-locations', array( 'Brixx\\Classes\\Location', 'get_locations_cb' ) );
    add_action( 'wp_ajax_nopriv_rh-get-locations', array( 'Brixx\\Classes\\Location', 'get_locations_cb' ) );

    add_action( 'wp_ajax_rh-get-default-location-id', array( 'Brixx\\Classes\\Location', 'get_default_location_id_cb' ) );
    add_action( 'wp_ajax_nopriv_rh-get-default-location-id', array( '\\Brixx\\Classes\\Location', 'get_default_location_id_cb' ) );

    add_action( 'wp_ajax_rh-get-location-options', array( 'Brixx\\Classes\\Location', 'get_location_options_cb' ) );
    add_action( 'wp_ajax_nopriv_rh-get-location-options', array( 'Brixx\\Classes\\Location', 'get_location_options_cb' ) );


  }

  /**
   * [getBeerMenu Get beer menu embed code]
   * @return [html] [embed code]
   */
   public function getBeerMenu() {
      $beerMenuOptions = \get_blog_option( $this->ID, 'beermenu_options' );
      if( !isset( $beerMenuOptions ) || empty( $beerMenuOptions ) ) {
        return false;
      }
      if ( !isset( $beerMenuOptions['location_beermenu'] ) || empty( $beerMenuOptions['location_beermenu'] ) ) {
        return false;
      }
      return $beerMenuOptions['location_beermenu'];
  }

  /**
   * [getEmmaDefaults Return primary site emma options]
   * @return [array] [Default API Key values]
   */
  public static function getEmmaDefaults(){
      $optionGroup = new OptionGroup( 'rh_admin_options' );
      $default_id = $optionGroup->getValue( 'default_location_id', 1 );
      $default_location = new self( $default_id );
      $emmaOptions = $default_location->myEmmaOptions;
      $emmaDefaults = [];
      $emmaDefaults['emma_account_id'] = $emmaOptions['emma_account_id'];
      $emmaDefaults['emma_public_api_key'] = $emmaOptions['emma_public_api_key'];
      $emmaDefaults['emma_private_api_key'] = $emmaOptions['emma_private_api_key'];
      $emmaDefaults['emma_general_interest_group_id'] = $emmaOptions['emma_general_interest_group_id'];
      $emmaDefaults['emma_beer_news_group_id'] = $emmaOptions['emma_beer_news_group_id'];
      $emmaDefaults['emma_coupon_group_id'] = $emmaOptions['emma_coupon_group_id'];

      return $emmaDefaults;
  }

  /**
   * [getEmmaOptions Get My Emma account options for the subject location, or the master location if no account options exist]
   *
   * @return [array] [An array of my emma account options]
   */
  public function getEmmaOptions() {
    $emmaOptions = $this->myEmmaOptions;
    if( !isset( $emmaOptions ) || empty( $emmaOptions ) ) {
      throw new \Exception("My Emma properties not populated for this location. No signup available.", 1);
    }
    if ( !isset( $emmaOptions['emma_account_id'] ) || empty( $emmaOptions['emma_account_id'] ) ) {
      $emmaDefaults = static::getEmmaDefaults();
      $emmaOptions = array_merge($emmaOptions, $emmaDefaults);
    }
    return $emmaOptions;
  }

  /**
   * [setSinglePlatformSlug set the location slug for fetching from Single Platform API]
   */
  protected function setLocationOptions() {
    $this->locationOptions = \get_blog_option( $this->ID, 'rh_settings' );
    if ( isset( $this->locationOptions['state'] ) && !empty( $this->locationOptions['state'] ) ) {
      $this->stateName = State::getStateName( $this->locationOptions['state'] );
    }
    $this->singlePlatformOptions = \get_blog_option( $this->ID, 'single_platform_options' );
    $this->contactUsOptions = \get_blog_option( $this->ID, 'contact_us_options' );
    $this->myEmmaOptions = \get_blog_option( $this->ID, 'emma_options' );
    $this->beerMenuOptions = \get_blog_option( $this->ID, 'beermenu_options' );
    $this->miscOptions = \get_blog_option( $this->ID, 'misc_options' );
  }

  /**
   * [setBlogDetails get some details about our location]
   */
  protected function setBlogDetails() {
    $this->details = \get_blog_details( $this->ID );
    $this->blogname = $this->details->blogname;
  }


  /**
   * [get_location_options_cb API method for retrieving location options]
   *
   * @return [int] [ID]
   */
  public static function get_location_options_cb() {
    $response = new \RedHammer\API\ResponseObject();
    $response->set();
    $data = NULL;
    $message = NULL;
    $error = false;

    try {
      $siteId = filter_input( INPUT_GET, 'siteId', FILTER_SANITIZE_NUMBER_INT );
      if ( !$siteId ) {
        throw new \Exception( "Invalid Location ID" );
      }

      $optionGroup = new OptionGroup( 'rh_settings' );
      $location_options-> $optionGroup-> getGroup( $siteId );

      if ( isset( $location_options  ) && !empty( $location_options  ) ) {
        $response->set( $location_options, $message, $error );

      } else {
        throw new \Exception( "No default location found" );

      }


    } catch ( \Exception $e ) {
      $message = $e->getMessage();
      $error = true;
      $response->set( $data, $message, $error );
    }
    echo  json_encode( $response ) ;
    die(); // this is required to return a proper result
  }

  /**
   * [get_default_location_id_cb API method for retrieving default Brixx location]
   *
   * @return [int] [ID]
   */
  public static function get_default_location_id_cb() {
    $response = new \RedHammer\API\ResponseObject();
    $response->set();
    $data = NULL;
    $message = NULL;
    $error = false;

    try {
      $optionGroup = new OptionGroup( 'rh_admin_options' );
      $default_id = $optionGroup->getValue( 'default_location_id', 1 );

      if ( isset( $default_id  ) && !empty( $default_id  ) ) {
        $response->set( $default_id, $message, $error );

      } else {
        throw new \Exception( "No default location found" );

      }


    } catch ( \Exception $e ) {
      $message = $e->getMessage();
      $error = true;
      $response->set( $data, $message, $error );
    }
    echo  json_encode( $response ) ;
    die(); // this is required to return a proper result
  }


  public static function find_all() {

    $data = \wp_get_sites();
    if ( $data ) {
      $locations = [];
      for ( $i=0; $i < count( $data ) ; $i++ ) {
        $location = new self( $data[$i]['blog_id'] );
        $locations[] = $location;
      }
      return $locations;

    } else {
      throw new \Exception( "No locations found", 1 );

    }
  }

  public static function find_by_id($id) {
    $locations = static::find_all();
    foreach ($locations as $location) {
      if($location->ID == $id) {
        return $location;
        break;
      }
    }
    throw new \Exception( "No location found", 1 );

  }

  /**
   * [get_locations_cb API method for retrieving Brixx locations]
   *
   * @return [string] [json encoded Location object]
   */
  public static function get_locations_cb() {
    $response = new \RedHammer\API\ResponseObject();
    $response->set();
    $data = NULL;
    $message = NULL;
    $error = false;

    try {
      $locations = static::find_all();
      $response->set( $locations, $message, $error );

    } catch ( \Exception $e ) {
      $message = $e->getMessage();
      $error = true;
      $response->set( $data, $message, $error );
    }
    echo  json_encode( $response ) ;
    die(); // this is required to return a proper result
  }




  /**
   * Magic __set pushes values into custom_data property. Used primarily to store associated custom field values.
   */
  public function __set( $name, $value ) {
    $this->custom_data[$name] = $value;
  }

  /**
   * Magic __get for retrieving properties
   */
  public function __get( $name ) {
    if ( static::array_key_exists_r( $name, $this->custom_data ) ) {
      return $this->custom_data[$name];
    }

    // $trace = debug_backtrace();
    // trigger_error(
    //     'Undefined property via __get(): ' . $name .
    //     ' in ' . $trace[0]['file'] .
    //     ' on line ' . $trace[0]['line'],
    //     E_USER_NOTICE);
    return null;
  }



  public static function get_sorted_locations() {
    $locations = static::find_all();
    usort( $locations, function( $a, $b ) {
        return strcmp( $a->blogname, $b->blogname );
      } );
    return $locations;
  }


}
