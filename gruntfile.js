module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        wiredep: {
            task: {
                directory: './public/bower_components',
                bowerJson: require('./public/bower.json'),
                src: [
                    'views/*.jade'
                ],
                cwd: './public',
                includeSelf: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-wiredep');

    grunt.registerTask('default',['wiredep']);
};