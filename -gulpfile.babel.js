//npm install --save-dev @babel/register @babel/core @babel/preset-env

import gulp from 'gulp';
import sass from 'gulp-sass';
import babel from 'gulp-babel';
import concat from 'gulp-concat';
import uglify from 'gulp-uglify';
import autoprefixer from 'gulp-autoprefixer';
import rename from 'gulp-rename';
import cleanCSS from 'gulp-clean-css';
import browserSync from 'browser-sync';
import sourcemaps from 'gulp-sourcemaps';
import posthtml from 'gulp-posthtml';
import posthtmlInclude from 'posthtml-include';
import posthtmlEach from 'posthtml-each';
import del from 'del';

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

export const clean = () => del([ destPath ]);

export function browserSyncInit(done) {
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

export function views() {
    return gulp.src(paths.views)
        .pipe(posthtml([
            posthtmlInclude({ root: 'app/' }),
            posthtmlEach()
        ], {}))
        .pipe(gulp.dest(destPath))
}

export function scripts(done) {
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

export function styles() {
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

export function vendorScripts() {
    return gulp.src(paths.vendorScripts )
        .pipe(gulp.dest(`${ destPath }/js/vendors`) );
}

export function vendorStyles() {
    return gulp.src(paths.vendorStyles )
        .pipe(gulp.dest(`${ destPath }/css`) );
}

export function images() {
    return gulp.src(paths.images)
        // .pipe( imagemin( {optimizationLevel: 5} ) )
        .pipe( gulp.dest(`${ destPath }/img`) );
}

export function pictures() {
    return gulp.src(paths.pictures)
        // .pipe( imagemin( {optimizationLevel: 5} ) )
        .pipe( gulp.dest(`${ destPath }/pic`) );
}

export function fonts() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest(`${ destPath }/fonts`));
}

export function php() {
    return gulp.src(paths.php)
        .pipe(gulp.dest(`${ destPath }/php`));
}

export function favicon() {
    return gulp.src(paths.favicon)
        .pipe(gulp.dest(`${ destPath }/favicon`));
}

function watchFiles() {
    gulp.watch([paths.views, paths.include], views);
    gulp.watch(paths.watchScripts,  scripts);
    gulp.watch(paths.styles,        styles);
    gulp.watch(paths.vendorScripts, vendorScripts);
    gulp.watch(paths.vendorStyles,  vendorStyles);
    gulp.watch(paths.images,        images);
    gulp.watch(paths.pictures,      pictures);
    gulp.watch(paths.php,           php);
}
export { watchFiles as watch };

const build = gulp.series(clean, gulp.parallel(views, styles, scripts, vendorScripts, vendorStyles, images, pictures, fonts, php, favicon), browserSyncInit, watchFiles);

export default build;