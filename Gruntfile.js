module.exports = function(grunt) {
	"use strict";
	
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		connect: {
			server: {
				options: {
					port: 9001,
					base: './build/',
					keepalive: true,
					hostname: 'localhost'
				}
			}
		},
		less: {
			main: {
				files: {
					'common/css/main.css': [
						'common/less/main.less'
					]
				},
				options: {
					compress: true,
					sourceMap: true,
					sourceMapFilename: 'common/css/main.css.map',
					sourceMapURL: '/common/css/main.css.map',
					sourceMapRootpath: '/'
				}
			}
		},
		concat : {
			options: {
				separator: grunt.util.linefeed + ';' + grunt.util.linefeed
			},
			js: {
				src: [
					'common/scripts/highlow-main.js'
				],
				dest: 'common/scripts/highlow-main.js'
			}
		},
		liquid: {
			options: {
				includes: 'templates/includes'
			},
			pages: {
				files: [{
					cwd: 'templates/',
					expand: true,
					flatten: false,
					src: ['**/*.liquid', "!includes/**/*.liquid"],
					dest: 'build/',
					ext: '.html'
				}]
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					flatten: false,
					cwd: 'common/',
					src: ['**/*.*'],
					dest: 'build/common/'
				}]
			},
			map: {
				files: [{
					src: ['bower_components/jquery/dist/jquery.min.map'],
					dest: 'build/common/scripts/jquery.min.map'
				}]
			}

		},
		sprite: {
			all: {
				src: ['common/images/sprite-src/*.png'],
				destImg: 'common/images/spritesheet.png',
				destCSS: 'common/less/spritesheet.less',
				algorithm: 'binary-tree',
				padding: 2
			}
		},
		watch: {
			styles: {
				files: ['**/*.less'],
				tasks: ['less'],
				options: {
					nospawn: false,
					livereload: true
				}
			},
			sprite: {
				files: ['common/images/sprite-src/*.*'],
				task: ['sprite','less'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['common/scripts/**/*.js'],
				tasks: ['newer:concat:js'],
				options: {
					livereload: true
				}
			},
			template: {
				files: ['**/*.liquid'],
				tasks: ['liquid'],
				options: {
					livereload: true
				}
			},
			html: {
				files: ['**/*.html'],
				options: {
					livereload: true
				}
			},
			copy: {
				files: ['common/**/*.*','templates/**/*.*'],
				tasks: ['newer:copy']
			}
		},
		concurrent: {
			all: {
				tasks: ['connect:server', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.registerTask('default', ['sprite', 'newer:less', 'newer:concat', 'newer:liquid', 'newer:copy', 'concurrent:all']);
	grunt.registerTask('build', ['sprite', 'newer:less', 'newer:concat', 'newer:liquid', 'newer:copy']);
};