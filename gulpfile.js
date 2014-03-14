/* jshint ignore:start */
var gulp = require('gulp')
	, gutil = require('gulp-util')
	, notify = require('gulp-notify')
	, rename = require('gulp-rename')
	, sass = require('gulp-sass')
	, browserify = require('gulp-browserify')
	, uglify = require('gulp-uglify')
	, react = require('gulp-react')
	, reactify = require('reactify')
	, debowerify = require('debowerify')
	, livereload = require('gulp-livereload')
	, livereloadServer = require('tiny-lr')()
	, http = require('http')
	, path = require('path')
	, express = require('express')

	, srcPaths = ['./src/js/**/*.js']
	, scssPaths = ['./src/scss/**/*.scss'];


gulp.task('bowerSelect2', function() {
	gulp.src('./bower_components/select2/select2.css')
	.pipe(gulp.dest('./public/css/select2'));

	gulp.src('./bower_components/select2/select2*.png')
	.pipe(gulp.dest('./public/css/select2'));
});

gulp.task('bowerFontawesome', function() {
	gulp.src('./bower_components/fontawesome/fonts/*')
	.pipe(gulp.dest('./public/fonts'));
});

gulp.task('bower', ['bowerSelect2', 'bowerFontawesome']);


gulp.task('sass', ['bower'], function () {
	gulp.src('./src/scss/app.scss')
		.pipe(sass({
			outputStyle: 'compressed'
		}))
		.pipe(gulp.dest('./public/css'))
		.pipe(livereload(livereloadServer))
		.pipe(notify({
			message: '<%= file.relative %> built'
		}));
});

gulp.task('browserify', function() {
	return gulp.src('./src/js/index.js', { read: false })
		.pipe(browserify({
			debug: !gutil.env.production
			, transform: ['reactify', 'debowerify']
		}))
		.on('prebundle', function(bundle) {
			bundle.require('../../node_modules/moment/lang/de.js', {expose: 'moment-de'});
		})
		.pipe(rename('app.js'))
		.pipe(gulp.dest('public/js'))
		.pipe(livereload(livereloadServer))
		.pipe(notify({
			message: '<%= file.relative %> built'
		}));
});

gulp.task('uglify', ['browserify'], function() {
	return gulp.src('./public/js/app.js')
		.pipe(rename({suffix: '.min'}))
		.pipe(uglify())
		.pipe(gulp.dest('./public/js'))
		.pipe(notify({
			message: '<%= file.relative %> built'
		}));
});

gulp.task('server', function() {
	var port = 8080
		, app = express();

	app.use(express.static(path.join(__dirname, 'public')));

	/*
	if(!gutil.env.production) {
		var srcPath = path.join(__dirname, 'src');

		app.use(srcPath, express.static(srcPath));
		gutil.log(gutil.colors.yellow('Mounted "' + srcPath + '" file for debugging!'));
	}
	*/

	app.listen(port);
});

gulp.task('watch', function() {
	livereloadServer.listen(35729, function(err) {
		if(err) {
			gutil.log(gutil.colors.red('LiveReload Error: ' + err));
		}

		gulp.watch(srcPaths, ['uglify']);
		gulp.watch(scssPaths, ['sass']);
	});
});

gulp.task('default', ['sass', 'uglify', 'server', 'watch']);