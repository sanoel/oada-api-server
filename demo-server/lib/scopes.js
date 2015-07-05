var Promise = require('bluebird');
var driver = require('./memory-db-auth-driver.js');
var oada_error = require('oada-error').OADAError;
var error_codes = require('oada-error').codes;


var _Scopes = {

  // Given an HTTP request, figure out if the token has permission to perform the requested action.  
  // If not, return the error function that needs to be run from oada-errors
  checkRequest: function(req) {
    return Promise.try(function() {
      var token = _Scopes.parseTokenFromRequest(req);
      if (!token) {
        throw new oada_error('No Authorization Token Given', error_codes.UNAUTHORIZED, 'No valid authorization header is present');
      }
      return driver.get(token);

    }).then(function(val) {
      // For now, all valid tokens can do everything:
      if (!val) {
        throw new oada_error('Token is not authorized', error_codes.UNAUTHORIZED, 'Token is not authorized to execute this request');
      }
      return true; // if we didn't throw, then request is valid.
    });
  },

  parseTokenFromRequest: function(req) {
    var bearer = req.headers.authorization;
    if (typeof bearer !== 'string') return null;
    return bearer.trim().replace(/^bearer +/i,'');
  },

};

module.exports = _Scopes;
