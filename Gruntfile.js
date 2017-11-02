"use strict";

module.exports = function(grunt) {
  var port = 9999;
  var live = process.env.LIVE_API;
  var buildNumber = process.env.TRAVIS_JOB_ID || Math.floor(Math.random() * 1000);
  var pkg = grunt.file.readJSON('postcodes.jquery.json');
  var testConfig = grunt.file.readJSON('test/config.json');
  var browsers = testConfig.testBrowsers;
  var jqueryBuilds = testConfig.jqueryBuilds;
  var testUrls = [];
  for (var i = 0; i < jqueryBuilds.length; i++) {
    testUrls.push('http://localhost:' + port + '/test/jquery.postcodes.html?jquery=' + jqueryBuilds[i]);
    if (live) {
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
      '<%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.map(pkg.licenses, "type").join(", ") %> */\n',
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
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: '<%= concat.dist.dest %>',
        dest: 'dist/<%= pkg.name %>.min.js'
      }
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
      }
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
      }
    },
    connect: {
      server: {
        options: {
          port: port,
          keepalive: false
        }
      }
    }
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
