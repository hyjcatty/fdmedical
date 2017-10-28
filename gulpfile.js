/**
 * Created by hyj on 2016/7/25.
 */
var gulp=require('gulp');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var minifycss = require("gulp-minify-css");
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var htmlmin = require('gulp-htmlmin');
var replace = require('gulp-replace');
var mkdirp = require('mkdirp');



var option = {
    buildPath: "../www/army"
}
var option_html = {
    collapseWhitespace:true,
    collapseBooleanAttributes:true,
    removeComments:true,
    removeEmptyAttributes:true,
    removeStyleLinkTypeAttributes:true,
    minifyJS:true,
    minifyCSS:true
};


gulp.task('lint', function() {
    gulp.src('./js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});
gulp.task('clean',function(){
    return gulp.src(option.buildPath,{
        read:false
    }).pipe(clean({force:true}));
});

gulp.task('sass', function() {
    gulp.src('./scss/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});
gulp.task("resourcecopy",function(){
    gulp.src("./resource/**/*")
        .pipe(gulp.dest(option.buildPath+"/resource/"));
    gulp.src("./image/**/*")
        .pipe(gulp.dest(option.buildPath+"/image/"));
    gulp.src("./request.php")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./*.ico")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./*.js")
        .pipe(gulp.dest(option.buildPath+"/"));
});

gulp.task('scripts', function() {
    gulp.src('./js/global.js')
        .pipe(concat('global.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('global.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/main.js')
        .pipe(concat('main.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('main.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/left.js')
        .pipe(concat('left.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('left.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/right.js')
        .pipe(concat('right.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('right.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));

    gulp.src('./css/nprogress.css')
        // .pipe(concat('nprogress.css'))
        .pipe(rename('nprogress.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./css/scope.css')
        // .pipe(concat('scope.css'))
        .pipe(rename('scope.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./css/style.css')
        // .pipe(concat('scope.css'))
        .pipe(rename('style.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));

    gulp.src('./main.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./left.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./right.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));

});

gulp.task('default',['clean'], function(){
    gulp.run('lint', 'sass', 'scripts','resourcecopy');

});
