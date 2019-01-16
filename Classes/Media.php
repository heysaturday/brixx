<?php
namespace Brixx\Classes;
use Brixx\CustomFields\CustomPageElements as CustomPageElements;
/**
* Manages Header and Hero area media display
*/
class Media
{
	protected $isMasthead = true;
	protected $primaryMediaUrl = false;
	protected $fallbackMediaUrl = false;
	protected $mobileMediaUrl = false;

	function __construct($isMasthead = true)
	{
		$this->isMasthead = $isMasthead;
	}

	public function __toString()
    {
        return $this->display();
    }

	protected function display() {
		//Is the primary video populated?
		$this->primaryMediaUrl = $this->getPrimaryMediaUrl();
		$this->fallbackMediaUrl = $this->getFallbackMediaUrl();
		$this->mobileMediaUrl = $this->getMobileMediaUrl();
		if($this->primaryMediaUrl) {
			return $this->getPrimaryMediaDisplay();
		}
		return $this->getFallbackMediaUrl() ? $this->getSecondaryMediaDisplay() : '';
	}

	protected function getPrimaryMediaDisplay(){
		ob_start();?>
			<div class="media-wrap">
				<video class="header-media" >
					<source type="video/mp4" src="<?php echo $this->primaryMediaUrl ?>"  />
					<?php if( $this->getFallbackMediaUrl() ): ?>
						<img src="<?php echo $this->fallbackMediaUrl ?>" class="img-responsive" title="Your browser does not support the video element" />
					<?php endif; ?>
						Your browser does not support the <code>video</code> element.
				</video>
				<?php if($this->mobileMediaUrl): ?>
					<?php echo $this->getMobileMediaDisplay() ?>
				<?php endif; ?>
			</div>
		<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
	}

	protected function getSecondaryMediaDisplay(){
		if(!$this->getFallbackMediaUrl()) {
			return false;
		}
		ob_start();
		?>
		<div class="media-wrap">
			<?php echo $this->getFallbackMediaDisplay() ?>
			<?php if($this->mobileMediaUrl): ?>
				<?php echo $this->getMobileMediaDisplay() ?>
			<?php endif; ?>
		</div>
		<!-- #media-wrap -->

		<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
	}

	protected function getFallbackMediaDisplay(){
		if(!$this->getFallbackMediaUrl()) {
			return false;
		}
		ob_start();
		?>
		<div class="header-media"><img class="img-responsive" src="<?php echo $this->fallbackMediaUrl ?>"/></div>
		<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;

	}

	protected function getMobileMediaDisplay(){
		if(!$this->getMobileMediaUrl()) {
			return false;
		}
		ob_start();
		?>
		<div class="header-media mobile"><img class="img-responsive" src="<?php echo $this->mobileMediaUrl ?>"/></div>
		<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;

	}



	/**
	 * [getPrimaryMediaUrl test to see if a video is set for the subject post]
	 * @return boolean|html [returns false if not set, display html if true]
	 */
	protected function getPrimaryMediaUrl() {
		global $post;

		if( isset( $post->ID ) && !empty( $post->ID ) ) {
		    $headerImg = \Brixx\CustomFields\CustomPageElements::getHeaderImage($post->ID);
		    $isVideo= static::is_video($headerImg);
		    if(!$isVideo) {
		    	$headerImg = false;
		    }
		} else {
		    $headerImg = false;
		}
		$this->primaryMediaUrl = $headerImg;
		return $this->primaryMediaUrl;
	}

	protected function getFallbackMediaUrl() {
		global $post;
		if( isset( $post->ID ) && !empty( $post->ID ) ) {
		    $poster = \Brixx\CustomFields\CustomPageElements::getPosterImage($post->ID);
		} else {
		    $poster = false;
		}
		$this->fallbackMediaUrl = $poster;
		return $this->fallbackMediaUrl;
	}

	protected function getMobileMediaUrl() {
		global $post;
		if( isset( $post->ID ) && !empty( $post->ID ) ) {
		    $poster = CustomPageElements::getMobileImage($post->ID);
		} else {
		    $poster = false;
		}
		$this->mobileMediaUrl = $poster;
		return $this->mobileMediaUrl;
	}




	/**
	 * [is_video Determine is url links to a video asset]
	 * @param  [type] $url [description]
	 * @return [type]      [description]
	 */
	protected static function is_video($url){
		$path = rtrim(\get_home_path(), '/');
		$path_to_file = $path . $url;
		$finfo = \finfo_open(FILEINFO_MIME_TYPE); // return mime type ala mimetype extension
		$mime = \finfo_file($finfo, $path_to_file);
		\finfo_close($finfo);
		if($mime && strstr($mime, "video/mp4")){
		     // this code for video
		    return true;
		}
		return false;

	}
}

 ?>