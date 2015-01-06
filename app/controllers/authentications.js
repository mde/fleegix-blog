var crypto = require('crypto');

var Authentications = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    this.respond({params: params});
  };

  this.add = function (req, resp, params) {
    this.respond({token: this.sameOriginToken});
  };

  this.create = function (req, resp, params) {
    var sha = crypto.createHash('sha1')
      , result;

    if (!geddy.config.secret) {
      throw new Error('Missing app secret');
    }

    sha.update(geddy.config.secret);
    sha.update(params.username);
    sha.update(params.password);

    result = sha.digest('hex');
    if (params.username == 'admin' && result == geddy.config.sitePassword) {
      this.session.set('authenticated', true);
      this.redirect('/');
    }
    else {
      throw new geddy.errors.UnauthorizedError();
    }

  };

  this.remove = function (req, resp, params) {
    this.session.set('authenticated', false);
    this.redirect('/');
  };

};

exports.Authentications = Authentications;

