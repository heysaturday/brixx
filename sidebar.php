<aside>
	<div class="inside">
    <?php if ( is_active_sidebar( 'primary' ) ) : ?>

		<?php dynamic_sidebar( 'primary' ); ?>

	<?php else : ?>

		<!-- Create some custom HTML or call the_widget().  It's up to you. -->
		

	<?php endif; ?>
	</div><!-- end inside -->
</aside>