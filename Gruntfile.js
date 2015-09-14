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
						jaLabel: "HighLow",
						id: "highlow",
						range: false,
						default: true,
						instruments: [
							{
								label:"USD/JPY",
								id: "usd-jpy"
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
								label: "AUD/JPY",
								id: "aud-jpy"
							}
						],
						intervals: [
							{
								id: "15min",
								label: "15 MIN",
								jaLabel: "15<span class='jap-word'>分</span>",
								value: 15*60*1000,
								shortLabel: "15m",
								jaShortLabel: "15<span class='jap-word'>分</span>",
								mediumLabel: "15 mins",
								instruments: [
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "2.00",
										rate: "118.62",
										pip: 3
									},
									{
										label: "AUD/JPY",
										id: "aud-jpy",
										payout: "1.80",
										rate: "92.439",
										pip: 3
									},
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.75",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.75",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "112.44",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.75",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.75",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "123.12",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "122.44",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.75",
										rate: "111.56",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "114.76",
										pip: 3
									}
								]
							},
							{
								id: "1hour",
								label: "1 HOUR",
								jaLabel: "1<span class='jap-word'>時間</span>",
								mediumLabel: "60 mins",
								value: 60*60*1000,
								shortLabel: "1h",
								jaShortLabel: "1<span class='jap-word'>時間</span>",
								instruments: [
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "114.45",
										pip: 3
									},
									{
										label: "AUD/JPY",
										id: "aud-jpy",
										payout: "1.85",
										rate: "92.439",
										pip: 3
									},
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.85",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.85",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.85",
										rate: "97.35",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.85",
										rate: "97.45",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "94.24",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.85",
										rate: "111.56",
										pip: 3
									}
								]
							},
							{
								id: "1day",
								label: "1 DAY",
								jaLabel: "1<span class='jap-word'>日</span>",
								mediumLabel: "24 hours",
								value: 24*60*60*1000,
								shortLabel: "24h",
								jaShortLabel: "24<span class='jap-word'>時間</span>",
								instruments: [
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "114.45",
										pip: 3
									},
									{
										label: "AUD/JPY",
										id: "aud-jpy",
										payout: "1.85",
										rate: "92.439",
										pip: 3
									},
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.85",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.85",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.85",
										rate: "97.35",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.85",
										rate: "97.45",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "94.24",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.85",
										rate: "111.56",
										pip: 3
									}
								]
							}
						]
					},{
						label: "HighLow Spread",
						jaLabel: "HighLow <span class='tab-graphic-text'><img class='default' src='public/trade-platform/images/spread-tab.png' alt='スプレッド'/><img class='hover' src='public/trade-platform/images/spread-tab-hover.png' alt='スプレッド'/></span>",
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
								jaLabel: "15<span class='jap-word'>分</span>",
								value: 15*60*1000,
								shortLabel: "15m",
								jaShortLabel: "15<span class='jap-word'>分</span>",
								mediumLabel: "15 mins",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "2.00",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "2.00",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "2.00",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "2.00",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "2.00",
										rate: "112.43",
										pip: 3
									}
								]
							},
							{
								id: "1hour",
								label: "1 HOUR",
								jaLabel: "1<span class='jap-word'>時間</span>",
								mediumLabel: "60 mins",
								value: 60*60*1000,
								shortLabel: "1h",
								jaShortLabel: "1<span class='jap-word'>時間</span>",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "2.00",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "2.00",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "2.00",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "2.00",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "2.00",
										rate: "112.43",
										pip: 3
									}
								]
							},
							{
								id: "1day",
								label: "1 DAY",
								jaLabel: "1<span class='jap-word'>日</span>",
								mediumLabel: "24 hours",
								value: 24*60*60*1000,
								shortLabel: "24h",
								jaShortLabel: "24<span class='jap-word'>時間</span>",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "2.00",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "2.00",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "2.00",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "2.00",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "2.00",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "2.00",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "2.00",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "2.00",
										rate: "112.43",
										pip: 3
									}
								]
							}
						]
					},{
						label: "Turbo",
						jaLabel: "Turbo",
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
								id: "1min",
								label: "1 MIN",
								jaLabel: "1<span class='jap-word'>分</span>",
								value: 1*60*1000,
								shortLabel: "1m",
								jaShortLabel: "1<span class='jap-word'>分</span>",
								mediumLabel: "1 min",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "112.43",
										pip: 3
									}
								]
							},
							{
								id: "3min",
								label: "3 MIN",
								jaLabel: "3<span class='jap-word'>分</span>",
								value: 3*60*1000,
								shortLabel: "3m",
								jaShortLabel: "3<span class='jap-word'>分</span>",
								mediumLabel: "3 min",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "112.43",
										pip: 3
									}
								]
							},
							{
								id: "5min",
								label: "5 MIN",
								jaLabel: "5<span class='jap-word'>分</span>",
								value: 5*60*1000,
								shortLabel: "5m",
								jaShortLabel: "5<span class='jap-word'>分</span>",
								mediumLabel: "5 min",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "112.43",
										pip: 3
									}
								]
							}
						]
					},{
						label: "Turbo Spread",
						jaLabel: "Turbo <span class='tab-graphic-text'><img class='default' src='public/trade-platform/images/spread-tab.png' alt='スプレッド'/><img class='hover' src='public/trade-platform/images/spread-tab-hover.png' alt='スプレッド'/></span>",
						id: "spread-on-demand",
						default: false,
						range: 0.005,
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
								id: "1min",
								label: "1 MIN",
								jaLabel: "1<span class='jap-word'>分</span>",
								value: 1*60*1000,
								shortLabel: "1m",
								jaShortLabel: "1<span class='jap-word'>分</span>",
								mediumLabel: "1 min",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "112.43",
										pip: 3
									}
								]
							},
							{
								id: "3min",
								label: "3 MIN",
								jaLabel: "3<span class='jap-word'>分</span>",
								value: 3*60*1000,
								shortLabel: "3m",
								jaShortLabel: "3<span class='jap-word'>分</span>",
								mediumLabel: "3 min",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "112.43",
										pip: 3
									}
								]
							},
							{
								id: "5min",
								label: "5 MIN",
								jaLabel: "5<span class='jap-word'>分</span>",
								value: 5*60*1000,
								shortLabel: "5m",
								jaShortLabel: "5<span class='jap-word'>分</span>",
								mediumLabel: "5 min",
								instruments: [
									{
										label:"AUD/USD",
										id: "aud-usd",
										payout: "1.80",
										rate: "0.75441",
										pip: 5
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "224.86",
										pip: 3
									},
									{
										label:"EUR/JPY",
										id: "eur-jpy",
										payout: "1.80",
										rate: "135.740",
										pip: 3
									},
									{
										label:"EUR/USD",
										id: "eur-usd",
										payout: "1.80",
										rate: "1.12560",
										pip: 5
									},
									{
										label:"GBP/JPY",
										id: "gbp-jpy",
										payout: "1.80",
										rate: "145.15",
										pip: 3
									},
									{
										label:"GBP/USD",
										id: "gbp-usd",
										payout: "1.80",
										rate: "165.52",
										pip: 3
									},
									{
										label:"NZD/JPY",
										id: "nzd-jpy",
										payout: "1.80",
										rate: "135.59",
										pip: 3
									},
									{
										label:"NZD/USD",
										id: "nzd-usd",
										payout: "1.80",
										rate: "115.54",
										pip: 3
									},
									{
										label:"USD/JPY",
										id: "usd-jpy",
										payout: "1.80",
										rate: "112.43",
										pip: 3
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
					dest: '../highlow-public-page/public/trade-platform/'
				}]
			},
			integrateInToNewSite: {
				files: [{
					expand: true,
					flatten: false,
					cwd: 'common/',
					src: ['**/*.*'],
					dest: '../hl-my-account/common/trade-platform/'
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
		    src: ['../highlow-public-page/public/trade-platform/scripts/highlow-main.js'],
		    overwrite: true,                 // overwrite matched source files
		    replacements: [{
		      from: 'common/images',		      
		      to: "public/trade-platform/images"
		    }]
		  },
		  jsURLNewSite: {
		    src: ['../hl-my-account/common/trade-platform/scripts/highlow-main.js'],
		    overwrite: true,                 // overwrite matched source files
		    replacements: [{
		      from: "'common/images/",		      
		      to: "platformAssetUrl+'"
		    },{
		    	from: '"common/images/',
		    	to: 'platformAssetUrl+"'
		    },{
		    	from: '"url(common/images/',
		    	to: '"url("+platformAssetUrl+"'
		    }]
		  },
		  htmlURLNewSite: {
		    src: [
		    	'../hl-my-account/templates/includes/trade-platform.liquid',
		    	'../hl-my-account/templates/includes/ja-trade-platform.liquid'
		    ],
		    overwrite: true,                 // overwrite matched source files
		    replacements: [{
		      from: 'public/trade-platform/images/',		      
		      to: 'common/trade-platform/images/'
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
			      '../highlow-public-page/templates/includes/platform.liquid': ['build/index.html'],
			      '../highlow-public-page/templates/includes/ja-platform.liquid': ['build/ja-index.html']
			  }
			},
			copyPlatformToNewSite: {
			  options: {
			      sourceFileStartPattern: '<!-- start-platform -->',
			      sourceFileEndPattern: '<!-- end-platform -->',
			      destinationFileStartPattern: '<!-- start-platform -->',
			      destinationFileEndPattern: '<!-- end-platform -->'
			  },	
			  files: {
			      '../hl-my-account/templates/includes/trade-platform.liquid': ['build/index.html'],
			      '../hl-my-account/templates/includes/ja-trade-platform.liquid': ['build/ja-index.html']
			  }
			},
			copyTradingActivityPopup: {
				options: {
			      sourceFileStartPattern: '<!-- trading-activity-popup -->',
			      sourceFileEndPattern: '<!-- end-trading-activity-popup -->',
			      destinationFileStartPattern: '<!-- trading-activity-popup -->',
			      destinationFileEndPattern: '<!-- end-trading-activity-popup -->'
			  },	
			  files: {
			      '../highlow-public-page/templates/trading-activity-popup.liquid': ['build/trading-activity-popup.html'],
			      '../highlow-public-page/templates/ja-trading-activity-popup.liquid': ['build/ja-trading-activity-popup.html']
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
				tasks: ['newer:copy','newer:copy-part-of-file']
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
	grunt.registerTask('build', ['sprite', 'less', 'newer:concat', 'newer:liquid', 'newer:copy', 'copy-part-of-file','replace']);
	grunt.registerTask('build-platform-to-public-page',[ 'sprite', 'less', 'newer:concat', 'newer:liquid', 'newer:copy','copy-part-of-file:copyPlatform','replace']);
	grunt.registerTask('asset', ['sprite', 'less', 'concat', 'liquid', 'copy','replace']);
};