<?php use \Brixx\CustomFields\CustomPageElements as CustomPageElements; ?>
<div id="content_wrap">
	<main>
		<div class="inside clearfix">
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
				<?php the_content(); ?>
			<?php endwhile; endif; ?>
		</div>
		<!-- inside -->
	</main>
	<?php //get_sidebar( RedHammer\WordPress\UI\Wrapper::template_base() ); ?>
</div> <!--end content_wrap-->
<?php 
	// global $post; 
	// $flyoutContent = CustomPageElements::getPrimaryFlyouts($post->ID);
	// if($flyoutContent) {
	// 	echo $flyoutContent;
	// }
?>

