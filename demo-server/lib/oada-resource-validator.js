var _ = require('lodash');
var content_type_parser = require('content-type');

// Local libs:
var log = require.main.require('lib/logger.js').createChild({ module: 'resource-validator' });
var db = require.main.require('lib/memory-db.js');

var mediatype_map = {
  ////////////////////////////////////////////////////////////////
  // Bookmarks validators:
  ////////////////////////////////////////////////////////////////

  'application/vnd.oada.bookmarks.1+json': function(req, res) {
    throw "You need to implement a mediaType validator for application/vnd.oada.bookmarks.1+json";
  },
  'application/vnd.oada.planting.1+json': function(req, res) {
    throw "You need to implement a mediaType validator for application/vnd.oada.bookmarks.1+json";
  },
  'application/vnd.oada.planting.prescriptions.1+json': function(req, res) {
    throw "You need to implement a mediaType validator for application/vnd.oada.bookmarks.1+json";
  },

  ///////////////////////////////////////////////////////////////
  // Prescription validators
  ///////////////////////////////////////////////////////////////

  'application/vnd.oada.planting.prescription.1+json': function(req, res) {
    try {
      var doc = JSON.parse(req.body.toString());
      log.info('You need to build a better planting.prescription validator than just JSON.parse');
    } catch(err) {
      return false;
    }
  },

};

var _ResourceValidator = {

  checkRequest: function(req, res) {
    var content_type = _.get(content_type_parser.parse(req.headers['content-type']), 'type');

    // Decide which validator to use
    if (!_has(mediatype_map, content_type)) {
      log.info('Request to modify unknown media type ' + content_type);
      oada_errors.invalidResultingDocument(res);
      return false;
    }
    return mediatype_map[content_type](req,res);
  }

};

module.exports = _ResourceValidator;
