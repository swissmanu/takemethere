var gulp = require('gulp')
	, gutil = require('gulp-util')
	//, sass = require('gulp-sass')
	, react = require('gulp-react')
	, livereload = require('gulp-livereload')
	, http = require('http')
	, path = require('path')
	, ecstatic = require('ecstatic');

/*gulp.task('styles', function () {
	return gulp.src('./src/scss/main.scss')
		.pipe(sass())
		.pipe(gulp.dest('./dist/css'));
});*/

gulp.task('react', function() {
    gulp.src('./src/*.jsx')
        .pipe(react())
        .pipe(gulp.dest('build'));
});

gulp.task('default', function() {
	http.createServer(ecstatic({
		root: __dirname
	})).listen(8080);

	gutil.log(gutil.colors.blue('HTTP server listening on port 8080'));



	var livereloadServer = livereload();

	gulp.watch('index.html').on('change', function(file) {
		livereloadServer.changed(file.path);
	});

	//gulp.watch('index.html', [])._watcher.on('all', livereload);
	//gulp.watch('src/*.jsx', ['react'])._watcher.on('all', livereload);

	//gulp.watch('src/scss/**', ['styles'])._watcher.on('all', livereload);
});