// Konfigurasi
var gulp  = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var reload = browserSync.reload;
var plumber = require('gulp-plumber');
var notify = require('gulp-notify');
var merge = require('merge-stream');
var clean = require('gulp-clean');
var cssnano = require('gulp-cssnano');
var concat = require('gulp-concat');
var minify = require('gulp-minify');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var fileinclude = require('gulp-file-include');

const vendorpath = 'node_modules/';



// Compile SCSS
gulp.task('sass', function () {
  return gulp.src('./app/scss/**/*.scss')
    //.pipe(sass().on('error', sass.logError))
    .pipe(plumber({
    	errorHandler:function(err){
    		 notify.onError({
    		 	title : "Gulp error in " + err.plugin,
    		 	message : err.toString()
    		 	})(err)
    	}
    	}))
    .pipe(sass())
    .pipe(plumber.stop())
    .pipe(gulp.dest('./app/css'))
    .pipe(gulp.dest('./.tmp/css'))
    .pipe(reload({stream: true}));
});

// Clean Build Directory
gulp.task('cleanBuild',function(){
     return gulp.src('build', {read: false})
     .pipe(clean());
});

gulp.task('cssOptimize',['sass'],function(){
    return gulp.src('app/css/*.css')
    .pipe(cssnano())
    //  .pipe(gutil.log('css Optimize Finish'))
    .pipe(gulp.dest('.tmp/css/'));
});

gulp.task('jsOptimize', function(){
    return gulp.src([
        vendorpath + 'jquery/dist/jquery.js',
        vendorpath + 'jquery-nice-select/js/jquery.nice-select.js',
        vendorpath + 'datatables.net/js/jquery.dataTables.js',
        vendorpath + 'datatables.net-bs4/js/dataTables.bootstrap4.js',
        
        vendorpath + 'slick-carousel/slick/slick.js',
        'app/js/main.js'
    ])
    .pipe(concat('all.js'))
    .pipe(minify())
    .pipe(gulp.dest('.tmp/js'));
});

gulp.task('imgOptimize', function(){
    return gulp.src('app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))
    .pipe(gulp.dest('.tmp/images'))
});

gulp.task('fonts', function(){
    return gulp.src('app/fonts/**')
    .pipe(gulp.dest('.tmp/fonts'));
});

gulp.task('fileinclude', function () { 
    return gulp.src(['app/**/*.html'])
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
        // basepath: 'app/'
    }))

    .pipe(gulp.dest('.tmp'));
});


// Watch files for changes & reload
gulp.task('serve',['cssOptimize', 'fileinclude', 'jsOptimize', 'sass', 'fonts'], function(){

    browserSync.init({
    server: ['.tmp', 'app'],
        port: 3000
    });

    gulp.watch('./app/scss/**/*.scss',['sass', reload]);
    gulp.watch(['app/js/**/*.js'], ['jsOptimize', reload]);
    gulp.watch(['app/**/*.html'], ['fileinclude', reload]);

});


// Deploy to Build Directory
gulp.task('deploy',['cleanBuild'], function(){

// optimasi css
    var cssOptimize = gulp.src('app/css/*.css')
    .pipe(cssnano())
    //  .pipe(gutil.log('css Optimize Finish'))
    .pipe(gulp.dest('build/css/'));
        

// menggabung semua file js dan optimasi
    var jsOptimize = gulp.src([
        vendorpath + 'jquery/dist/jquery.js',
        vendorpath + 'slick-carousel/slick/slick.js',
        vendorpath + 'datatables.net/js/jquery.dataTables.js',
        vendorpath + 'datatables.net-bs4/js/dataTables.bootstrap4.js',
        vendorpath + 'jquery-nice-select/js/jquery.nice-select.js',
        'app/js/main.js'
    ])
    .pipe(concat('all.js'))
    .pipe(minify())
    .pipe(gulp.dest('build/js'));
    // optimasi image
    var imgOptimize = gulp.src('app/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/images'))

    // fonts folder
    var fonts= gulp.src('app/fonts/**')
    .pipe(gulp.dest('build/fonts'));

    var html= gulp.src(['app/**/*.html'])
    .pipe(fileinclude({
    prefix: '@@',
    basepath: '@file'
    // basepath: 'app/'
    }))

    .pipe(gulp.dest('build'));

return merge(cssOptimize,jsOptimize,imgOptimize,fonts, html); 

});
    



