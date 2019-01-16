<?php
    use \Brixx\CustomFields\CustomPageElements as CustomPageElements;
    use \Brixx\Classes\Media as Media;
?>
<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html <?php language_attributes(); ?> class="no-js lt-ie9 lt-ie8 lt-ie7 " ng-app="wpApp" > <![endif]-->
<!--[if IE 7]>    <html <?php language_attributes(); ?> class="no-js lt-ie9 lt-ie8 " ng-app="wpApp" > <![endif]-->
<!--[if IE 8]>    <html <?php language_attributes(); ?> class="no-js lt-ie9 " ng-app="wpApp" > <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!--> <html <?php language_attributes(); ?> class="no-js tk-futura-pt" ng-app="wpApp" > <!--<![endif]-->
<head>
    <meta charset="<?php bloginfo('charset'); ?>">

    <?php if (is_search()) { ?>
    <meta name="robots" content="noindex, nofollow" />
    <?php } ?>

    <title><?php echo (WP_DEBUG) ? '[DEV] ' : ''; ?><?php wp_title('|'); ?></title>


    <!-- Mobile viewport optimized: h5bp.com/viewport -->
    <meta  name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0"  />
     <!--Full screen mode when launched from homescreen icon-->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-touch-fullscreen" content="yes" />

    <link rel="shortcut icon" href="<?php echo bloginfo('template_directory'); ?>/favicon.ico">
    <link rel="shortcut icon" href="<?php echo bloginfo('template_directory'); ?>/favicon.ico" type="image/x-icon">
    <link rel="icon" href="<?php echo bloginfo('template_directory'); ?>/favicon.ico" type="image/x-icon">

    <!-- For iPhone with high-resolution Retina display: -->
    <link href="<?php echo bloginfo('template_directory'); ?>/apple-touch-icon.png" rel="apple-touch-icon" />
    <link href="<?php echo bloginfo('template_directory'); ?>/apple-touch-icon-76x76.png" rel="apple-touch-icon" sizes="76x76" />
    <link href="<?php echo bloginfo('template_directory'); ?>/apple-touch-icon-120x120.png" rel="apple-touch-icon" sizes="120x120" />
    <link href="<?php echo bloginfo('template_directory'); ?>/apple-touch-icon-152x152.png" rel="apple-touch-icon" sizes="152x152" />

    <!-- For iPhone with high-resolution Retina display: -->
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="<?php echo bloginfo('template_directory'); ?>/apple-touch-icon-114x114-precomposed.png">
    <!-- For first- and second-generation iPad: -->
    <link rel="apple-touch-icon-precomposed" sizes="72x72" href="<?php echo bloginfo('template_directory'); ?>/apple-touch-icon-72x72-precomposed.png">
    <!-- For non-Retina iPhone, iPod Touch, and Android 2.1+ devices: -->
    <link rel="apple-touch-icon-precomposed" href="<?php echo bloginfo('template_directory'); ?>/apple-touch-icon-precomposed.png">

    <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>">

    <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>">

    <?php wp_head(); ?>
        <!--[if lt IE 9]>
            <script src="<?php echo get_stylesheet_directory_uri();  ?>/js/lib/respond.min.js"></script>
            <![endif]-->
        <!--[if gte IE 9]>
            <style type="text/css">
              .gradient {
                 filter: none;
              }
            </style>
            <![endif]-->
        <script>
            var doc = document.documentElement;
            doc.setAttribute('data-useragent', navigator.userAgent);
        </script>
        </head>

        <?php
        global $post;
        if( isset( $post ) && !empty( $post ) && isset( $post->ID ) && !empty( $post->ID ) ) {
            $baseColor = \Brixx\CustomFields\CustomPageElements::getBaseColor($post->ID);
            $flyoutContent = CustomPageElements::getPrimaryFlyouts($post->ID);
            if($flyoutContent) {
                $baseColor .= ' has-flyout';
            }
        } else {
            $baseColor = 'blue';
        }


        ?>
        <body <?php body_class($baseColor); ?> ng-controller="AppCtrl">
        <!-- <loader></loader>         -->
        <div class="animate" <?php echo is_page_template('page-templates/menu.php') ? 'menu-page': 'page' ?>>
    <!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
    chromium.org/developers/how-tos/chrome-frame-getting-started -->
    <!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a> to experience this site.</p><![endif]-->
    <div class="js-off">
        <p><em>You'll need JavaScript enabled to use this site.</em></p>
    </div>
    <div class="old_ie">
        <p><em>We often have customers with a need to cater to old versions of IE browsers like the one you're using. But we're not a big fan of IE ourselves...so we've elected to save some time in the development of our website and not code a myriad of customizations to support IE. Our site (and just about anyone else's for that matter) is better viewed in anything but IE8 or below.</em></p>
    </div>

    <header id="masthead">
        <div class="inside">
            <h1 id="site-title" class="text-hide"><a href="<?php echo esc_url(home_url('/')); ?>"><?php bloginfo('name'); ?></a></h1>

            <!-- Mobile navigation -->
            <main-nav class="mobile" template-url="nav-mobile.html"></main-nav>

            <!-- Desktop interior page navigation -->
            <main-nav class="desktop"></main-nav>
            <?php if(is_page_template('page-templates/menu.php')): ?>
                <nutrition-legend></nutrition-legend>
            <?php endif; ?>
        </div>
        <div notification ></div>
        <?php if(!is_front_page()): ?>
            <?php
            $media = new Media();
            echo $media;
            ?>
            <?php \get_template_part('loop', 'title') ?>
        <?php endif; ?>
    </header>
    <hr class="page-title-separator" />
    <div id="page_wrap">


