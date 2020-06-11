let gulp                = require('gulp');
let sass                = require('gulp-sass');
let babel               = require('gulp-babel');
let concat              = require('gulp-concat');
let uglify              = require('gulp-uglify');
let autoprefixer        = require('gulp-autoprefixer');
let rename              = require('gulp-rename');
let cleanCSS            = require('gulp-clean-css');
let browserSync         = require('browser-sync');
let sourcemaps          = require('gulp-sourcemaps');
let posthtml            = require('gulp-posthtml');
let posthtmlInclude     = require('posthtml-include');
let posthtmlEach        = require('posthtml-each');
let del                 = require('del');

const destPath = `assets/`;

const paths = {
    views: 'app/*.html',
    include: 'app/include/**/*.html',
    styles: 'app/sass/**/*.scss',
    vendorStyles: 'app/css/**/*.css',
    watchScripts: 'app/js/**/*.js',
    scripts: [
        {
            name: 'index',
            contains: [
                'app/js/jquery.index.js',
                'app/js/jquery.main.js',
            ]
        }
    ],
    vendorScripts: 'app/js/vendors/**/*.js',
    images: 'app/img/**/*',
    pictures: 'app/pic/**/*',
    fonts: 'app/fonts/**/*',
    php: 'app/php/**/*',
    favicon: 'app/favicon/**/*'
};

function clean() {
    return del([ destPath ])
}

function browserSyncInit(done) {
    browserSync.init({
        server: {
            baseDir: destPath
        },
        port: 3010,
        open: true,
        notify: false
    });
    done();
}

function views() {
    return gulp.src(paths.views)
        .pipe(posthtml([
            posthtmlInclude({ root: 'app/' }),
            posthtmlEach()
        ], {}))
        .pipe(gulp.dest(destPath));
}

function scripts(done) {
    for ( let i = 0; i < paths.scripts.length; i++ ) {
        gulp.src( paths.scripts[i].contains, { sourcemaps: true } )
            .pipe(sourcemaps.init())
            .pipe(babel())
            .pipe(uglify())
            .pipe(concat(paths.scripts[i].name))
            .pipe(rename({ extname: '.min.js' }))
            .pipe(sourcemaps.write('./maps'))
            .pipe(gulp.dest(`${ destPath }/js/`))
            .pipe(browserSync.stream())
    }
    done();
}

function styles() {
    return gulp.src(paths.styles)
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'})
            .on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(cleanCSS())
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(`${ destPath }/css`))
}

function vendorScripts() {
    return gulp.src(paths.vendorScripts)
        .pipe(gulp.dest(`${ destPath }/js/vendors`) );
}

function vendorStyles() {
    return gulp.src(paths.vendorStyles)
        .pipe(gulp.dest(`${ destPath }/css`) );
}

function images() {
    return gulp.src(paths.images)
        // .pipe( imagemin( {optimizationLevel: 5} ) )
        .pipe( gulp.dest(`${ destPath }/img`) );
}

function pictures() {
    return gulp.src(paths.pictures)
        // .pipe( imagemin( {optimizationLevel: 5} ) )
        .pipe( gulp.dest(`${ destPath }/pic`) );
}

function fonts() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(`${ destPath }/fonts`));
}

function php() {
    return gulp.src(paths.php)
        .pipe(gulp.dest(`${ destPath }/php`));
}

function favicon() {
    return gulp.src(paths.favicon)
        .pipe(gulp.dest(`${ destPath }/favicon`));
}

function watch() {
    gulp.watch([paths.views, paths.include], views);
    gulp.watch(paths.watchScripts,  scripts);
    gulp.watch(paths.styles,        styles);
    gulp.watch(paths.vendorScripts, vendorScripts);
    gulp.watch(paths.vendorStyles,  vendorStyles);
    gulp.watch(paths.images,        images);
    gulp.watch(paths.pictures,      pictures);
    gulp.watch(paths.php,           php);
}

const build = gulp.series(clean, gulp.parallel(views, scripts, styles, vendorScripts, vendorStyles, images, pictures, fonts, php, favicon), browserSyncInit, watch);

exports.clean = clean;
exports.views = views;
exports.scripts = scripts;
exports.styles = styles;
exports.vendorScripts = vendorScripts;
exports.vendorStyles = vendorStyles;
exports.images = images;
exports.pictures = pictures;
exports.fonts = fonts;
exports.php = php;
exports.favicon = favicon;
exports.watch = watch;
exports.build = build;

exports.default = build;