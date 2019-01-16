<?php
namespace Brixx\Classes;
use \RedHammer\WordPress\Options\OptionGroup as OptionGroup; 
/**
* Blog administers various blog settings
*/
class Blog
{
	public static function getParentSiteUrl() {
		return \get_site_url(1);
	}

	/**
	 * [setToDefaultBlog Convenience method for setting current blog to the blog specified in admin options]
	 */
	public static function setToDefaultBlog(){
		static::resetBlog();
	    $admin_options = new \RedHammer\WordPress\Options\OptionGroup('rh_admin_options');
	    $site_id = esc_attr($admin_options->getValue('default_location_id'));
	    if(rh_isset($site_id)) {
	    	static::setBlogById($site_id);	        
	     } else {
	        static::resetBlog();
	     }
	}

	/**
	 * [setBlog Convenience method for setting current blog based on passed paramters or theme admin option default blog setting]
	 */
	public static function setBlogById($id){
		static::resetBlog();
		if( isset( $id ) && !empty( $id ) ) {
			$site_id = $id;
		    if( filter_var($site_id, FILTER_VALIDATE_INT) ) { 
		        \switch_to_blog($site_id);
		    } elseif (!is_null($id)) {
		    	$site_id = $id;
		    	\switch_to_blog($site_id);
		    } else {
		        setToDefaultBlog();

		    }
		}
	   
	}
	/**
	 * [setBlog Convenience method for re-establishing the current blog ]
	 */
	public static function resetBlog(){
	    return \restore_current_blog();
	}
}