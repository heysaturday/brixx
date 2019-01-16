<?php use  \Brixx\CustomFields\CustomPageElements as PageElements  ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
	<?php 
	$heading = PageElements::getDisplayTitle();;
	$tab_content = get_post_meta( get_the_ID(), 'rh_tab_content', true );
	$tab_title = get_post_meta( get_the_ID(), 'rh_tab_title', true );
	 ?>
	<tabs class="tabbed-nav-wrap page-content-tabs" >
		<pane title="<?php echo $heading ?>">
			<div class="inside">
			<?php the_content() ?>
			</div>
			<!-- #inside -->
			<?php 
				// global $post; 
				// $flyoutContent = PageElements::getPrimaryFlyouts($post->ID);
				// if($flyoutContent) {
				// 	echo $flyoutContent;
				// }
			?>
		</pane>
		<pane title="<?php echo $tab_title ?>">
			<div class="inside">
				<?php echo $tab_content; ?>
			</div>
			<?php 
				// global $post; 
				// $flyoutContent_b = PageElements::getSecondaryFlyouts($post->ID);
				// if($flyoutContent_b) {
				// 	echo $flyoutContent_b;
				// }
			?>
		</pane>

	</tabs>

<?php endwhile; endif; ?>
