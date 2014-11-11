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
					'common/scripts/src/highlow-base.js',
					'common/scripts/src/highlow-*.js'
				],
				dest: 'common/scripts/highlow-main.js'
			}
		},
		liquid: {
			options: {
				includes: 'templates/includes',
				countAll: 0,
				tradingTypes: [
					{
						label: "HighLow",
						id: "highlow",
						range: false,
						default: true,
						instruments: [
							{
								label: "AUD/JPY",
								id: "aud-jpy"
							},
							{
								label:"AUD/USD",
								id: "aud-usd"
							},
							{
								label:"EUR/JPY",
								id: "eur-jpy"
							},
							{
								label:"EUR/USD",
								id: "eur-usd"
							},
							{
								label:"GBP/JPY",
								id: "gbp-jpy"
							},
							{
								label:"GBP/USD",
								id: "gbp-usd"
							},
							{
								label:"NZD/JPY",
								id: "nzd-jpy"
							},
							{
								label:"NZD/USD",
								id: "nzd-usd"
							},
							{
								label:"USD/JPY",
								id: "usd-jpy"
							}
						],
						intervals: [
							{
								id: "15min",
								label: "15 MIN",
								value: 15*60*1000,
								shortLabel: "15m",
								mediumLabel: "15 mins",
								instruments: [
									{
										label: "AUD/JPY",
										id: "aud-jpy",
										payout: "1.80",
										rate: "102.44"
									},
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "112.44"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.75",
										rate: "92.74"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.75",
										rate: "102.56"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "112.44"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.75",
										rate: "82.54"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.75",
										rate: "122.78"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "123.12"
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "122.44"
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.75",
										rate: "111.56"
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "114.76"
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.75",
										rate: "118.62"
									}
								]
							},
							{
								id: "1hour",
								label: "1 HOUR",
								mediumLabel: "60 mins",
								value: 60*60*1000,
								shortLabel: "1h",
								instruments: [
									{
										label: "AUD/JPY",
										id: "aud-jpy",
										payout: "1.85",
										rate: "113.56"
									},
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.85",
										rate: "115.22"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.85",
										rate: "127.12"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "98.64"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.85",
										rate: "97.35"
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.85",
										rate: "97.45"
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "94.24"
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.85",
										rate: "111.56"
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "114.45"
									}
								]
							},
							{
								id: "1day",
								label: "1 DAY",
								mediumLabel: "24 hours",
								value: 24*60*60*1000,
								shortLabel: "24h",
								instruments: [
									{
										label: "AUD/JPY",
										id: "aud-jpy",
										payout: "1.85",
										rate: "113.56"
									},
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.85",
										rate: "115.22"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.85",
										rate: "127.12"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "98.64"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.85",
										rate: "97.35"
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.85",
										rate: "97.45"
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "94.24"
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.85",
										rate: "111.56"
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "114.45"
									}
								]
							}
						]
					},{
						label: "Spread HighLow",
						id: "spread",
						range: 0.005,
						default: false,
						instruments: [
							{
								label: "AUD/JPY",
								id: "aud-jpy"
							},
							{
								label:"AUD/USD",
								id: "aud-usd"
							},
							{
								label:"EUR/JPY",
								id: "eur-jpy"
							},
							{
								label:"EUR/USD",
								id: "eur-usd"
							},
							{
								label:"GBP/JPY",
								id: "gbp-jpy"
							},
							{
								label:"GBP/USD",
								id: "gbp-usd"
							},
							{
								label:"NZD/JPY",
								id: "nzd-jpy"
							},
							{
								label:"NZD/USD",
								id: "nzd-usd"
							},
							{
								label:"USD/JPY",
								id: "usd-jpy"
							}
						],
						intervals: [
							{
								id: "15min",
								label: "15 MIN",
								value: 15*60*1000,
								shortLabel: "15m",
								mediumLabel: "15 mins",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "2.00",
										rate: "115.45"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "98.442"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "111.24"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "224.86"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "123.54"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "167.27"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "145.15"
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "2.00",
										rate: "165.52"
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "2.00",
										rate: "135.59"
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "2.00",
										rate: "115.54"
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "2.00",
										rate: "112.43"
									}
								]
							},
							{
								id: "1hour",
								label: "1 HOUR",
								mediumLabel: "60 mins",
								value: 60*60*1000,
								shortLabel: "1h",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "2.00",
										rate: "115.45"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "98.442"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "111.24"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "224.86"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "123.54"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "167.27"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "145.15"
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "2.00",
										rate: "165.52"
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "2.00",
										rate: "135.59"
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "2.00",
										rate: "115.54"
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "2.00",
										rate: "112.43"
									}
								]
							},
							{
								id: "1day",
								label: "1 DAY",
								mediumLabel: "24 hours",
								value: 24*60*60*1000,
								shortLabel: "24h",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "2.00",
										rate: "115.45"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "98.442"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "111.24"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "224.86"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "123.54"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "167.27"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "145.15"
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "2.00",
										rate: "165.52"
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "2.00",
										rate: "135.59"
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "2.00",
										rate: "115.54"
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "2.00",
										rate: "112.43"
									}
								]
							}
						]
					},{
						label: "On Demand",
						id: "on-demand",
						default: false,
						range: false,
						instruments: [
							{
								label: "AUD/JPY",
								id: "aud-jpy"
							},
							{
								label:"AUD/USD",
								id: "aud-usd"
							},
							{
								label:"EUR/JPY",
								id: "eur-jpy"
							},
							{
								label:"EUR/USD",
								id: "eur-usd"
							},
							{
								label:"GBP/JPY",
								id: "gbp-jpy"
							},
							{
								label:"GBP/USD",
								id: "gbp-usd"
							},
							{
								label:"NZD/JPY",
								id: "nzd-jpy"
							},
							{
								label:"NZD/USD",
								id: "nzd-usd"
							},
							{
								label:"USD/JPY",
								id: "usd-jpy"
							}
						],
						intervals: [
							{
								id: "3min",
								label: "",
								value: 3*60*1000,
								shortLabel: "3m",
								mediumLabel: "3 mins",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "115.45"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "98.442"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "111.24"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "224.86"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "123.54"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "167.27"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "145.15"
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "165.52"
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "135.59"
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "115.54"
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "112.43"
									}
								]
							}
						]
					}
					,{
						label: "Spread On Demand",
						id: "spread-on-demand",
						default: false,
						range: false,
						instruments: [
							{
								label: "AUD/JPY",
								id: "aud-jpy"
							},
							{
								label:"AUD/USD",
								id: "aud-usd"
							},
							{
								label:"EUR/JPY",
								id: "eur-jpy"
							},
							{
								label:"EUR/USD",
								id: "eur-usd"
							},
							{
								label:"GBP/JPY",
								id: "gbp-jpy"
							},
							{
								label:"GBP/USD",
								id: "gbp-usd"
							},
							{
								label:"NZD/JPY",
								id: "nzd-jpy"
							},
							{
								label:"NZD/USD",
								id: "nzd-usd"
							},
							{
								label:"USD/JPY",
								id: "usd-jpy"
							}
						],
						intervals: [
							{
								id: "3min",
								label: "",
								value: 3*60*1000,
								shortLabel: "3m",
								mediumLabel: "3 mins",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "115.45"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "98.442"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "111.24"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "224.86"
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "123.54"
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "167.27"
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "145.15"
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "165.52"
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "135.59"
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "115.54"
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "112.43"
									}
								]
							}
						]
					}
				]
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
			integrateInToPublic: {
				files: [{
					expand: true,
					flatten: false,
					cwd: 'common/',
					src: ['**/*.*'],
					dest: '../public-page/public/trade-platform/'
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
		replace: {
		  jsURL: {
		    src: ['../public-page/public/trade-platform/scripts/highlow-main.js'],
		    overwrite: true,                 // overwrite matched source files
		    replacements: [{
		      from: 'common/images',		      
		      to: "public/trade-platform/images"
		    }]
		  }
		},
		'copy-part-of-file': {
			copyPlatform: {
			  options: {
			      sourceFileStartPattern: '<!-- start-platform -->',
			      sourceFileEndPattern: '<!-- end-platform -->',
			      destinationFileStartPattern: '<!-- start-platform -->',
			      destinationFileEndPattern: '<!-- end-platform -->'
			  },	
			  files: {
			      '../public-page/templates/trade-platform.liquid': ['build/index.html']
			  }
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
				task: ['sprite','less','copy'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['common/scripts/**/*.js'],
				tasks: ['newer:concat:js','replace'],
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
				tasks: ['newer:copy','copy-part-of-file']
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

	grunt.registerTask('default', ['sprite', 'newer:less', 'newer:concat', 'newer:liquid', 'newer:copy', 'replace','copy-part-of-file','concurrent:all']);
	grunt.registerTask('build', ['sprite', 'newer:less', 'newer:concat', 'newer:liquid', 'newer:copy', 'replace','copy-part-of-file']);
};