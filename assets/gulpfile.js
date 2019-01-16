var gulp           = require('gulp'),
    path           = require('path'),
    eventStream    = require('event-stream'),
    addsrc         = require('gulp-add-src'),
    plugins        = require('gulp-load-plugins')({lazy:false}),
    mainBowerFiles = require('main-bower-files'),
    autoprefixer = require('gulp-autoprefixer'),

    settings = {
        scriptsSrc  : ['!./app/**/*_test.js','!./app/**/*modernizr.js', './app/**/*.js'],
        scriptsDst  : 'app.js',

        stylesVariables: ['./app/sass/_variables.scss', './app/sass/_mixins.scss'],

        templatesSrc: ['!./app/index.html', './app/**/*.html'],
        templatesDst: 'templates.js',

        stylesSrc   : './app/sass/**/*.scss',
        bootstrapStylesSrc   : './app/sass-bootstrap/**/*.scss',
        bootstrapCssSrc: './app/css/bootstrap/**/*.css',


        stylesSourcemapSrc   : './app/css/*.map',
        bootstrapStylesSourcemapSrc   : './app/css/bootstrap/*.map',
        stylesDst   : 'global.css',
        bootstrapStylesDst   : './app/css/bootstrap/',

        lScriptsDst : 'lib.js',
        lStylesDst  : 'lib.css',

        buildDir    : './build',
        distrDir    : './distrib',

        allImages   : './app/images/**/*.{png,jpg,gif}',
        allSwfs     : './app/swf/**/*.swf',
        fonts       : './bower_components/bootstrap/dist/fonts/*',

         //FontAwesome for Brixx
        fontawesomeStylesSrc   : './app/sass-fontawesome/**/*.scss',
        fontawesomeCssSrc: './app/css/fontawesome/**/*.css',
        fontawesomeStylesSourcemapSrc   : './app/css/fontawesome/*.map',
        fontawesomeStylesDst   : './app/css/fontawesome/',

    },

    production  = require('yargs').argv.prod,
    destination = settings.buildDir;

//To invoke: gulp build --prod
if (production) {
    destination = settings.distrDir;
}

var allVendors = mainBowerFiles(),

    getVendors = function (extensions) {
        var regexp = new RegExp('(' + extensions.join('|') + ')$');

        return allVendors.filter(function (fileName) {
            return regexp.test(fileName);
        })
    },
    jsVendors    = getVendors(['js']),
    cssVendors   = getVendors(['css']),
    fontsVendors = getVendors([
        'eot',
        'svg',
        'ttf',
        'woff',
        'woff2'
    ]);


gulp.task('templates', function(){
    gulp.src(settings.templatesSrc)
        .pipe(plugins.angularTemplatecache(settings.templatesDst, {
            standalone: true
        }))
        .pipe(gulp.dest(destination));
});

gulp.task('scripts', function () {
    return gulp.src(settings.scriptsSrc)
        .pipe(plugins.jshint())
        .pipe(plugins.jshint.reporter('default'))
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat(settings.scriptsDst))
        .pipe(plugins.ngAnnotate({
            add          : true,
            single_quotes: true
        }))
        .pipe(plugins.if(production, plugins.uglify({
            compress:false,
            global_defs: {
                'DEBUG': false
            }
        })))
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(destination));
});



gulp.task('css', function(){
    gulp.src(settings.stylesSrc)
        .pipe(plugins.compass({
          project: path.join(__dirname, 'app'),
          sourcemap: true,
          css: 'css',
          sass: 'sass'
        }))
        .pipe(autoprefixer({
                    browsers: ['last 2 versions'],
                    cascade: false
                }))
        .pipe(plugins.concat(settings.stylesDst))
        .pipe(plugins.if(production, plugins.minifyCss()))
        .pipe(gulp.dest(destination));

});

gulp.task('cssSourcemap', function(){
    gulp.src(settings.stylesSourcemapSrc)
        .pipe(plugins.if(!production,gulp.dest(destination)));


    gulp.src(settings.bootstrapStylesSourcemapSrc)
        .pipe(plugins.if(!production,gulp.dest(destination)));

    //Brixx FontAwesome
    gulp.src(settings.fontawesomeStylesSourcemapSrc)
        .pipe(plugins.if(!production,gulp.dest(destination)));


});

gulp.task('modernizr', function(){
    gulp.src('./app/modernizr.js')
        .pipe(gulp.dest(destination));


});

gulp.task('modernizrAddOns', function(){
    gulp.src('./app/modernizr-add-tests.js')
        .pipe(gulp.dest(destination));

});


gulp.task('bootstrapCss', function(){
    gulp.src(settings.bootstrapStylesSrc)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(settings.bootstrapStylesDst));

});

//Custom FontAwesome task for Brixx
gulp.task('fontawesomeCss', function(){
    gulp.src(settings.fontawesomeStylesSrc)
        .pipe(plugins.sourcemaps.init())
        .pipe(plugins.sass())
        .pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(settings.fontawesomeStylesDst));

});

gulp.task('vendorJS', function(){

    var vendorStream = gulp.src(jsVendors);

    vendorStream
        //.pipe(plugins.sourcemaps.init())
        .pipe(plugins.concat(settings.lScriptsDst))
        .pipe(plugins.if(production, plugins.uglify({
            compress:false,
            global_defs: {
                'DEBUG': false
            }
        })))
        //.pipe(plugins.sourcemaps.write('./'))
        .pipe(gulp.dest(destination));
});

gulp.task('vendorCSS', function(){

    //concatenate vendor CSS files
    //wpStream
    return gulp.src(cssVendors)
        .pipe(addsrc(settings.fontawesomeCssSrc))//after all other...for overrides
        .pipe(addsrc(settings.bootstrapCssSrc))//after all other...for overrides
        .pipe(plugins.concat(settings.lStylesDst))
        .pipe(plugins.if(production, plugins.minifyCss()))
        .pipe(gulp.dest(destination));
});




gulp.task('images', function () {
   gulp.src(settings.allImages)
       .pipe(gulp.dest('images'));
});

gulp.task('swfs', function () {
   gulp.src(settings.allSwfs)
       .pipe(gulp.dest(destination));
});


gulp.task('fonts', function () {
   gulp.src(fontsVendors)
       .pipe(gulp.dest('fonts'));
});


gulp.task('watch',function(){
    gulp.watch(settings.stylesVariables,['bootstrapCss', 'vendorCSS']);
    gulp.watch(settings.stylesSrc,['css']);
    gulp.watch(settings.scriptsSrc,['scripts']);
    gulp.watch(settings.allImages,['images']);
    gulp.watch(settings.templatesSrc,['templates']);


});



gulp.task('build', [
    'scripts',
    'templates',
    'css',
    'bootstrapCss',
    'fontawesomeCss',
    'modernizr',
    'modernizrAddOns',
    'vendorJS',
    'vendorCSS',
    'cssSourcemap',
    'images',
    'swfs',
    'fonts'
]);

gulp.task('default', [
    'build',
    'watch'
]);