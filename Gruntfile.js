module.exports = function(grunt) {

  'use strict';

  grunt.initConfig({

    concat: {
      dist: {
        files: [{
          src: [
            'src/**/*.js'
          ],
          dest: 'dist/protractor-ext-po.js'
        }]
      }
    }
  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {config: require('./package.json')});

  grunt.registerTask('compile', [
    'concat'
  ]);
};
