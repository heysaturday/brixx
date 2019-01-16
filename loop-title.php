<?php use  \Brixx\CustomFields\CustomPageElements as PageElements  ?>
<?php if (have_posts()) : while (have_posts()) : the_post(); ?>
    <?php
    if (is_tax()):
        global $wp_query;
        $term = $wp_query->get_queried_object();
        $title = $term->name;
        $tax_description = $term->description;
    ?>
        <hgroup class="page-title">
            <h2><?php echo $title; ?></h2>
            <h5><?php echo $tax_description; ?></h5>
        </hgroup>

    <?php elseif (is_page()): ?>
    <hgroup class="page-title">

        <?php $header = PageElements::getDisplayTitle(); ?>
        <h2><?php echo $header ?></h2>


    <?php elseif(is_search()): ?>
        <h2>Search Results</h2>
        <?php break; ?>
    <?php else: ?>
        <h2><?php the_title(); ?></h2>
    <?php endif; ?>
    </hgroup>
<?php endwhile; endif; ?>