 <?php 
 	if( isset( $post->ID ) && !empty( $post->ID ) ):
    $src = rh_get_featured_image_src($post->ID);
    if($src):
     ?>
    <div class="featured-img">
      <img src="<?php echo $src ?>" class="img-responsive" />
    </div>
  <?php endif;endif; ?>