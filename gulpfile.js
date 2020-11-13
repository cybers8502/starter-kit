'use strict'

let gulp                = require('gulp');
let gulpif              = require('gulp-if');
let webpack             = require('webpack');
let webpackstream       = require('webpack-stream');
let postcss             = require('gulp-postcss');
let postcssImport       = require('postcss-import');
let autoprefixer        = require('autoprefixer');
let cssnano             = require('cssnano');
let tailwindcss         = require('tailwindcss');
let posthtml            = require('gulp-posthtml');
let posthtmlInclude     = require('posthtml-include');
let posthtmlEach        = require('posthtml-each');
let imagemin            = require("gulp-imagemin");
let svgstore            = require("gulp-svgstore");
let rename              = require('gulp-rename');
let browserSync         = require('browser-sync');
let del                 = require('del');
let TerserPlugin        = require('terser-webpack-plugin');

const destPath = `assets/`;

const paths = {
    views: `app/*.html`,
    include: `app/include/**/*.html`,
    tailwind: [`tailwind.config.js`],
    styles: `app/css/*.pcss`,
    watchScripts: `app/js/**/*.js`,
    scripts: {
        'index': [
            `./app/js/js.main.js`,
        ]
    },
    vendorScripts: `app/js/vendors/**/*.js`,
    images: `app/img/**/*`,
    pictures: `app/pic/**/*`,
    svg: `app/svg/**/*.svg`,
    files: ['fonts', 'php', 'favicon']
};

let env = process.env.NODE_ENV

function clean() {
    return del([ destPath ], {force: true})
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
    return gulp
        .src(paths.views)
        .pipe(posthtml([
            posthtmlInclude({ root: 'app/' }),
            posthtmlEach()
        ], {}))
        .pipe(gulp.dest(destPath));
}

function scripts() {
    return gulp
        .src(paths.watchScripts)
        .pipe(webpackstream({
            mode: process.env.NODE_ENV,
            entry: paths.scripts,
            output: {
                filename: '[name].min.js'
            },
            resolve: {
                extensions: ['.js','.jsx','.css'],
                modules: [
                    './node_modules',
                    './app/js/vendors'
                ],
            },
            module: {
                rules: [
                    {
                        test: /(\.css$)/,
                        loaders: ['style-loader', 'css-loader', 'postcss-loader']
                    },
                    {
                        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
                        loader: 'url-loader?limit=100000'
                    }
                ]
            },
            optimization: {
                minimizer: [
                    new TerserPlugin({
                        cache: true,
                        parallel: true,
                        sourceMap: true
                    }),
                ],
            },
        }, webpack))
        .pipe(gulp.dest(`${ destPath }/js/`))
        .pipe(browserSync.stream())
}

function styles() {

    let plugins = [
        postcssImport,
        tailwindcss('./tailwind.config.js'),
        autoprefixer({
            cascade: false
        }),
    ]

    if ( env === 'production' ){
        plugins.push( cssnano() )
    }

    return gulp
        .src(paths.styles)
        .pipe(postcss(plugins))
        .pipe(rename({ extname: '.css' }))
        .pipe(gulp.dest(`${ destPath }/css`))
}

function vendorScripts() {
    return gulp
        .src(paths.vendorScripts)
        .pipe(gulp.dest(`${ destPath }/js/vendors`) );
}

function images() {
    return gulp
        .src(paths.images)
        .pipe(gulpif(env === 'production', imagemin( {optimizationLevel: 5} )))
        .pipe( gulp.dest(`${ destPath }/img`) );
}

function pictures() {
    return gulp
        .src(paths.pictures)
        .pipe(gulpif(env === 'production', imagemin( {optimizationLevel: 5} )))
        .pipe( gulp.dest(`${ destPath }/pic`) );
}

function svg() {
    return gulp.src("src/svg/*.svg")
        .pipe(svgstore())
        .pipe(gulp.dest(`${ destPath }/svg`))
}

function files(done) {
    for ( let i = 0; i < paths.files.length; i++ ) {
        let src = paths.files[i];
        gulp.src(`app/${src}/**/*`)
            .pipe(gulp.dest(`${ destPath }/${src}`));
    }
    done();
}

function watch() {
    gulp.watch([paths.views, paths.include], views);
    gulp.watch(paths.watchScripts,  scripts);
    gulp.watch([paths.styles, ...paths.tailwind], styles);
    gulp.watch(paths.vendorScripts, vendorScripts);
    gulp.watch(paths.images,        images);
    gulp.watch(paths.pictures,      pictures);
    gulp.watch(paths.svg,           svg);
    gulp.watch(paths.files,         files);
}

const build = gulp.series(clean,
    gulp.parallel(views, scripts, styles, vendorScripts, images, pictures, svg, files), browserSyncInit, watch);

const prod = gulp.series(clean,
    gulp.parallel(views, scripts, styles, vendorScripts, images, pictures, svg, files) );

exports.clean = clean;
exports.views = views;
exports.scripts = scripts;
exports.styles = styles;
exports.vendorScripts = vendorScripts;
exports.images = images;
exports.pictures = pictures;
exports.svg = svg;
exports.files = files;
exports.watch = watch;
exports.build = build;

exports.default = build;
exports.prod = prod;
