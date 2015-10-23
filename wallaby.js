module.exports = function(wallaby) {
	return {
		files: [ 'src/**/*.ts' ],

		tests: [ 'test/**/*.ts' ],
		env: { type: 'node' },
		compilers: { '**/*.ts': wallaby.compilers.typeScript({ module: 1 }) }  // commonjs
	}
};
