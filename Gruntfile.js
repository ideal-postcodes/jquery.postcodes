"use strict";




module.exports = function(grunt) {
  var browsers = [
    {
      "browserName": "safari",
      "platform": "OS X 10.9",
      "deviceName": "iPhone",
      "device-orientation": "portrait"
    },
    {
      "browserName" : "android",
      "version": "4.3",
      "platform": "Linux",
      "deviceName": "Android",
      "device-orientation": "portrait"
    },
    {
      browserName: "chrome",
      platform: "WIN8"
    }, 
    {
      browserName: "firefox",
      platform: "WIN8"
    }, 
    {
      browserName: "opera",
      platform: "WIN7"
    }, 
    {
      browserName: "internet explorer",
      platform: "WIN8.1",
      version: "11"
    }, 
    {
      browserName: "internet explorer",
      platform: "WIN8",
      version: "10"
    }, 
    {
      browserName: "internet explorer",
      platform: "WIN7",
      version: "9"
    }, 
    {
      browserName: "internet explorer",
      platform: "WIN7",
      version: "8"
    }, 
    {
      browserName: "internet explorer",
      platform: "XP",
      version: "7"
    },
    {
      browserName: "safari",
      platform: "OS X 10.9"
    }
  ];
  var pkg = grunt.file.readJSON('postcodes.jquery.json');
  var port = 9999;
  var buildNumber = process.env.TRAVIS_JOB_ID || Math.floor(Math.random() * 1000);
  var testUrls = [
    'http://localhost:' + port + '/test/jquery.postcodes.html?jquery=1.9.1',
    'http://localhost:' + port + '/test/jquery.postcodes.html?jquery=1.10.2',
    'http://localhost:' + port + '/test/jquery.postcodes.html?jquery=1.11.1',
    'http://localhost:' + port + '/test/jquery.postcodes.html?jquery=2.0.3',
    'http://localhost:' + port + '/test/jquery.postcodes.html?jquery=2.1.1'
  ];
  var live = process.env.LIVE_API;
  if (live) {
    for (var i = 0; i < testUrls.length; i++) {
      testUrls[i] += "&live=true";
    }
  }
  

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: pkg,
    "saucelabs-qunit": {
      all: {
        options: {
          urls: testUrls,
          tunnelTimeout: 5,
          build: buildNumber,
          concurrency: 3,
          browsers: browsers,
          testname: "jquery.postcodes",
          tags: ["master"],
          sauceConfig: {
            "record-video": false
          }
        }
      }
    },
    banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: true
      },
      dist: {
        // Manually point to right file
        src: ['src/jquery.postcodes.js'],
        dest: 'dist/<%= pkg.name %>.js'
      },
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      },
    },
    qunit: {
      all: {
        options: {
          urls: testUrls
        }
      }
    },
    jshint: {
      gruntfile: {
        options: {
          jshintrc: '.jshintrc'
        },
        src: 'Gruntfile.js'
      },
      src: {
        options: {
          jshintrc: 'src/.jshintrc'
        },
        src: ['src/**/*.js']
      },
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/**/*.js']
      },
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      src: {
        files: '<%= jshint.src.src %>',
        tasks: ['jshint:src', 'qunit']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'qunit']
      },
    },
    connect: {
      server: {
        options: {
          port: port,
          keepalive: false
        }
      }
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-saucelabs');

  // Default task.
  grunt.registerTask('default', ['connect', 'jshint', 'qunit', 'clean', 'concat', 'uglify']);
  grunt.registerTask('test', ['connect', 'jshint', 'qunit']);
  grunt.registerTask('sauce', ['connect', 'jshint', 'saucelabs-qunit']);

};
