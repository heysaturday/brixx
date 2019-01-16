<?php
namespace Brixx\Classes;

/**
 * Shortcode class manages shortcodes for the Brixx theme
 */
class Gel {
	/**
	 * Constructor
	 */
	function __construct() {
		add_shortcode( 'gels', array( $this, 'gels_shortcode' ) );
		add_shortcode( 'gel', array( $this, 'gel_shortcode' ) );
		add_shortcode( 'gel_front', array( $this, 'gel_front_shortcode' ) );
		add_shortcode( 'gel_back', array( $this, 'gel_back_shortcode' ) );
		add_action( 'admin_print_footer_scripts', array($this, 'brixx_quicktags') );
		
	}



	// Add Quicktags
	public function brixx_quicktags() {
		
		if ( wp_script_is( 'quicktags' ) ) {
		?>
		<script type="text/javascript">
			QTags.addButton(
				'gels-insert', 
				'Gels', 
				insert_gels
				);

			function insert_gels() {
				QTags.insertContent('[gels][gel color="yellow"][gel_front]After<h3>10</h3>visits[/gel_front][gel_back]<strong>Free</strong>[b]Beer Koozie[b]or[b]keychain[/gel_back][/gel][gel color="red"][gel_front]After<h3>10</h3>visits[/gel_front][gel_back]<strong>Free</strong>[b]Beer Koozie[b]or[b]keychain[/gel_back][/gel][gel color="yellow"][gel_front]After<h3>10</h3>visits[/gel_front][gel_back]<strong>Free</strong>[b]Beer Koozie[b]or[b]keychain[/gel_back][/gel][/gels]');
			}
		</script>
		<?php
		}

	}

	// Hook into the 'admin_print_footer_scripts' action





	function gels_shortcode( $atts, $content = null ) {
		ob_start();
			$content = str_replace('<br >', '', $content);
			$content = str_replace('<br>', '', $content);
			$content = str_replace('<br />', '', $content);
			$content = str_replace('[b]', '<br />', $content);
			?>			
			<div class="gels"><div class="table-row"><?php echo do_shortcode($content)  ?></div></div>
			<div class="gels mobile"><div class="table-row"><?php echo do_shortcode($content)  ?></div></div>
			<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
	}

	function gel_shortcode( $atts, $content = null ) {
		$a = shortcode_atts( array(
	        'color' => 'blue'
	    ), $atts );
	    extract($a, EXTR_SKIP);
		ob_start();
			?>
			<div class="table-cell <?php echo $color ?>">
				<div class="flip-container" ontouchstart="this.classList.toggle('hover');">
					<div class="flipper">
					<?php echo do_shortcode($content)  ?>						
					</div>
					<!-- flipper -->
				</div>
				<!-- flip-container -->
			</div>
			<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
	}
	function gel_front_shortcode( $atts, $content = null ) {
		$a = shortcode_atts( array(), $atts );
	    extract($a, EXTR_SKIP);
		ob_start();
			?>
			<div class="front">
				<div class="circle">
					<!-- front content -->
					<?php echo $content ?>
				</div>
			</div>						
			<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
	}
	function gel_back_shortcode( $atts, $content = null ) {
		$a = shortcode_atts( array(), $atts );
	    extract($a, EXTR_SKIP);
		ob_start();
			?>
			<div class="back">
				<div class="circle">
					<!-- back content -->
					<?php echo $content ?>
				</div>
			</div>
			<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
	}




}


?>
