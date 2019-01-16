<?php if (have_posts()) : ?>


	<?php include (TEMPLATEPATH . '/inc/nav.php' ); ?>

	<?php while (have_posts()) : the_post(); ?>

		<div <?php post_class() ?> id="post-<?php the_ID(); ?>">

			<h4><a href="<?php echo get_the_permalink(); ?>"><?php the_title(); ?></a></h4>

			<?php include (TEMPLATEPATH . '/inc/meta.php' ); ?>

			<div class="entry">
				<?php the_excerpt(); ?>
			</div>

		</div>

	<?php endwhile; ?>

	<?php include (TEMPLATEPATH . '/inc/nav.php' ); ?>

<?php else : ?>

	<h2>No posts found.</h2>

<?php endif; ?>
