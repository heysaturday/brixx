<?php use \Brixx\CustomFields\CustomPageElements as CustomPageElements; ?>
<div id="content_wrap">
	<main>
		<div class="inside clearfix">
			<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
				<?php the_content(); ?>
			<?php endwhile; endif; ?>
			<!-- src="http://brixxpizza.com/store/product.php?product=1" -->
			<iframe
				frameborder="0"
				src="//brixxpizza.com/store/product.php?product=1"
				scrolling="no"
				onload="resizeIframe(this)">
				<p>Your browser does not support iframes.</p>
			</iframe>
		</div>
		<!-- inside -->
	</main>
	<?php //get_sidebar( RedHammer\WordPress\UI\Wrapper::template_base() ); ?>
</div> <!--end content_wrap-->
<script>
	function resizeIframe(obj) {
		obj.style.height = Math.ceil(obj.contentWindow.document.body.scrollHeight + 200) + 'px';
	}
	$(document).ready(function() {
		var iframe = $("iframe");
		iframe.load(function (a, b, c) {
			let i = this;
			resizeIframe(i);
		});
	});
</script>
<?php
	// global $post;
	// $flyoutContent = CustomPageElements::getPrimaryFlyouts($post->ID);
	// if($flyoutContent) {
	// 	echo $flyoutContent;
	// }
?>

