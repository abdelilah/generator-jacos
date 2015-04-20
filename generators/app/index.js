var generators = require('yeoman-generator');
var colors = require('colors');
var fs = require('fs-extra');
var spawn = require('child_process').spawn;
var _ = require('lodash');
var async = require('async');

var libraries = [
  {
    name: "jQuery",
    value: 'jquery',
    js: ['bower_components/jquery/dist/jquery.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Twitter Bootstrap",
    value: 'bootstrap',
    js: ['bower_components/bootstrap/dist/js/bootstrap.min.js'],
    css: ['bower_components/bootstrap/dist/css/bootstrap.min.css'],
    copy: {}
  },
  {
    name: "AngularJS",
    value: 'angular',
    js: ['bower_components/angular/angular.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Font Awesome",
    value: 'font-awesome',
    js: [],
    css: ['bower_components/font-awesome/css/font-awesome.min.css',],
    copy: {"bower_components/font-awesome/fonts": "../build/assets/fonts"}
  },
  {
    name: "jQuery UI",
    value: 'jquery-ui',
    js: ['bower_components/jqueryui/jquery-ui.min.js'],
    css: ['bower_components/jqueryui/themes/ui-lightness/jquery-ui.min.css'],
    copy: {}
  },
  {
    name: "Validator JS",
    value: 'validator-js',
    js: ['bower_components/validator-js/validator.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Lodash",
    value: 'lodash',
    js: ['bower_components/lodash/dist/lodash.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Moment JS",
    value: 'moment',
    js: ['bower_components/moment/min/moment.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Angular UI",
    value: 'angular-ui',
    js: ['bower_components/angular-ui/build/angular-ui.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Angular UI Utils",
    value: 'angular-ui-utils',
    js: ['bower_components/angular-ui-utils/ui-utils.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Angular UI Ace",
    value: 'angular-ui-ace',
    js: ['bower_components/angular-ui-ace/ui-ace.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "jQuery Backstretch",
    value: 'jquery-backstretch',
    js: ['bower_components/jquery-backstretch/jquery.backstretch.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Highcharts",
    value: 'highcharts',
    js: ['bower_components/highcharts/highcharts.js'],
    css: [],
    copy: {}
  },
  {
    name: "Angular Strap",
    value: 'angular-strap',
    js: ['bower_components/angular-strap/dist/angular-strap.min.js'],
    css: [],
    copy: {}
  },
  {
    name: "Stellar",
    value: 'stellar',
    js: ['bower_components/stellar/jquery.stellar.min.js'],
    css: [],
    copy: {}
  },/*
  {
    name: "",
    value: '',
    js: [],
    css: [],
    copy: {}
  },*/
];

var selectedLibraries = ['jquery', 'bootstrap','font-awesome'];
var cwd = process.cwd();



module.exports = generators.Base.extend({
  constructor: function() {
    generators.Base.apply(this, arguments);

    this.argument('appname', { type: String, required: true });

    // Next, add your custom code
    // this.option('coffee'); // This method adds support for a `--coffee` flag
  },


  selectLibraries: function(){
    var done = this.async();

    this.prompt({
      type    : 'checkbox',
      name    : 'libraries',
      message : 'Select libraries you want to use',
      default : selectedLibraries,
      choices : libraries
    }, function (answers) {
      selectedLibraries = answers.libraries;

      done();
    }.bind(this));
  },

  createFolders: function() {
    

    this.log("Creating folders...");


    this.log(this.sourceRoot());
    this.log(cwd+"/"+this.appname);

    fs.copySync(this.templatePath()+"/default", cwd+"/"+this.appname);
  },


  createFiles: function(){
    var done = this.async();
    this.log("Creating files...");

    var destFolder = cwd+"/"+this.appname+"/src";
    var bowerFile = destFolder+"/bower.json";

    fs.unlink(bowerFile);
    this.fs.copyTpl(
      this.templatePath('default/src/bower.json'),
      bowerFile, 
      { packages: selectedLibraries }
    );


    fs.unlink(destFolder + "/jade/layouts/layout.jade");
    fs.unlink(destFolder + "/jade/index.jade");

    this.fs.copyTpl(
      this.templatePath('default/src/jade/layouts/layout.jade'),
      destFolder + "/jade/layouts/layout.jade", 
      { title: this.appname }
    );

    this.fs.copyTpl(
      this.templatePath('default/src/jade/index.jade'),
      destFolder + "/jade/index.jade", 
      { title: this.appname }
    );

    

    done();
  },


  gulp: function(){
    this.log("Creating gulpfile...");

    var js = [];
    var css = [];
    var copy = {};


    for(var i = 0; i < selectedLibraries.length; i++){
      var lib = selectedLibraries[i];
      var theLib = _.find(libraries, function(library){ return library.value == lib; });

      js = js.concat( theLib.js );
      css = css.concat( theLib.css );

      _.forEach(theLib.copy, function(dest, src){
        copy[src] = dest;
      });
    }


    var destFolder = cwd+"/"+this.appname+"/src";
    var gulpFile = destFolder+"/gulpfile.js";

    fs.unlink(gulpFile);
    this.fs.copyTpl(
      this.templatePath('default/src/gulpfile.js'),
      gulpFile, 
      { 
        js: js,
        css: css,
        copy: copy
      }
    );
  },


  finished: function(){
    this.log("=========== Finished ===========".bold.green);
    this.log("Now run these commands to get started: ".yellow);
    this.log("cd "+this.appname+"/src");
    this.log("sudo npm install");
    this.log("bower install");
    this.log("gulp");
  }
});