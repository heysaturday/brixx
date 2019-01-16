<?php
namespace Brixx\Classes;
use \RedHammer\API\ResponseObject as ResponseObject;
/**
 * Event
 */
class Event {
	// Subject tablename
	protected $tablename;
	// Respective record id fieldname
	protected $primaryKey = 'id';


	/**
	 * A master container for our db field names
	 *
	 */
	protected static $db_fields = array( 'id', 'pub_user', 'pub_date', 'start_date', 'end_date', 'time', 'title', 'location', 'details', 'categories', 'history' );

	function __construct($siteId=NULL) {
		$this->setTableName($siteId);
		//Events nav ajax
		add_action( 'wp_ajax_rh_get_events', array($this, 'rh_get_events_cb') );
		add_action( 'wp_ajax_nopriv_rh_get_events', array($this, 'rh_get_events_cb') );	
		
	}


	/**
	 * Provide an ajax means of retrieving our events
	 */
	public function rh_get_events_cb() {
		
		$responseObject = new ResponseObject();
		try {			
			$site_id = filter_input(INPUT_GET, 'site_id', FILTER_SANITIZE_NUMBER_INT);
		    if( filter_var($site_id, FILTER_VALIDATE_INT) ) {
		    	$this->setTableName($site_id); 		  
		    			    		
				$responseObject->set($this->find_all(), NULL, false);
				echo json_encode( $responseObject );
		    } else {
				throw new \Exception("Invalid site ID provided");				
			}		
			
		} catch (\Exception $e) {
			$data = NULL;
			$message = $e->getMessage();
			$error = true;
			$responseObject->set($data, $message, $error);
			echo json_encode( $responseObject );
		}		
		
		die();

	}

	public function setTableName($siteId=NULL){
		if( is_null($siteId)){
			$siteId = \get_current_blog_id();
		} else {
			$siteId = filter_var($siteId, FILTER_SANITIZE_NUMBER_INT);
		}
		if($siteId==1) {
			$this->tablename = 'wp_event_list';
		} else {

			$this->tablename = 'wp_' . $siteId . '_event_list';
		}
	}
	
	/**
	 * getResultsArray
	 */
	public static function getResultsArray( $result_set ) {
		if ( isset( $result_set ) && !empty( $result_set ) ) {
			$object_array = array();
			while ( $row = $result_set->fetch_assoc() ) {
				$object_array[] = $row;
			}
			if ( count( $object_array > 0 ) ) {
				return $object_array;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	 * Find mysqli result by sql. We use this method primarily for our Exporter classes
	 *
	 * @param string  $sql valid sql statement
	 * @return mysqli result
	 */
	public static function find_mysqli_result_by_sql( $sql = "" ) {
		global $wpdb;
		$db = $wpdb;
		$mysqli = $db->getConnection();
		$result_set = $mysqli->query( $sql );
		if ( isset( $result_set ) && !empty( $result_set ) ) {
			return $result_set;
		} else {
			return false;
		}
	}

	/**
	 * Common Database Methods
	 */

	/**
	 * Get the current table id field name
	 *
	 * @return string
	 */
	public function getIdFieldname() {
		return static::$primaryKey;
	}

	/**
	 * Magic __call
	 *
	 * @param string  $method Name of the method being called
	 * @param enumerated array $arguments array containing the parameters passed to the $name'ed method
	 */
	public static function __callStatic( $method, $arguments ) {
		global $wpdb;
		$db = $wpdb;
		$mysqli = $db->getConnection();
		// Note: value of $name is case sensitive.
		$field = preg_replace( '/^find_by_(\w*)$/', '${1}', $method );
		$sql = "SELECT * FROM " . static::$tablename . " WHERE {$field}='" . $mysqli->real_escape_string( $arguments[0] ) . "'";
		$result_array = self::find_by_sql( $sql );
		return !empty( $result_array ) ? $result_array : false;
	}


	/**
	 * Find all records
	 *
	 * @return array
	 */
	public function find_all() {
		$sql = "SELECT * FROM " . $this->tablename;
		return $this->find_by_sql( $sql );
	}

	//end find_all

	/**
	 * Find record by ID
	 *
	 * @param int     $id
	 * @return object
	 */
	public static function find_by_id( $id = 0 ) {
		global $wpdb;
		$db = $wpdb;
		$mysqli = $db->getConnection();
		$sql = "SELECT * FROM " . static::$tablename . " WHERE " . static::$primaryKey . "=" . $mysqli->real_escape_string( $id ) . " LIMIT 1";
		$result_array = self::find_by_sql( $sql );
		return !empty( $result_array ) ? array_shift( $result_array ) : false;
	}

	/**
	 * Find record by sql
	 *
	 * @param string  $sql valid sql statement
	 * @return array
	 */
	public function find_by_sql( $sql = "" ) {
		global $wpdb;
		return $wpdb->get_results($sql);
		
	}

	//end find_by_sql

	/**
	 * Count all records
	 *
	 * @return int
	 */
	public static function count_all() {
		global $wpdb;
		$sql = "SELECT COUNT(*) FROM " . static::$tablename;
		$result_set = $wpdb->get_results( $sql, 'ARRAY_N' );
		return array_shift( $result_set[0] );
	}

	//end count_all

	/**
	 * Given a record of type stdClass, instantiate an object of the calling class object type
	 *
	 * @param object  $record
	 * @return object
	 */
	protected static function instantiate( $record ) {
		//$object = new self;
		$class_name = get_called_class();
		$object = new $class_name();

		//Simple, long-form approach
		//  $object->id_usr =    $record['id_usr'];
		//  $object->firstname_usr =  $record['firstname_usr'];
		//  $object->lastname_usr =  $record['lastname_usr'];
		//  $object->email_usr =   $record['email_usr'];
		//  $object->username_mbr =  $record['username_mbr'];
		//  $object->hashed_pw_mbr =  $record['hashed_pw_mbr'];
		//  $object->level_mbr =   $record['level_mbr'];
		//  $object->signupdate_usr =  $record['signupdate_usr'];
		//  $object->revoked_usr =   $record['revoked_usr'];
		//  $object->licensekey_usr =  $record['licensekey_usr'];
		//More dynamic, short-form approach
		foreach ( $record as $attribute => $value ) {

			if ( $object->has_attribute( $attribute ) ) {
				$object->$attribute = $value;
			}//end if
		}//end foreach
		return $object;
	}

	//end instantiate

	/**
	 * Determine if property exist within the calling class
	 *
	 * @param string  $attribute
	 * @return boolean
	 */
	protected function has_attribute( $attribute ) {
		// get_object_vars returns an associative array with all attributes
		// (incl. private ones!) as the keys and their current values as the value
		$object_vars = $this->attributes();
		// We don't care about the value, we just want to know if the key exists
		// Will return true or false
		return array_key_exists( $attribute, $object_vars );
	}

	//end has_attribute

	/**
	 * Return an array of attribute keys and their values
	 *
	 * @return array
	 */
	protected function attributes() {
		// return an array of attribute keys and their values
		$attributes = array();

		foreach ( static::$db_fields as $field ) {
			if ( property_exists( $this, $field ) ) {
				$attributes[$field] = $this->$field;
			}//end if
		}//end foreach
		return $attributes;
	}

	//end attributes









}

//end class
?>
