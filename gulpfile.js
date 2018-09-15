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

var replace_install = "/army";

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
    gulp.src("./svg/**/*")
        .pipe(gulp.dest(option.buildPath+"/svg/"));
    gulp.src("./fonts/**/*")
        .pipe(gulp.dest(option.buildPath+"/fonts/"));
    gulp.src("./img/**/*")
        .pipe(gulp.dest(option.buildPath+"/img/"));
    gulp.src("./jump.php")
        .pipe(gulp.dest(option.buildPath+"/"));
    gulp.src("./request.php")
        .pipe(replace(/_INSTALL_PATH_/,replace_install))
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
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/main2.js')
        .pipe(concat('main2.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('main2.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/main3.js')
        .pipe(concat('main3.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('main3.js'))
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
    gulp.src('./js/app.js')
        //.pipe(replace(/_ADMINTOOL_PATH_/,replace_content_admintools_url))
        .pipe(concat('app.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/hcu_util.js')
        .pipe(concat('hcu_util.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('hcu_util.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/login.js')
        .pipe(concat('login.js'))
        // .pipe(gulp.dest('./dist/js'))
        .pipe(rename('login.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/nprogress.js')
        .pipe(concat('nprogress.js'))
        // .pipe(gulp.dest('./dist/js'))
        .pipe(rename('nprogress.js'))
        .pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./js/charts.js')
        .pipe(concat('charts.js'))
        //.pipe(gulp.dest('./dist/js'))
        .pipe(rename('charts.js'))
        //.pipe(uglify())
        .pipe(gulp.dest(option.buildPath+"/js/"));
    gulp.src('./css/index.css')
    // .pipe(concat('Login.css'))
        .pipe(rename('index.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./css/Login.css')
        // .pipe(concat('Login.css'))
        .pipe(rename('Login.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
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
    gulp.src('./css/Reset.css')
        // .pipe(concat('scope.css'))
        .pipe(rename('Reset.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./css/Reset2.css')
        // .pipe(concat('scope.css'))
        .pipe(rename('Reset2.css'))
        .pipe(minifycss())
        .pipe(gulp.dest(option.buildPath+"/css/"));
    gulp.src('./main.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./main2.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./main3.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./left.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./right.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./Login.html')
        .pipe(rename('login.html'))
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./LostPassword.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./scope.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));
    gulp.src('./index.html')
        .pipe(htmlmin(option_html))
        .pipe(gulp.dest(option.buildPath));

});

gulp.task('default',['clean'], function(){
    gulp.run('lint', 'sass', 'scripts','resourcecopy');

});
