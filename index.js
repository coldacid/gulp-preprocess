var _     = require('lodash');
var map   = require('map-stream');
var pp    = require('preprocess');
var path  = require('path');

module.exports = function (context, options) {
  function ppStream(file, callback) {
    var contents, extension, opts;

    opts = _.merge({}, options);
    opts.type = _.isEmpty(opts.type) ? getExtension(file.path) : opts.type;

    // TODO: support streaming files
    if (file.isNull()) return callback(null, file); // pass along
    if (file.isStream()) return callback(new Error("gulp-preprocess: Streaming not supported"));

    context.NODE_ENV = context.NODE_ENV || 'development';
    contents = file.contents.toString('utf8');
    contents = pp.preprocess(contents, context, options);
    file.contents = new Buffer(contents);

    callback(null, file);
  }

  function getExtension(filename) {
    var ext = path.extname(filename||'').split('.');
    return ext[ext.length - 1];
  }

  return map(ppStream);
};
