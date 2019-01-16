<?php
use \Brixx\Classes\Location as Location;
?>
<div class="rh_contact_us_form_wrapper" ng-controller="ContactFormCtrl" >
	<div class="js_message text-warning"></div>
	<?php if ( isset( $this->errors ) && !empty( $this->errors ) ): ?>
	<div class="alert alert-warning"><?php echo $this->error_msg ?></div>
	<?php elseif ( isset($this->success_msg) ): ?>
	<div class="alert alert-success"><?php echo $this->success_msg ?></div>
	<?php endif; ?>
<?php if(!$this->success_msg): ?>
<!--Now the form	-->
<form ng-submit="submit()" id="rh_contact_form" role="form" novalidate name="contactForm">

	<!--senderSignup-->
	<?php
	$field_name = 'senderSignup';
	$field_label = 'Sign me up for e-news!';
	$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : 1;
	$field_error = $this->hasError($field_name);

	?>
	<div class="clearfix checkbox <?php echo $field_error ? 'has-warning' : ''; ?>">
		<label class="control-label" for="<?php echo $field_name ?>"><input ng-model="formData.<?php echo $field_name ?>" type="checkbox" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" <?php checked('1',$field_value); ?> value="1" /><?php echo $field_label; ?></label>
	</div><!--#form_row-->
	<!--#senderSignup-->

	<!--senderEmployment-->
	<?php
	$field_name = 'senderEmployment';
	$field_label = 'I am interested in employment at Brixx';
	$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : -1;
	$field_error = $this->hasError($field_name);

	?>
	<div class="clearfix checkbox <?php echo $field_error ? 'has-warning' : ''; ?>">
		<label class="control-label" for="<?php echo $field_name ?>"><input ng-model="formData.<?php echo $field_name ?>" type="checkbox" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" <?php checked('1',$field_value); ?> value="1" /><?php echo $field_label; ?></label>
	</div><!--#form_row-->
	<!--#senderEmployment-->

	<!--senderDonation-->
	<?php
	$field_name = 'senderDonation';
	$field_label = 'I am inquiring about a donation';
	$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : -1;
	$field_error = $this->hasError($field_name);

	?>
	<div class="clearfix checkbox <?php echo $field_error ? 'has-warning' : ''; ?>">
		<label class="control-label" for="<?php echo $field_name ?>"><input ng-model="formData.<?php echo $field_name ?>" type="checkbox" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" <?php checked('1',$field_value); ?> value="1" /><?php echo $field_label; ?></label>
	</div><!--#form_row-->
	<!--#senderDonation-->



	<div class="form-inline two-col">
		<!--senderFirstName-->
		<?php
		$field_name = 'senderFirstName';
		$field_label = 'First Name*';
		$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
		$field_error = $this->hasError($field_name);

		?>
		<div ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

			<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
			<input ng-model="formData.<?php echo $field_name ?>" required class="form-control" type="text" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" value="<?php echo $field_value; ?>" />
		</div><!--#form_row-->
		<!--#senderFirstName-->

		<!--senderLastName-->
		<?php
		$field_name = 'senderLastName';
		$field_label = 'Last Name*';
		$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
		$field_error = $this->hasError($field_name);

		?>
		<div ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

			<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
			<input ng-model="formData.<?php echo $field_name ?>" required class="form-control" type="text" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" value="<?php echo $field_value; ?>" />
		</div><!--#form_row-->
		<!--#senderLastName-->
	</div>
	<!-- #form-inline -->

	<div class="form-inline three-col">
		<!--senderCity-->
		<?php
		$field_name = 'senderCity';
		$field_label = 'City';
		$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
		$field_error = $this->hasError($field_name);

		?>
		<div ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

			<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
			<input ng-model="formData.<?php echo $field_name ?>" class="form-control" type="text" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" value="<?php echo $field_value; ?>" />
		</div><!--#form_row-->
		<!--#senderCity-->

		<!--senderState-->
		<?php
		$field_name = 'senderState';
		$field_label = 'State';
		$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
		$field_error = $this->hasError($field_name);

		?>
		<div class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

			<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
			<input ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" ng-model="formData.<?php echo $field_name ?>" class="form-control" type="text" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" value="<?php echo $field_value; ?>" />
		</div><!--#form_row-->
		<!--#senderState-->

		<!--senderZip-->
		<?php
		$field_name = 'senderZip';
		$field_label = 'Zip';
		$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
		$field_error = $this->hasError($field_name);

		?>
		<div class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

			<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
			<input ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" ng-model="formData.<?php echo $field_name ?>" class="form-control" type="text" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" value="<?php echo $field_value; ?>" />
		</div><!--#form_row-->
		<!--#senderZip-->
	</div>
	<!-- #form-inline -->

	<div class="form-inline three-col">

		<!--senderEmail-->
		<?php
		$field_name = 'senderEmail';
		$field_label = 'Email*';
		$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
		$field_error = $this->hasError($field_name);
		?>
		<div ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

			<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
			<input ng-model="formData.<?php echo $field_name ?>" required class="form-control" type="email" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" value="<?php echo $field_value; ?>" />
		</div><!--#form_row-->
		<!--#senderEmail-->

		<!--senderEmailVerify-->
		<?php
		$field_name = 'senderEmailVerify';
		$field_label = 'Verify Email*';
		$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
		$field_error = $this->hasError($field_name);
		?>
		<div ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

			<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
			<input equals="{{formData.senderEmail}}" ng-model="formData.<?php echo $field_name ?>" required class="form-control" type="email" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" value="<?php echo $field_value; ?>" />
		</div><!--#form_row-->
		<!--#senderEmailVerify-->


		<!--locationId-->
		<?php
		$field_name = 'locationId';
		$field_label = 'Location*';
		$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : 'undefined';
		$field_error = $this->hasError($field_name);
		$locations = Location::get_sorted_locations();
		?>
		<div ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

			<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
			<select ng-model="formData.<?php echo $field_name ?>" class="form-control" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" integer >
				<option value="undefined" <?php selected('undefined', $field_value) ?> disabled >Select Your Brixx</option>
				<?php foreach ($locations as $location): ?>
					<?php if($location->ID == 1) continue; ?>
					<option ng-selected="formData.locationId === <?php echo $location->ID ?>" value="<?php echo $location->ID ?>" <?php selected($location->ID, $field_value) ?>><?php echo $location->blogname ?></option>
				<?php endforeach ?>
			</select>
		</div><!--#form_row-->
		<!--#locationId-->

	</div>
	<!-- #form-inline -->

	<!--senderComments-->
	<?php
	$field_name = 'senderComments';
	$field_label = 'Comments*';
	$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
	$field_error = $this->hasError($field_name);
	?>
	<div ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

		<label class="control-label" for="<?php echo $field_name ?>"><?php echo $field_label; ?></label>
		<textarea ng-model="formData.<?php echo $field_name ?>" required class="form-control" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>"><?php echo $field_value; ?></textarea>
	</div><!--#form_row-->
	<!--#senderComments-->

	<!--captchaCode-->
	<?php
	$field_name = 'captchaCode';
	$field_label = "Enter This Security Code*:&nbsp;";
	$field_value = isset( $_POST[$field_name] ) && !empty( $_POST[$field_name] ) ? htmlentities( $_POST[$field_name] ) : '';
	$field_error = $this->hasError($field_name);
	?>
	<div ng-class="{'has-warning': contactForm.$dirty && contactForm.<?php echo $field_name ?>.$invalid}" class="form_row clearfix form-group <?php echo $field_error ? 'has-warning' : ''; ?>">

		<label class="<?php echo $field_name ?> control-label" for="<?php echo $field_name ?>"><?php echo $field_label ?><span class="code"><?php echo strtoupper( $_SESSION['securityCode'] ) ?></span></label>
		<input equals="{{formData.securityCode}}" ng-model="formData.<?php echo $field_name ?>" required class="form-control" type="text" name="<?php echo $field_name ?>" id="<?php echo $field_name ?>" value="<?php echo $field_value ?>">
		<input pass-server-value type="hidden" name="securityCode" id="securityCode" value="<?php echo strtoupper( $_SESSION['securityCode'] ) ?>">
	</div><!--#form_row-->

	<!--Now our submit button-->
	<div class="form_row clearfix">
		<?php
			$submit_name = 'rh_contact_us_form_submit';
			if ( is_multisite() ) {
				$blog_id = get_current_blog_id();
				$submit_name = $submit_name . "_{$blog_id}";
			}
		?>
		<input ng-disabled="contactForm.$invalid" class="button btn btn-primary" name="<?php echo $submit_name ?>" type="submit" value="Submit">
	</div><!--#form_row-->
	<!--Close our tags-->

</form>
<?php endif; ?>
</div>
<!--end form_wrapper-->
