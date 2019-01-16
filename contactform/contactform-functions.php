<?php
/**
 * Contact Us plugin customizations. Include this file in functions.php
 */

//Add any additional fields
function contact_form_fields($defaultFormFields) {
	$brixxFields = array(
		'senderSignup',
		'senderEmployment',
		'senderDonation',
		'senderFirstName',
		'senderLastName',
		'senderCity',
		'senderState',
		'senderZip',
		'senderEmail',
		'senderEmailVerify',
		'locationId',
		'senderComments',
		'captchaCode',
		'securityCode'
	);
	return $brixxFields;
}
add_filter('rh_contact_form_fields', 'contact_form_fields');


//Customize contact form validation
function contact_form_required_validators($validatorsArray) {
	$brixxValidators = [];
	$brixxValidators[] = array( 'subject'=>'senderFirstName', 'message'=>'Please enter a first name.' );
	$brixxValidators[] = array( 'subject'=>'senderLastName', 'message'=>'Please enter a first name.' );
	//$brixxValidators[] = array( 'subject'=>'senderCity', 'message'=>'Please enter a city.' );
	//$brixxValidators[] = array( 'subject'=>'senderState', 'message'=>'Please enter a state.' );
	//$brixxValidators[] = array( 'subject'=>'senderZip', 'message'=>'Please enter a zip code.' );
	$brixxValidators[] = array( 'subject'=>'locationId', 'message'=>'Please enter a location.' );
	$brixxValidators[] = array( 'subject'=>'senderComments', 'message'=>'Please enter comments.' );
	$brixxValidators[] = array( 'subject'=>'captchaCode', 'message'=>'Please enter security code.' );
	return $brixxValidators;
}
add_filter('rh_contact_required_fields', 'contact_form_required_validators');

function rh_contact_email_fields_cb($validatorsArray) {
	$brixxValidators = [];
	$brixxValidators[] = array( 'subject'=>'senderEmail', 'message'=>'Please enter a valid email address.' );
	$brixxValidators[] = array( 'subject'=>'senderEmailVerify', 'message'=>'Please enter a valid email address.' );
	return $brixxValidators;
}
add_filter('rh_contact_email_fields', 'rh_contact_email_fields_cb');


function rh_contact_equal_fields_cb($validatorsArray) {
	$brixxValidators = [];
	$brixxValidators[] = array( 'subject'=>'senderEmail', 'message'=>'Email addresses must match', 'config'=>array( 'senderEmailVerify' ) );
	$brixxValidators[] = array( 'subject'=>'captchaCode', 'message'=>'Security code must match', 'config'=>array( 'securityCode' ) );
	return $brixxValidators;
}
add_filter('rh_contact_equal_fields', 'rh_contact_equal_fields_cb');

function rh_contact_integer_fields_cb($validatorsArray) {
	$brixxValidators = [];
	$brixxValidators[] = array('subject' => 'locationId', 'message' => 'Please select a location');
	return $brixxValidators;
}
add_filter('rh_contact_integer_fields', 'rh_contact_integer_fields_cb');


/**
 * Customize contact form recipients
 */
function rh_get_ajax_contactus_formdata(){
	$payload = json_decode(file_get_contents("php://input"));
	unset($payload->action);//delete the wordpress ajax action just to be safe
	//Our script expects a json formData property to carry all of our data
	if(!isset($payload->formData)) {
		throw new \RedHammer\Exception("Ajax method requires formData property", 1);
	}
	return $payload->formData;
}
/**
 * Modify plugin TO recipients for Contact Us form submissions
 * Place in functions.php
 */
function rh_contactus_recipients_cb( $recipients_list ) {

	$formData = rh_get_ajax_contactus_formdata();

	$loc_id = filter_var($formData->locationId, FILTER_VALIDATE_INT);
	$generalInterestSignup = filter_var($formData->senderSignup, FILTER_VALIDATE_INT);
	$employmentRelated = filter_var($formData->senderEmployment, FILTER_VALIDATE_INT);
	//$donationRelated = filter_var($formData->senderDonation, FILTER_VALIDATE_INT);

	if ( $loc_id) {
			$location = new \Brixx\Classes\Location($loc_id);

			if ($employmentRelated) {
				if ( isset($location->contactUsOptions['contact_us_employment_contacts']) && !empty($location->contactUsOptions['contact_us_employment_contacts']) ) {
					return $location->contactUsOptions['contact_us_employment_contacts'];
				}
			}

			/*
			if ($donationRelated) {

				if ( isset($location->contactUsOptions['contact_us_donation_contacts']) && !empty($location->contactUsOptions['contact_us_donation_contacts']) ) {
					return $location->contactUsOptions['contact_us_donation_contacts'];
				}
			}
			*/

			if ( isset( $location->contactUsOptions['contact_us_default_contacts'] ) && !empty( $location->contactUsOptions['contact_us_default_contacts'] ) ) {
				return $location->contactUsOptions['contact_us_default_contacts'];
			}
			return $recipients_list;
	} else {
		return $recipients_list;
	}


}
add_filter( 'rh_contactus_recipients', 'rh_contactus_recipients_cb' );






 ?>