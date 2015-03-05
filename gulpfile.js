var gulp 		= require('gulp'),
	package		= require('./package.json'),
	tap 		= require('gulp-tap'),
	concat = require('gulp-concat'),
	webserver = require('gulp-webserver'),
	rename		= require('gulp-rename'),
	clean		= require('gulp-clean'),
	browserify	= require('browserify'),
	handlebars 	= require('handlebars'),
	uglify = require('gulp-uglify'),
	sourcemaps = require('gulp-sourcemaps'),
	less = require('gulp-less'),
	buffer = require('vinyl-buffer'),
	transform 	= require('vinyl-transform'),
	source = require('vinyl-source-stream');


var path = {
	tmpl: './src/tmpl/**/*.hbs',
	style: ['./src/style/**/*.less'],
	js: './src/js/**/*.js',
	index: './src/index.hbs'
}

gulp.task('js', function() {
	var bundler = browserify({
		entries: ['./src/js/app.js'],
		debug: true
	});

	var bundle = function() {
		return bundler
			.bundle()
			.pipe(source('app.js'))
			.pipe(buffer())
			.pipe(sourcemaps.init({loadMaps: true}))
			.pipe(uglify())
			.pipe(sourcemaps.write('./'))
			.pipe(gulp.dest('./build/js/'));
	};
	return bundle();
});

gulp.task('style', function() {
	return gulp.src(path.style)
		.pipe(less({
	      paths: [ './node_modules/bootstrap/less' ]
	    }))
    .pipe(gulp.dest('./build/style'));

});

gulp.task('index', function() {
  return gulp.src(path.index)
    .pipe(tap(function(file, t) {
		var template = handlebars.compile(file.contents.toString())
		var html = template(package)
		file.contents = new Buffer(html, "utf-8")
    }))
    .pipe(rename(function(path) {
		path.extname = ".html"
    }))
    .pipe(gulp.dest("build/"))
});

gulp.task('webserver', function() {
	return gulp.src('build')
		.pipe(webserver({
		livereload: true,
		open: true
	}));
});


gulp.task('clean', function() {
	return gulp.src('./build')
		.pipe(clean());
});

gulp.task('build', ['js', 'style','index']);

gulp.task('watch', ['build'], function() {
	gulp.watch([path.js, path.tmpl], ['js']);
	gulp.watch(path.style, ['style']);
	gulp.watch(path.index, ['index']);
});

gulp.task('develop', ['watch', 'webserver']);

gulp.task('default', ['build']);
