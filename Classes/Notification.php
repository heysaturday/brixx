<?php
namespace Brixx\Classes;
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup;

/**
 * Notification
 * The location class manages notifications for Brixx locations
 */
class Notification {

  /**
   * [__construct constructor]
   */
  function __construct( ) {

    //If no location selected, retrieve default notification
    add_action( 'wp_ajax_rh-get-notification', array( 'Brixx\\Classes\\Notification', 'get_notification_cb' ) );
    add_action( 'wp_ajax_nopriv_rh-get-notification', array( 'Brixx\\Classes\\Notification', 'get_notification_cb' ) );


  }

	public static function getMessage($siteId) {
		$optionGroup = new OptionGroup('notification_options');
		$msg = $optionGroup->getValue('location_notification', $siteId);
		$exp = $optionGroup->getValue('location_notification_expiration', $siteId);
		if (!empty($msg) && !empty($exp)) {
			$time = strtotime($exp);
			if ($time <= time()) {
				$msg = '';
			}
		}
		return $msg;
	}

  public static function getNotification( $siteId ) {
    $msg = static::getMessage( $siteId );
    if ( !isset( $msg ) || empty( $msg ) ) {
      $msg = static::getDefaultNotification();
    }
    return $msg;
  }
  public static function getDefaultNotification() {
    Blog::setToDefaultBlog();
    $siteId = get_current_blog_id();
    Blog::resetBlog();
    $msg = static::getMessage( $siteId );
    if ( isset( $msg ) && !empty( $msg ) ) {
      return $msg;
    }
    return false;

  }
  public static function get_notification_cb() {
    $response = new \RedHammer\API\ResponseObject();
    $response->set();
    $data = NULL;
    $message = NULL;
    $error = false;



    try {
      $siteId = filter_input( INPUT_GET, 'site_id', FILTER_SANITIZE_NUMBER_INT );
      $defaultMsg = static::getDefaultNotification();
      if ( $defaultMsg ) {
        $response->set( $defaultMsg, 'Success', $error );
      } else {
        if ( !$siteId || $siteId < 1 ) {
          $msg = '';
          $response->set( $msg, 'Success', $error );
        } else {
          $msg = static::getNotification( $siteId );
          $response->set( $msg, 'Success', $error );
        }

      }


    } catch ( \Exception $e ) {
      $message = $e->getMessage();
      $error = true;
      $response->set( $data, 'An error has occurred while retrieving notification', $error );
    }
    echo  json_encode( $response ) ;
    die(); // this is required to return a proper result
  }





}
