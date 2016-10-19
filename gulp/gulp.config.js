'use strict';

// Main Paths
var src = './src/',
    dist = './dist/',
    projectName = 'yourproject',
    srcNodeModules = './node_modules/';

var jsScriptsValidate = [
  src + 'scripts/modules/*.js',
  '!' + src + 'scripts/libs/**/*.js'
];

// Scss files to validate
var stylesValidate = [
  src + 'scss/**/*.{scss, sass}',
];

module.exports = {
  src: src,
  dist: dist,

  paths: {

    nodemodules: {
      source: srcNodeModules
    },

    scripts: {
      filename: projectName + 'build.js',
      destination: dist + 'scripts/',
      source: src + 'scripts/**/*.js',
      scriptsValidate: jsScriptsValidate
    },

    styles: {
      filename: projectName + 'style.css',
      source: src + 'scss/',
      destination: dist + 'styles/',
      abstractions: src + 'scss/abstractions/',
      stylesValidate: stylesValidate
    },

    images: {
      source: src + 'images/',
      destination: dist + 'images/'
    },

    fonts: {
      source: src + 'fonts/',
      destination: dist + 'fonts/'
    },

    reportFolder: './.qualityReports/',
  }
};