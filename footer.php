<?php 
use \Brixx\Classes\Contact as Contact;
use \Brixx\CustomFields\CustomPageElements as CustomPageElements;
 ?>
</div><!--#page_wrap-->
<?php include get_stylesheet_directory() . '/inc/featured-img.php'; ?>
<div class="flyouts">
<?php 
    global $post; 
    if( isset( $post ) && !empty( $post ) ) {        
        $flyoutContent = CustomPageElements::getPrimaryFlyouts($post->ID);
        if($flyoutContent) {
         echo $flyoutContent;
        }
    }
?>
</div>
<!-- flyouts      -->
<footer id="footer">
   <div class="inside">
        <div class="utilities-wrap">
           <h6>Sign Up for Local News &amp; Specials:</h6>
           <?php include get_stylesheet_directory() . '/inc/coupon-form.php'; ?>            
            <nav class="social-nav" social></nav>
        </div>
        <!-- #utilities -->
        <nav class="footer-nav">
            <?php
                
                wp_nav_menu(array(
                    'theme_location' => 'footer-menu',
                    'container' => '',
                    'menu_class' => '',
                    'fallback_cb'=>'getDefaultFooterNav'
                    
                ));
                ?>
        </nav>

        
        <div class="disclaimer_1 clearfix"><span><?php echo \RedHammer\WordPress\ThemeCustomization\ThemeOptions::getOption('disclaimer_1'); ?></span></div>
    </div>
    
</footer>

</div>
<!-- #animate -->

<?php include get_stylesheet_directory() . '/inc/nav-modal.php'; ?>
<?php include get_stylesheet_directory() . '/inc/nav-desktop.php'; ?>
<?php echo Contact::displayContactForm(); ?>

<?php wp_footer(); ?>

<!-- Don't forget analytics -->
<?php echo \RedHammer\WordPress\ThemeCustomization\ThemeOptions::getOption('analytics_code'); ?>
</body>

</html>
