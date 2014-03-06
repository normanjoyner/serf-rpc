var fs = require("fs");
var serf = require([__dirname, "lib", "serf"].join("/"));
var pkg = require([__dirname, "package"].join("/"));

exports = module.exports = function(){
    var config = serf.initialize();
    config.version = pkg.version;
    return config;
}
