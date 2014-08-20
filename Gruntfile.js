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
					'common/dist/main.css': [
						'common/styles/main.less'
					]
				},
				options: {
					compress: true,
					sourceMap: true,
					sourceMapFilename: 'common/dist/main.css.map',
					sourceMapURL: '/common/dist/main.css.map',
					sourceMapRootpath: '/'
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					generateSourceMaps: true,
					logLevel: 4,
					baseUrl: "common/scripts/",
					include: './main',
					out: "common/dist/main.js",
					preserveLicenseComments: false,
					optimize: 'uglify2',
					mainConfigFile: 'common/scripts/main.js'
				}
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
			}
		},
		sprite: {
			all: {
				src: ['common/images/sprite-src/*.png'],
				destImg: 'common/images/spritesheet.png',
				destCSS: 'common/styles/spritesheet.less',
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
				task: ['sprite'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['common/scripts/'],
				tasks: ['newer:requirejs'],
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
				files: ['common/**/*.*'],
				tasks: ['newer:copy']
			}
		},
		concurrent: {
			all: {
				tasks: ['newer:requirejs', 'connect:server', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		}
	});

	grunt.registerTask('default', ['sprite', 'newer:less', 'newer:liquid', 'newer:copy', 'concurrent:all']);
	grunt.registerTask('build', ['sprite', 'newer:less', 'newer:requirejs', 'newer:liquid', 'newer:copy']);
};