<?php 

function catering_menu_cb($atts){
	$locId = $_SESSION['selectedLocationId'];
	if( !isset( $locId ) || empty( $locId ) ) {
		return NULL;
	}
	$a = shortcode_atts( array(
        'label' => 'check the catering menu here'
    ), $atts );
	$og = new \RedHammer\WordPress\Options\OptionGroup('rh_settings');
	$val = $og->getValue('catering_pdf', $locId);
	if( $val ) {
		$pdfLink = $val;
	} else {
		return NULL;
	}	
	ob_start();
	?>
	<a href="<?php echo $pdfLink ?>" target="_blank"><?php echo $a['label'] ?></a>
	<?php
	$html = ob_get_contents();
	ob_end_clean();
	// return the buffer
	return $html;
}
add_shortcode( 'catering_menu', 'catering_menu_cb' );
 


?>