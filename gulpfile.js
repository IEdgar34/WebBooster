const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const autoprefixer = require("gulp-autoprefixer");
const concat = require("gulp-concat");
const browserSync = require("browser-sync").create();
const clean = require("gulp-clean");
/* const uglifyes = require("gulp-uglifyes"); */

function buildStyles() {
    return gulp
        .src("src/sass/**/*.+(sass|scss)")
        .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
        .pipe(autoprefixer({ overrideBrowserslist: ["last 3 version"] }))
        .pipe(concat("style.min.css"))
        .pipe(browserSync.stream())
        .pipe(gulp.dest("src/css"));
}
function script() {
    return (
        gulp
            .src("src/js/**/*.js")
            .pipe(browserSync.stream())
            /* .pipe(uglifyes()) */
            .pipe(concat("index.min.js"))
            .pipe(gulp.dest("src/js"))
    );
}

function server() {
    browserSync.init({
        server: {
            baseDir: "src",
        },
    });
}
function watching() {
    gulp.watch(["src/sass"], buildStyles);
    gulp.watch(["src/js/index.js"], script);
    gulp.watch(["src/**/*.html"]).on("change", browserSync.reload);
}

exports.buildStyles = buildStyles;
exports.script = script;
exports.server = server;
exports.watching = watching;

function cleanDist() {
    return gulp.src("dist").pipe(clean());
}
function building() {
    return gulp
        .src(["src/css/**/*.css", "src/js/index.min.js", "src/**/*.html"], { base: "src" })
        .pipe(gulp.dest("dist"));
}

exports.default = gulp.parallel(buildStyles, script, server, watching);
exports.build = gulp.series(cleanDist, building);
