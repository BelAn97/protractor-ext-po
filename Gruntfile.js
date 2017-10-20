module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-protractor-runner');
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
    },
      protractor: {
          options: {
              configFile: 'test/protractor-conf.js', // Default config file
              noColor: false // If true, protractor will not use colors in its output.
          },
          test: {
              options: {
                  args: {
                      specs: [
                          'test/e2e/tests/**/*.js'
                      ]
                  }
              }
          }
      }
  });

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt, {config: require('./package.json')});

  grunt.registerTask('compile', [
    'concat'
  ]);
  grunt.registerTask('test', 'protractor:test');
};
