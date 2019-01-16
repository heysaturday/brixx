<?php 
namespace Brixx\Classes;

/**
* Flyout This class is home to our flyout tabs and content selectable via custom fields in our pages.
*/

class Flyout
{
    /**
     * @var Singleton The reference to *Singleton* instance of this class
     */
    private static $instance;
    
    protected $flyout_slugs= [
		'full_menu'=>'Full Menu',
		'beer_news'=>'Sign Up for Beer News',
		'nutrition_button'=>'Nutrition Button',
		'brixx_fixx_menu'=>'Brixx Fixx Menu',
		'catering_menu'=>'Catering Menu',
		'find_out_more'=>'Find Out More',
	];
    /**
     * Returns the *Singleton* instance of this class.
     *
     * @return Singleton The *Singleton* instance.
     */
    public static function getInstance()
    {
        if (null === static::$instance) {
            static::$instance = new static();
        }
        
        return static::$instance;
    }

    public function get_options() {
    	return $this->flyout_slugs;
    }

    public function get_by_slug($flyout_slug) {
    	$slug = filter_var($flyout_slug, FILTER_SANITIZE_STRING);
    	if( array_key_exists($slug, $this->flyout_slugs) ) {
    		return $this->$slug();
    	}
    	return false;
    }

    protected function full_menu(){
    	
		ob_start();
			?>
			<flyout>
				<flyout-content title="Full Menu" id="menu-nav-flyout">
					<!-- <nav class="block-nav">
						<ul>
							<li ng-repeat="menu in menuCollection.menus"><a ng-href="#/{{menu.id}}" ng-click="toggle();">{{menu.name}}</a></li>
						</ul>
					</nav> -->
                    <nav class="block-nav">
                    <?php 
                    wp_nav_menu(array(
                            'theme_location' => 'full-food-menu',
                            'container' => '',
                            'container_class' => '',
                            'menu_class' => '',
                            'fallback_cb' => false
                            )
                        );

                     ?>
                     </nav>
				</flyout-content>
			</flyout>
			

			<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
    }

    protected function beer_news() {
		ob_start();
			?>
			<flyout>
				<flyout-content title="Sign Up for Beer News">
                        <div class="inside flyout-form" ng-controller="BeerNewsFormCtrl">
                            <form name="beerNewsForm" ng-submit="submit()" novalidate>
                                <div class="form-inline two-col">
                                        <div ng-class="{'has-warning': beerNewsForm.$dirty && beerNewsForm.firstName.$invalid }" class="form-group">
                                            <input ng-model="formData.firstName" required type="text" class="form-control" placeholder="First Name" name="firstName">
                                        </div>
                                        <div ng-class="{'has-warning': beerNewsForm.$dirty && beerNewsForm.lastName.$invalid }" class="form-group">
                                          <input ng-model="formData.lastName" required type="text" class="form-control" placeholder="Last Name" name="lastName">
                                      </div>
                                </div>
                                <!-- two-col -->
                                <div class="form-inline two-col">
                                    <div ng-class="{'has-warning': beerNewsForm.$dirty && beerNewsForm.emailAddress.$invalid }" class="form-group">
                                          <input ng-model="formData.emailAddress" required type="email" class="form-control" placeholder="Email" name="emailAddress">
                                    </div>
                                    <!--locationId-->

                                    <div ng-class="{'has-warning': contactForm.$dirty && contactForm.locationId.$invalid}" class="form-group">
                                        <select ng-model="formData.locationId" class="form-control" name="locationId" integer ng-options="item.ID as item.blogname for item in locations">
                                           <option value="" disabled >Select Your Brixx</option>
                                           <!-- <option ng-selected="formData.locationId === location.ID" ng-repeat="location in locations" value="{{location.ID}}">{{location.blogname}}</option>                                     -->
                                       </select>
                                    </div><!--#form_row-->
                                    <!--#locationId-->
                                </div>
                                <!-- two-col -->
                                <div class="form-inline">
                                    <button ng-disabled="beerNewsForm.$invalid" type="submit" class="btn btn-default">Submit</button>
                                </div>
                            </form>
                        </div>
                        <!-- inside -->

                </flyout-content>
            </flyout>

			<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
    }

    protected function nutrition_button() {
    	return $this->makeButton('nutrition', 'View Nutrition');		
    }

    protected function brixx_fixx_menu() {
		return $this->makeButton('brixx_fixx', 'View Brixx Fixx Menu');
    }

    protected function catering_menu() {
		return $this->makeButton('catering_menu', 'View Catering Menu');
    }

    protected function find_out_more() {
		return $this->makeButton('find_out_more', 'Find Out More');
    }

    protected function makeButton($classname, $label){
        $href = "#";
        switch ($classname) {
            case 'nutrition':
                $slug = 'nutrition_pdf';
                break;

            case 'catering_menu':
                $slug = 'catering_pdf';
                break;
            
            default:
                $slug = false;
                break;
        }
        if($slug) {
            $blog_id = \get_current_blog_id();
            $currentLocationId = false;
            if( isset( $_SESSION['selectedLocationId'] ) && !empty( $_SESSION['selectedLocationId'] ) ) {
                $currentLocationId = $_SESSION['selectedLocationId'];           
            } 
            $optionGroup = new \RedHammer\WordPress\Options\OptionGroup( 'rh_settings' );
            $hrefDefault = $optionValue = $optionGroup->getValue( $slug );
            $hrefDefault = isset( $hrefDefault ) && !empty( $hrefDefault ) ? $hrefDefault : '#' ;
            if($currentLocationId) {
                $href = $optionValue = $optionGroup->getValue( $slug, $currentLocationId ); 
            }
            $href = isset( $href ) && !empty( $href ) ? $href : $hrefDefault;
            
        }
                
    	ob_start();
		?>
		<div class="flyout-wrapper <?php echo $classname ?>">
			<a href="<?php echo $href ?>" target="_blank" class="flyout-toggle-btn "><i class="fa fa-plus"></i>&nbsp;&nbsp;<?php echo $label ?></a>
		</div>
		<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
    }

    /**
     * Protected constructor to prevent creating a new instance of the
     * *Singleton* via the `new` operator from outside of this class.
     */
    protected function __construct()
    {
    }

    /**
     * Private clone method to prevent cloning of the instance of the
     * *Singleton* instance.
     *
     * @return void
     */
    private function __clone()
    {
    }

    /**
     * Private unserialize method to prevent unserializing of the *Singleton*
     * instance.
     *
     * @return void
     */
    private function __wakeup()
    {
    }
}