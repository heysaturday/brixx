<?php
namespace Brixx\Classes;
use \RedHammer\API\ResponseObject as ResponseObject;
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup;
use \RedHammer\WordPress\UI\SinglePageWalkerNavMenu as WalkerNavMenu;
require_once 'Blog.php';
/**
 * Menu administers various menus
 */
class Menu {

	const PRIMARY_MENU_SLUG = 'primary-menu';
	const SPECIALS_MENU_SLUG = 'specials-menu';
	const SOCIAL_MENU_SLUG = 'social-menu';

	public $menuSlug = '';
	public $siteId = '';
	public $menu='';

	/**
	 * [__construct constructor]
	 */
	function __construct( $menu_slug = NULL, $site_id = NULL ) {
		if ( !is_null( $menu_slug ) ) {
			$this->menuSlug = $menu_slug;
		}

		if ( !is_null( $site_id ) ) {
			$this->siteId = $site_id;
		}

		//Main nav ajax
		add_action( 'wp_ajax_get_main_nav', array( $this, 'get_main_nav_cb' ) );
		add_action( 'wp_ajax_nopriv_get_main_nav', array( $this, 'get_main_nav_cb' ) );

		//Specials nav ajax
		add_action( 'wp_ajax_get_specials_nav', array( $this, 'get_specials_nav_cb' ) );
		add_action( 'wp_ajax_nopriv_get_specials_nav', array( $this, 'get_specials_nav_cb' ) );

		//Social nav ajax
		add_action( 'wp_ajax_get_social_nav', array( $this, 'get_social_nav_cb' ) );
		add_action( 'wp_ajax_nopriv_get_social_nav', array( $this, 'get_social_nav_cb' ) );

		//Flyout food submenu
		add_filter( 'wp_nav_menu_objects', array('\\Brixx\\Classes\\Menu', 'food_menu_sub_menu'), 10, 2 );
	}


	/**
	 * Provide an ajax means of retrieving our social nav
	 */
	public function get_social_nav_cb() {
		$responseObject = new ResponseObject();
		try {
			$site_id = filter_input( INPUT_GET, 'site_id', FILTER_SANITIZE_NUMBER_INT );
			if ( filter_var( $site_id, FILTER_VALIDATE_INT ) ) {
				$menuObj = new self( self::SOCIAL_MENU_SLUG, $site_id );
				$responseObject->set( $menuObj->fetchMenu(), NULL, false );
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



	/**
	 * Provide an ajax means of retrieving our specials nav
	 */
	public function get_specials_nav_cb() {
		$responseObject = new ResponseObject();
		try {
			$site_id = filter_input( INPUT_GET, 'site_id', FILTER_SANITIZE_NUMBER_INT );

			if ( filter_var( $site_id, FILTER_VALIDATE_INT ) ) {
				$menuObj = new self( self::SPECIALS_MENU_SLUG, $site_id );
				$responseObject->set( $menuObj->fetchMenu(), NULL, false );
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

	/**
	 * Provide an ajax means of retrieving our primary nav
	 */
	public function get_main_nav_cb() {
		$responseObject = new ResponseObject();
		try {
			$site_id = filter_input( INPUT_GET, 'site_id', FILTER_SANITIZE_NUMBER_INT );
			if ( filter_var( $site_id, FILTER_VALIDATE_INT ) ) {
				$menuObj = new self( self::PRIMARY_MENU_SLUG, $site_id );
				$responseObject->set( $menuObj->fetchMenu(), NULL, false );
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


	protected function validateSpecialsMenu() {
		if ( count( $this->menu->childMenuItems )<1 ) {
			$menu = $this->getDefaultMenuBySlug();
			$menu_items = \wp_get_nav_menu_items( $menu->slug );
			$this->menu = $this->assembleMenu( $menu_items );
		}
	}

	/**
	 * [validateSocialMenu Validate social menu valuesdescription]
	 *
	 * @return [type] [We merge values from our current location with parent site. So if no facebook, but has a twitter, parent site defaults in place where missing.]
	 */
	protected function validateSocialMenu() {
		$defaultMenu = $this->getDefaultMenuBySlug();
		$default_menu_items = \wp_get_nav_menu_items( $defaultMenu->slug );
		$locationMenu = $this->getMenuBySlug();
		$location_menu_items = \wp_get_nav_menu_items( $locationMenu->slug );
		$menu_items = $default_menu_items;
		for ( $i=0; $i < count( $menu_items ) ; $i++ ) {
			for ( $k=0; $k < count( $location_menu_items ) ; $k++ ) {
				if ( !isset( $location_menu_items[$k]->url ) || empty( $location_menu_items[$k]->url ) ) {
					continue;
				}
				if ( strcasecmp( $menu_items[$i]->post_name, $location_menu_items[$k]->post_name )==0 ) {
					$menu_items[$i]->url = $location_menu_items[$k]->url;
				}
			}
		}
		$this->menu = $this->assembleMenu( $menu_items );

		return $this->menu;

	}


	protected function fetchMenu() {
		//Make sure the specials menu has child items
		if ( $this->menuSlug == self::SOCIAL_MENU_SLUG ) {
			$this->validateSocialMenu();
			return $this->menu;
		}
		$menu = $this->getMenuBySlug();

		if ( !$menu ) {
			$menu = $this->getDefaultMenuBySlug();
		}
		$menu_items = \wp_get_nav_menu_items( $menu->slug );
		$this->menu = $this->assembleMenu( $menu_items );
		//Make sure the specials menu has child items
		if ( $this->menuSlug == self::SPECIALS_MENU_SLUG ) {
			$this->validateSpecialsMenu();
		}
		return $this->menu;
	}


	protected function assembleMenu( $menu_items ) {
		$assembly = new \stdClass();
		$parentItemIds = [];
		$parentMenuItems = [];
		$childMenuItems = [];
		foreach ( $menu_items as $obj ) {
			if ( $obj->menu_item_parent > 0 ) {
				$parentItemIds[]=$obj->menu_item_parent;
				$childMenuItems[]=$obj;
			} else {
				$parentMenuItems[]=$obj;
			}
		}
		$parentItemIds = array_unique( $parentItemIds );
		$assembly->parentItemIds = $parentItemIds;
		$assembly->parentMenuItems = $parentMenuItems;
		$assembly->childMenuItems = $childMenuItems;

		return $assembly;

	}

	protected function getMenuBySlug() {
		Blog::setBlogById( $this->siteId );
		$menu = $this->getMenu();
		return $menu;
		Blog::resetBlog();
		return $menu;
	}

	protected function getDefaultMenuBySlug(  ) {
		Blog::setToDefaultBlog();
		$menu = $this->getMenu();
		Blog::resetBlog();
		return $menu;
	}

	protected function getMenu() {
		$menu = WalkerNavMenu::get_theme_menu( $this->menuSlug );
		return $menu;

	}


	/**
	 * [getDefaultFooterNav fallback_cb method for footer navigation]
	 *
	 * @param [type]  $args [description]
	 * @return [type]       [description]
	 */
	public static function getDefaultFooterNav( $args ) {
		Blog::setToDefaultBlog();
		$menu = \wp_nav_menu( array(
				'echo' => false,
				'theme_location' => 'footer-menu',
				'container' => '',
				'menu_class' => 'columns',
				'fallback_cb'=> false

			) );
		Blog::resetBlog();
		return $menu;
	}



	/**
	 * Retrieve Food Menu submenu for display in flyouts
	 *
	 * @see http://christianvarga.com/how-to-get-submenu-items-from-a-wordpress-menu-based-on-parent-or-sibling/
	 */
	// filter_hook function to react on sub_menu flag
	public static function food_menu_sub_menu( $sorted_menu_items, $args ) {
		if ( isset( $args->food_sub_menu ) ) {
			$root_id = 0;

			// find the current menu item
			foreach ( $sorted_menu_items as $menu_item ) {
				if ( $menu_item->current ) {
					// set the root id based on whether the current menu item has a parent or not
					$root_id = ( $menu_item->menu_item_parent ) ? $menu_item->menu_item_parent : $menu_item->ID;
					break;
				}
			}

			// find the top level parent
			if ( ! isset( $args->direct_parent ) ) {
				$prev_root_id = $root_id;
				while ( $prev_root_id != 0 ) {
					foreach ( $sorted_menu_items as $menu_item ) {
						if ( $menu_item->ID == $prev_root_id ) {
							$prev_root_id = $menu_item->menu_item_parent;
							// don't set the root_id to 0 if we've reached the top of the menu
							if ( $prev_root_id != 0 ) $root_id = $menu_item->menu_item_parent;
							break;
						}
					}
				}
			}
			$menu_item_parents = array();
			foreach ( $sorted_menu_items as $key => $item ) {
				// init menu_item_parents
				if ( $item->ID == $root_id ) $menu_item_parents[] = $item->ID;
				if ( in_array( $item->menu_item_parent, $menu_item_parents ) ) {
					// part of sub-tree: keep!
					$menu_item_parents[] = $item->ID;
				} else if ( ! ( isset( $args->show_parent ) && in_array( $item->ID, $menu_item_parents ) ) ) {
						// not part of sub-tree: away with it!
						unset( $sorted_menu_items[$key] );
					}
			}

			return $sorted_menu_items;
		} else {
			return $sorted_menu_items;
		}
	}





}
