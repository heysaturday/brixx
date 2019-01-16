<?php
namespace Brixx\Classes;
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup;
use \Brixx\Classes\Location as Location;

/**
 * Global Singleton for maintaining application wide Emma account settings
 */
class EmmaAccount {
	
	/**
	 *
	 *
	 * @var Singleton The reference to *Singleton* instance of this class
	 */
	private static $instance;


	/**
	 * [getEmmaDefaults Get emma account options for a given location ID]
	 *
	 * @return [type] [description]
	 */
	public static function find_by_id($id) {
		$options = NULL;
		if ( !isset( $_SESSION ) ) {
			session_start();
		}
		if(!isset($_SESSION['emmaAccounts'])) {
			throw new Exception("No accounts available", 1);			
		}
		foreach ($_SESSION['emmaAccounts'] as $key => $value) {
			if($key == $id) {
				$options = $value;
				break;
			}
		}
		return $options;
	}

	/**
	 * [setEmmaDefaults Establish session to carry emma options. This is necessary to provide data to our ajax calls]
	 *
	 * @return [array] [Default API Key values]
	 */
	public static function setEmmaAccounts() {
		$locations = Location::find_all();
		foreach ( $locations as $location ) {
			try {
				$emmaOptions = $location->myEmmaOptions;
				if ( !isset( $emmaOptions ) || empty( $emmaOptions ) ) {
					throw new \Exception( "My Emma properties not populated for this location. No signup available.", 1 );
				}
				if ( !isset( $emmaOptions['emma_account_id'] ) || empty( $emmaOptions['emma_account_id'] ) ) {
					$emmaDefaults = Location::getEmmaDefaults();
					$emmaOptions = array_merge( $emmaOptions, $emmaDefaults );
				}
				$_SESSION['emmaAccounts'][$location->ID] = $location->getEmmaOptions();
				$_SESSION['emmaAccounts'][$location->ID]['error'] = false;
				$_SESSION['emmaAccounts'][$location->ID]['message'] = NULL;
			} catch ( \Exception $e ) {
				$_SESSION['emmaAccounts'][$location->ID]['error'] = true;
				$_SESSION['emmaAccounts'][$location->ID]['message'] = $e->getMessage();
			}

		}
	}



	/**
	 * Returns the *Singleton* instance of this class.
	 *
	 * @return Singleton The *Singleton* instance.
	 */
	public static function getInstance() {
		if ( null === static::$instance ) {

			static::$instance = new static();

		}

		return static::$instance;
	}

	/**
	 * Protected constructor to prevent creating a new instance of the
	 * *Singleton* via the `new` operator from outside of this class.
	 */
	protected function __construct() {
		if ( !isset( $_SESSION ) ) {
			session_start();
		}
		static:: setEmmaAccounts();

	}

	/**
	 * Private clone method to prevent cloning of the instance of the
	 * *Singleton* instance.
	 *
	 * @return void
	 */
	private function __clone() {
	}

	/**
	 * Private unserialize method to prevent unserializing of the *Singleton*
	 * instance.
	 *
	 * @return void
	 */
	private function __wakeup() {
	}
}


?>
