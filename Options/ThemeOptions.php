<?php
namespace Brixx\Options;
use \Brixx\Options\Menu as OptionsMenu;
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup;
use \RedHammer\WordPress\Options\OptionGroup as Options;
use \RedHammer\WordPress\Options\Tabs as Tabs;
use \RedHammer\Geography\State as State;
/**
 * Brixx has extensive theme options...compartmentalize them here.
 */
class ThemeOptions extends \RedHammer\WordPress\Options\Menu {

    public function __construct() {

        $primary_menu_slug = 'rh_settings';
        $this->generateLocationOptions( $primary_menu_slug );
        if ( is_main_site() ) {
            $this->generateSuperAdminOptions( $primary_menu_slug );
        }



    }


    protected function buildNotificationSection( $primaryMenuSlug ) {
        $tabs = Tabs::getInstance();
        //Contact Us form options will be our next tab
        $option_group = new OptionGroup( 'notification_options' );
        $option_group->initGroup();
        $section_slug = 'notifications';
        $heading = 'Notifications';
        $description = 'If populated, notification below will be presented in website masthead for this location.';

        $tabs->addTab( $option_group->getSlug(), $heading, $primaryMenuSlug );

		//Form Section
		$settings = array(
			array(
				'fieldname'		=> 'location_notification',
				'label'			=> 'Notification',
				'controlType'	=> \RedHammer\WordPress\Options\Setting::CONTROL_TEXTAREA
			),
			array(
				'fieldname'		=> 'location_notification_expiration',
				'label'			=> 'Notification Expiration',
				'controlType'	=> \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
			)
		);
        $section = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$section_slug,
                'label'=>$heading,
                'description'=> $description,
                'page' => $option_group->getSlug()

            ),
            $settings
        );
    }

    protected function buildMyEmmaSection( $primaryMenuSlug ) {
        $tabs = Tabs::getInstance();
        //My Emma options will be our next tab
        $emma_option_group = new OptionGroup( 'emma_options' );
        $emma_option_group->initGroup();
        $emma_section_slug = 'emma-account';
        $emma_heading = 'My Emma';
        $emma_description = 'Location specific My Emma account. If empty, will default to master account. You can find these id\'s in the My Emma backend under Audience tab.';


        $tabs->addTab( $emma_option_group->getSlug(), $emma_heading, $primaryMenuSlug );

        //My Emma
        $emma_settings = array(
            array(
                'fieldname'=>'emma_account_id',
                'label'     =>'Account ID for My Emma Account (Leave blank if using master account)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'emma_public_api_key',
                'label'     =>'Public API Key for My Emma Account (Leave blank if using master account)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'emma_private_api_key',
                'label'     =>'Private API Key for My Emma Account (Leave blank if using master account)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PASSWORD
            ),
            array(
                'fieldname'=>'emma_general_interest_group_id',
                'label'     =>'My Emma General Interest Group ID',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'emma_beer_news_group_id',
                'label'     =>'My Emma Beer News Group ID',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'emma_coupon_group_id',
                'label'     =>'My Emma Coupon Group ID',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),

        );
        $emmaOptionsSection = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$emma_section_slug,
                'label'=>$emma_heading,
                'description'=> $emma_description,
                'page' => $emma_option_group->getSlug()

            ),
            $emma_settings
        );

    }


    protected function buildConstantContactSection( $primaryMenuSlug ) {
        $tabs = Tabs::getInstance();
        //Constant Contact options will be our next tab
        $constant_contact_option_group = new OptionGroup( 'constant_contact_options' );
        $constant_contact_option_group->initGroup();
        $constant_contact_section_slug = 'constant-contact-account';
        $constant_contact_heading = 'Constant Contact';
        $constant_contact_description = 'Location specific constant contact account. If empty, will default to master account.';


        $tabs->addTab( $constant_contact_option_group->getSlug(), $constant_contact_heading, $primaryMenuSlug );

        //Constant Contact
        $constant_contact_settings = array(
            array(
                'fieldname'=>'cc_account_username',
                'label'     =>'Username for Constant Contact Account (Leave blank if using master account)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'cc_account_password',
                'label'     =>'Password for Constant Contact Account (Leave blank if using master account)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PASSWORD
            ),
            array(
                'fieldname'=>'cc_api_access_token',
                'label'     =>'Account access token for the Constant Contact API (Leave blank if using master account)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'cc_general_interest_id',
                'label'     =>'Constant Contact General Interest Mailing List ID',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),

        );
        $constantContactOptionsSection = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$constant_contact_section_slug,
                'label'=>$constant_contact_heading,
                'description'=> $constant_contact_description,
                'page' => $constant_contact_option_group->getSlug()

            ),
            $constant_contact_settings
        );

    }

    protected function buildContactUsSection( $primaryMenuSlug ) {
        $tabs = Tabs::getInstance();
        //Contact Us form options will be our next tab
        $contact_us_option_group = new OptionGroup( 'contact_us_options' );
        $contact_us_option_group->initGroup();
        $contact_us_section_slug = 'contact-us';
        $contact_us_heading = 'Contact Us';
        $contact_us_description = 'Manage email distribution lists for this location';

        $tabs->addTab( $contact_us_option_group->getSlug(), $contact_us_heading, $primaryMenuSlug );

        //Contact Form Section
        $contact_us_settings = array(
            //Contact form
            array(
                'fieldname'=>'contact_us_default_contacts',
                'label'     =>'Recipients for general interest form submissions (separate multiple with comma)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'contact_us_employment_contacts',
                'label'     =>'Recipients for employment inquiries (separate multiple with comma. If empty, will default to general interest list)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),


        );
        $contactUsOptionsSection = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$contact_us_section_slug,
                'label'=>$contact_us_heading,
                'description'=> $contact_us_description,
                'page' => $contact_us_option_group->getSlug()

            ),
            $contact_us_settings
        );
    }


    protected function buildLocationDetailsSection( $primaryMenuSlug ) {
        $tabs = Tabs::getInstance();
        //Location details is our landing page section
        $section_slug = 'location-details';
        $section_heading = 'Location';
        $section_description = 'Location information';

        $tabs->addTab( $primaryMenuSlug, $section_heading, $primaryMenuSlug );

        $blog_id = \get_current_blog_id();
        $optionGrp = new OptionGroup('rh_settings');
        $current_location_id = $optionGrp->getValue('current_location_id');
        if($blog_id !== $current_location_id) {
            $result = $optionGrp->setValue('current_location_id', $blog_id);
        }

        //Location Details Section
        $settings = array(
            //Location form

            array(
                'fieldname'=>'current_location_id',
                'label'     =>'Location ID',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_SIMPLE_TEXT_READONLY
            ),
            array(
                'fieldname'=>'street_1',
                'label'     =>'Street Address 1',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'street_2',
                'label'     =>'Street Address 2',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'city',
                'label'     =>'City',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'state',
                'label'     =>'State',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_SELECT,
                'selectOptions' =>State::$states_list_of_arrays
            ),
            array(
                'fieldname'=>'zip',
                'label'     =>'Zip Code',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'phone',
                'label'     =>'Phone',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'latlng',
                'label'     =>'LatLng (Enter or use button below once address is populated.)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),
            array(
                'fieldname'=>'getlatlng',
                'label'     =>'Click to geocode address',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_SIMPLE_BUTTON
            ),
		array(
                'fieldname'=>'google_map_url',
                'label'    =>'Google Map URL Copy this url [https://www.google.com/maps/embed/v1/place?key=AIzaSyDk5fO87L8WDLReyLDcynSPmVjdzs9VX7o&q=+Brixx+Woodfire+Pizza+]',
		'description' => 'Copy this url [https://www.google.com/maps/embed/v1/place?key=AIzaSyDk5fO87L8WDLReyLDcynSPmVjdzs9VX7o&q=+Brixx+Woodfire+Pizza+]',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),

            array(
                'fieldname'=>'location_manager',
                'label'     =>'Location Manager',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),

            array(
                'fieldname'=>'location_manager_image',
                'label'     =>'Location Manager Image (1080px x 771px expected)',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_BROWSE_MEDIA
            ),

            array(
                'fieldname'=>'nutrition_pdf',
                'label'     =>'Nutrition PDF',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_BROWSE_MEDIA
            ),

            array(
                'fieldname'=>'catering_pdf',
                'label'     =>'Catering PDF',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_BROWSE_MEDIA
            ),

        );

        $locationOptionsSection = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$section_slug,
                'label'=>$section_heading,
                'description'=> $section_description,
                'page' => $primaryMenuSlug // our primary landing section for this options page

            ),
            $settings
        );
    }


    protected function buildSinglePlatformSection( $primaryMenuSlug ) {
        $tabs = Tabs::getInstance();
        //Contact Us form options will be our next tab
        $option_group = new OptionGroup( 'single_platform_options' );
        $option_group->initGroup();
        $section_slug = 'single-platform';
        $heading = 'Single Platform';
        $description = 'Single Platform information for this location';

        $tabs->addTab( $option_group->getSlug(), $heading, $primaryMenuSlug );

        //Form Section
        $settings = array(
            array(
                'fieldname'=>'single_platform_location_slug',
                'label'     =>'Single Platform Location Slug',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            )
        );
        $section = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$section_slug,
                'label'=>$heading,
                'description'=> $description,
                'page' => $option_group->getSlug()

            ),
            $settings
        );
    }

    protected function buildBeerMenuSection( $primaryMenuSlug ) {
        $tabs = Tabs::getInstance();
        //Contact Us form options will be our next tab
        $option_group = new OptionGroup( 'beermenu_options' );
        $option_group->initGroup();
        $section_slug = 'beermenus';
        $heading = 'Beer Menus';
        $description = 'If populated, code below will be used in lieu of Single Platform for displaying beer menu for this location.';

        $tabs->addTab( $option_group->getSlug(), $heading, $primaryMenuSlug );

        //Form Section
        $settings = array(
            array(
                'fieldname'=>'location_beermenu',
                'label'     =>'Beer Menu Embed',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_TEXTAREA

            )

        );
        $section = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$section_slug,
                'label'=>$heading,
                'description'=> $description,
                'page' => $option_group->getSlug()

            ),
            $settings
        );
    }

    protected function buildMiscSection( $primaryMenuSlug ) {
        $tabs = Tabs::getInstance();

        $option_group = new OptionGroup( 'misc_options' );
        $option_group->initGroup();
        $section_slug = 'misc';
        $heading = 'Miscellaneous';
        $description = 'Miscellaneous information for this location';

        $tabs->addTab( $option_group->getSlug(), $heading, $primaryMenuSlug );

        //Form Section
        $settings = array(
            array(
                'fieldname' => 'misc_order_online_url',
                'label'     =>'Order Online URL',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            )
        );
        $section = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$section_slug,
                'label'=>$heading,
                'description'=> $description,
                'page' => $option_group->getSlug()

            ),
            $settings
        );
    }

    /**
     * General theme options
     */
    public function generateLocationOptions( $primaryMenuSlug ) {
        //This page uses tabbed navigation...so we assemble our Tabs singleton that is used in our menu callback function
        $tabs = Tabs::getInstance();

        //Initialize menu
        $option_slug = $primaryMenuSlug;//This defines our landing page wrapper.
        $optionsMainMenuArgs= array(
            'page_title'=> 'Brixx Location Options',
            'menu_title'=> 'Brixx Options',
            'capability'=> 'manage_options',
            'menu_slug' => $option_slug,
            'function'  => 'generate_tabbed_options_page',
            'icon_url'  => 'dashicons-welcome-widgets-menus',
            'position'  => 3.5,
        );
        $menu = new OptionsMenu( $optionsMainMenuArgs );

        //We will use tabbed navigation for these location specific option sections
        $this->buildNotificationSection( $primaryMenuSlug );

        $this->buildLocationDetailsSection( $primaryMenuSlug );

        $this->buildContactUsSection( $primaryMenuSlug );

        $this->buildMyEmmaSection( $primaryMenuSlug );

        // $this->buildConstantContactSection( $primaryMenuSlug );


        $this->buildSinglePlatformSection( $primaryMenuSlug );

        $this->buildBeerMenuSection( $primaryMenuSlug );
        $this->buildMiscSection( $primaryMenuSlug );



    }

    /**
     * Super Admin options
     */
    public function generateSuperAdminOptions( $primary_menu_slug ) {
        $option_slug = 'rh_admin_options';
        $section_slug = 'rh_admin_options_section';
        $section_heading = 'Admin Options';
        $section_description = 'Super Admin Only options';
        $submenuArgs= array(
            'page_title'=> 'Brixx Admin Options',
            'menu_title'=> 'Admin Options',
            'capability'=> 'manage_options',
            'menu_slug' => $option_slug,
            'function'  => 'generate_options_page'
        );
        $menu = new \RedHammer\WordPress\Options\SubMenu( $submenuArgs, $primary_menu_slug );

        $settings = array(
            array(
                'fieldname'=>'default_location_id',
                'label'     =>'Default location ID. When location is not provided, this location will be selected. Visit Network Admin to retrieve Site ID\'s',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),

            //Google Maps API Key
            array(
                'fieldname'=>'google_maps_api_key',
                'label'     =>'Google Maps API Key',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PASSWORD
            ),
            //Default 'View Menu link'
            array(
                'fieldname'=>'default_view_menu_href',
                'label'     =>'Default <em>"View Menu"</em> url. Used to populate the link wherever <em>"View Menu"</em> buttons are displayed.',
                'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            ),

            //Nutrition Information Link
            // array(
            //     'fieldname'=>'nutrition_info_href',
            //     'label'     =>'URL to the master Nutrition Information page/pdf',
            //     'controlType' => \RedHammer\WordPress\Options\Setting::CONTROL_PLAINTEXT
            // ),


        );

        $optionsSection = new \RedHammer\WordPress\Options\Section(
            array(
                'slug'=>$section_slug,
                'label'=>$section_heading,
                'description'=> $section_description,
                'page' => $option_slug

            ),
            $settings
        );

    }


}//end class
