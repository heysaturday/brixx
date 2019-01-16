<?php
namespace Brixx\Classes;
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup;
use \RedHammer\Geography\State as State;
use \RedHammer\API\ResponseObject as ResponseObject;
/**
 * Contact
 * Manage contact information for a given Brixx location.
 */
class Contact {
	const OPTION_GROUP = 'contact_us_options';

	public $ID;
	public $contacts;


	/**
	 * [__construct constructor]
	 */
	function __construct() {
		//Some ajax/wordpress calls
		add_action( 'wp_ajax_rh-get-contact-info', array( $this, 'contact_cb' ) );
		add_action( 'wp_ajax_nopriv_rh-get-contact-info', array( $this, 'contact_cb' ) );
	}




	/**
	 * [setContacts set contact information
	 */
	protected function setContacts( $site_id ) {
		$this->ID = $site_id;
		$optionGroup = new OptionGroup(self::OPTION_GROUP);
		$this->contacts = $optionGroup->getGroup( $this->ID );

	}



	/**
	 * [rh-get-contact-info_cb API method for retrieving contact info options]
	 *
	 * @return [int] [ID]
	 */
	public function contact_cb() {
		$responseObject = new ResponseObject();
		try {
			$site_id = filter_input( INPUT_GET, 'site_id', FILTER_SANITIZE_NUMBER_INT );
			if ( filter_var( $site_id, FILTER_VALIDATE_INT ) ) {
				$this->setContacts( $site_id );
				if(!$this->contacts) {
					throw new \Exception( "No contacts found." );
				}
				$responseObject->set( $this->contacts, NULL, false );
				echo json_encode( $responseObject );
			} else {
				throw new \Exception( "Invalid site ID provided" );
			}

		} catch ( \Exception $e ) {
			$data = NULL;
			$message = $e->getMessage();
			$error = true;
			$responseObject->set( $data, $message, $error );
			echo json_encode( $responseObject );
		}

		die();
	}

	protected static function getForm(){
		return do_shortcode('[rh-contact-us]');
	}
	public static function displayContactForm(){
		ob_start();
		?>
		<script type="text/ng-template" id="contact-form.html">

			<div class="modal fade email-modal">
				<div class="modal-dialog">
					<div class="modal-content">
						<div class="modal-header">
							<div class="img-wrap">
								<img class="img-responsive" src="{{brandImagePath}}" />
							</div>
							<button class="btn btn-close-modal" ng-click="close()" data-dismiss="modal">
								<i class="fa fa-times"></i>
							</button>
						</div>
						<div class="modal-body">
							<?php echo static::getForm(); ?>
							         
						</div>
						<div class="modal-footer">

						</div>
					</div>
				</div>
			</div>
		</script>
		<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
	}




}
