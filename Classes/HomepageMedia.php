<?php
namespace Brixx\Classes;
use Brixx\CustomFields\CustomPageElements as CustomPageElements; 
/**
* Manages Hero area media display on homepage
*/
class HomepageMedia extends Media
{
	

	function __construct()
	{
		parent::__construct(false);
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
				<?php if($this->fallbackMediaUrl): ?>	
					<?php echo $this->getMobileMediaDisplay() ?>
				<?php endif; ?>	
			</div>			
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
		<div class="header-media mobile"><img class="img-responsive" src="<?php echo $this->fallbackMediaUrl ?>"/></div> 
		<?php
		$html = ob_get_contents();
		ob_end_clean();
		// return the buffer
		return $html;
					
	}

	protected function getMobileMediaUrl() {
		$this->mobileMediaUrl = $this->getFallbackMediaUrl();
		return $this->mobileMediaUrl;
	}



	

	
}

 ?>