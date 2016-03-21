module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
    
		// minifies JS
		uglify: {
			options: {
				mangle: false,
				preserveComments: false
			},
			my_target: {
				files: [{
					expand: true,
					cwd: 'src/js',
					src: ['*.js','!*.min.js','static/*.js','vendor/*.js','!vendor/*.min.js'],
					dest: 'dist/js',
					ext: '.min.js'
				}]
			}
		},
			
		// minifies CSS files
		cssmin: {
			options: {              	
              	rebase: false
          	},          	
			minify: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css', '!*.min.css','vendor/*.css','!vendor/*.min.css'],
					dest: 'dist/css',
					ext: '.min.css'
				}]
			}
		},
		
		// js validation
		jshint: {
			all: ['src/js/*.js']
		},
		
		// image compression
		imagemin: {                          
			dist: {
				options: {
					optimizationLevel: 3
				},
				files: [{
					expand: true,
					cwd: 'src/img',
					src: ['**/*.{png,jpg}'],
					dest: 'dist/img/'
				}]
			}
		},
		
		// watch task
		browserSync: {
			bsFiles: {
				src : ['src/*.html','src/css/*.css','src/js/*.js']
			},
			options: {
				server: {
					baseDir: "./"
				},
				ghostMode: 
				{
					clicks: true,
					forms: true,
					scroll: true
				}
			}
		},
		
		// modifies html to use minified js
		processhtml: {		
			dist: {
				options: {
					process: true,
				},
				files: [{
					expand: true,
					cwd: 'src/',
					src: ['*.html'],
					dest: 'dist/'	
				}]
			}
		}
	});

	// development tasks
	grunt.registerTask('dev', ['browserSync']);
	
	// production tasks
	grunt.registerTask('release', ['jshint','uglify','cssmin','imagemin','processhtml']);

	// load tasks 
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-contrib-jshint');	
	grunt.loadNpmTasks('grunt-browser-sync');
	grunt.loadNpmTasks('grunt-processhtml');
};