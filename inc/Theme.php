<?php
use Brixx\Options\Menu as OptionsMenu;
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup;
use \RedHammer\WordPress\Options\OptionGroup as Options;
use \RedHammer\WordPress\Options\Tabs as Tabs;
/**
 * Custom Theme
 * Override RedHammer defaults
 */
class Theme extends \RedHammer\WordPress\Theme {

    function __construct() {
        parent::__construct();

        /*
        Custom head scripts and styles
         */
        add_action( 'wp_head', array( $this, 'wp_head_cb' ) );
        add_action( 'admin_head', array( $this, 'admin_head_cb' ) );

        /**
         * Manually add some menus
         */
        add_action( 'after_setup_theme', array( $this, 'init_specials_menu'), 10 );
        add_action( 'after_setup_theme', array( $this, 'init_social_menu'), 10 );

    }

    public function init_social_menu(){
        $name = 'Social Menu';
        $menu = get_term_by( 'name', $name, 'nav_menu' );
        //Now let's add Facebook, Twitter, and Instagram as defaults to our social nav menu
        //$run_once = get_option('menu_check');
        if(!$menu) {
            $menu_id = wp_create_nav_menu($name);
            $menu = get_term_by( 'name', $name, 'nav_menu' );

            $facebook = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Facebook'),
              'menu-item-classes' => 'facebook',
              'menu-item-url' => '',
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));
            $twitter = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Twitter'),
              'menu-item-classes' => 'twitter',
              'menu-item-url' => '',
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));
            $instagram = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Instagram'),
              'menu-item-classes' => 'instagram',
              'menu-item-url' => '',
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));

              // you add as many items as you need with wp_update_nav_menu_item()

              //then you set the wanted theme  location
            $locations = get_theme_mod('nav_menu_locations');
            $locations['social-menu'] = $menu->term_id;
            set_theme_mod( 'nav_menu_locations', $locations );
            //update_option('menu_check', true);
        }

    }

    public function init_specials_menu(){
        $name = 'Specials Menu';
        $menu = get_term_by( 'name', $name, 'nav_menu' );
        //Now let's add Mon thru Sunday to our specials nav menu
        //$run_once = get_option('menu_check');
        if(!$menu) {
            $menu_id = wp_create_nav_menu($name);
            $menu = get_term_by( 'name', $name, 'nav_menu' );

            $mon = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Mon'),
              'menu-item-classes' => 'monday',
              'menu-item-url' => home_url( '/' ),
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));
            $tue = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Tue'),
              'menu-item-classes' => 'tuesday',
              'menu-item-url' => home_url( '/' ),
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));
            $wed = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Wed'),
              'menu-item-classes' => 'wednesday',
              'menu-item-url' => home_url( '/' ),
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));
            $thu = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Thu'),
              'menu-item-classes' => 'thursday',
              'menu-item-url' => home_url( '/' ),
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));
            $fri = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Fri'),
              'menu-item-classes' => 'friday',
              'menu-item-url' => home_url( '/' ),
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));
            $sat = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Sat'),
              'menu-item-classes' => 'saturday',
              'menu-item-url' => home_url( '/' ),
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));
            $sun = wp_update_nav_menu_item($menu->term_id, 0, array(
              'menu-item-title' =>  __('Sun'),
              'menu-item-classes' => 'sunday',
              'menu-item-url' => home_url( '/' ),
              'menu-item-status' => 'publish',
              'menu-item-parent-id' => 0,
              ));

              // you add as many items as you need with wp_update_nav_menu_item()

              //then you set the wanted theme  location
            $locations = get_theme_mod('nav_menu_locations');
            $locations['specials-menu'] = $menu->term_id;
            set_theme_mod( 'nav_menu_locations', $locations );
            //update_option('menu_check', true);
        }

    }


    /**
     * Init Nav Menus
     */
    public function initNavMenus() {

        /**
         * Establish custom nav zones
         */
        $my_nav_menus = array(
            'primary-menu' => 'Primary Menu',
            'footer-menu' => 'Footer Menu',
            'specials-menu' => 'Specials',
            'social-menu' => 'Social',
            'full-food-menu' => 'Full Food Menu (for Flyout)'
        );

        //Uses WP register_nav_menus to create theme navigation
        $this->rh_theme_config->setNavZones( $my_nav_menus );


    }

    /**
     * Establish custom fields, taxonomies, and post types. Comment out if none or re-declare methods in child themes to override.
     */
    public function rh_init_custom_post_types() {

        // Initialize Custom Post Types
        $special_cpt = new \Brixx\CustomFields\Special();
        $special_cpt->init();
    }

    public function rh_init_custom_taxonomy() {
        //new \RedHammer\WordPress\CustomFields\SampleCustomTaxonomy();
    }
    public function rh_init_custom_fields() {
        new \Brixx\CustomFields\CustomPageElements();
    }


     /**
     * [initThemeOptionsPage Initializes a custom theme options page. Override to customize]
     *
     * @return [void] [description]
     */
    public function initThemeOptionsPage() {
        $options = new \Brixx\Options\ThemeOptions();



    }









    /**
     * Overrides for gulp integration, concat, uglify, minify
     *
     */
    function rh_load_theme_scripts_method() {

        $uri = get_stylesheet_directory_uri() . '/assets/distrib';
        //if ( WP_DEBUG ) {
            $uri = get_stylesheet_directory_uri() . '/assets/build';
        //}



        //Styles

        wp_enqueue_style( 'vendor-styles', $uri . '/lib.css' );
        wp_enqueue_style( 'theme-styles', $uri . '/global.css?20180718' );


        //Scripts
        wp_deregister_script( 'underscore' );
        wp_deregister_script( 'jquery' );
        wp_register_script( 'rh_modernizr', $uri . '/modernizr.js', NULL, NULL, false );
        wp_enqueue_script( 'rh_modernizr' );
        wp_register_script( 'rh_vendor_scripts', $uri . '/lib.js', array( 'rh_modernizr' ), NULL, false );
        wp_enqueue_script( 'rh_vendor_scripts' );

        //Templates cache
        wp_register_script( 'rh_templates_cache', $uri . '/templates.js', array( 'rh_modernizr' ), NULL, true );
        wp_enqueue_script( 'rh_templates_cache' );
        //App.js
        wp_register_script( 'rh_app_scripts', $uri . '/app.js?20180718', array( 'rh_modernizr' ), NULL, true );
        wp_enqueue_script( 'rh_app_scripts' );

        // For Brixx
        $adminOptions = new Options( 'rh_admin_options' );
        wp_localize_script( 'rh_app_scripts', 'ThemeOptions', array(
                'location_slug' => $adminOptions->getValue( 'single_platform_location_slug'  )
            ) );

    }

    /**
     * Customize admin login logo
     */
    public function customizeLoginLogo() {
        $loginLogo = new \RedHammer\WordPress\UI\LogoLogin( array(
                'height' => '108px',
                'width' => '125px',
                'filename' => '/assets/images/logo-login.png'
            ) );
    }



    /**
     * Init Theme Widget Zones
     */
    public function initWidgetZones() {

        $this->rh_theme_config->setWidgetZoneDefaults( array(
                'before_widget' => '<div id="%1$s" class="widget %2$s">',
                'after_widget' => '</div>',
                'before_title' => '<h4>',
                'after_title' => '</h4>',
            ) );
        $my_sidebars = array(
            array(
                'id' => 'primary',
                'before_title' => '<h4>',
                'after_title' => '</h4>',
            ) ,
            array(
                'id' => 'secondary',
                'name' => 'Secondary Widgets',
                'description' => 'Secondary widget zone.',
            )
        );
        $this->rh_theme_config->setWidgetZones( $my_sidebars );
    }

    /**
     * [wp_head_cb head scripts and styles]
     *
     * @return [void] [description]
     */
    public function wp_head_cb() {
        ob_start();
?>
        <!-- typekit -->
        <script src="//use.typekit.net/jrv2mcn.js"></script>
        <script>try{Typekit.load();}catch(e){}</script>

        <?php
        $maps_api_key = $this->getMapsApiKey();
?>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?key=<?php echo $maps_api_key?>">
    </script>
    <?php
        $html = ob_get_contents();
        ob_end_clean();
        // return the buffer
        echo $html;
    }

    /**
     * [admin_head_cb head scripts and styles for admin area]
     *
     * @return [void] [description]
     */
    public function admin_head_cb() {
        ob_start();
?>
            <?php
        $maps_api_key = $this->getMapsApiKey();
?>
            <script type="text/javascript"
            src="https://maps.googleapis.com/maps/api/js?key=<?php echo $maps_api_key?>">
        </script>
        <?php
        $html = ob_get_contents();
        ob_end_clean();
        // return the buffer
        echo $html;
    }

    protected function getMapsApiKey() {
        //We get this option from our main site
        $adminOptions = new Options( 'rh_admin_options' );
        $maps_api_key = $adminOptions->getValue( 'google_maps_api_key', 1 );
        return $maps_api_key;
    }




}
