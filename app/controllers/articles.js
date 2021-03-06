var _createPermalink = function (params) {
      var dt = params.publishedAt ?
          geddy.date.parse(params.publishedAt) : new Date();
      return params.permalink ||
        geddy.date.strftime(dt, '%F') + '-' +
        params.title.toLowerCase().replace(/ /g, '-');
    }

  , _formatRssFeed = function (data) {
      var articles = []
        , feed = {
            title: 'Fleegix.org'
          , link: 'http://fleegix.org/'
          , article: articles
          };
      data.forEach(function (item) {
        var article = {};
        var body = item.bodyHtml || item.body;
        body = body.replace(/<code:[^>]+>/g, '<pre><code>');
        body = body.replace(/<\/code>/g, '</code></pre>');
        article.body = {'#cdata': body};
        article.title = {'#cdata': item.title};
        article.publishedAt = geddy.date.toISO8601(item.publishedAt);
        article.permalink = 'http://fleegix.org/' + item.permalink;
        articles.push(article);
      });
      feed.toXML = function () {
        return geddy.XML.stringify(this, {name: 'feed', arrayRoot:
          false});
      };
      return feed;
    };

var Articles = function () {
  this.before(this._requireAuthentication, {
    except: ['index', 'show']
  , async: true
  });
  this.before(this._getPreviousArticles, {
    except: ['create', 'update']
  , async: true
  });


  this.respondsWith = ['html', 'json', 'xml'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Article.all({},
        {sort: {'publishedAt': 'desc'}},
        function (err, data) {
      if (err) {
        throw err;
      }
      var articles;
      if (!self.authenticated) {
        articles = data.filter(function (item) {
          return !!item.publishedAt;
        });
      }
      else {
        articles = data;
      }
      // RSS
      if (params.format == 'xml' || self.request.url == '/articles.rss') {
        self.respond(_formatRssFeed(articles), {format: 'xml'});
      }
      // Standard rendering hokey-pokey
      else {
        self.respond({
          articles: articles
        });
      }

    });
  };

  this.add = function (req, resp, params) {
    this.respond({
      params: params
    , token: this.sameOriginToken
    });
  };

  this.create = function (req, resp, params) {
    var self = this
      , article;

    params.permalink = _createPermalink(params);
    article = geddy.model.Article.create(params);

    article.save(function (err, data) {
      if (err) {
        params.errors = err;
        self.transfer('add');
      }
      else {
        self.redirect('/articles/' + article.id + '/edit');
      }
    });
  };

  this.show = function (req, resp, params) {
    var self = this
      , permalink = params.id ? params.id :
            params.year + '-' + params.month + '-' +
            params.date + '-' + params.link;

    geddy.model.Article.first({permalink: permalink},
        function (err, article) {
      if (err) {
        throw err;
      }
      if (!article) {
        var err = new Error();
        err.statusCode = 404;
        self.error(err);
      }
      else {
        article.getComments(function (err, comments) {
          if (err) {
            throw err;
          }
          self.respond({
            params: params
          , article: article
          , comments: comments
          });
        });
      }
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Article.first(params.id,
        function (err, article) {
      if (err) {
        throw err;
      }
      self.respond({
        params: params
      , article: article
      , token: self.sameOriginToken
      });
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Article.first(params.id,
        function (err, article) {
      if (err) {
        throw err;
      }
      params.permalink = _createPermalink(params);
      article.updateAttributes(params);
      article.save(function (err, article) {
        if (err) {
          params.errors = err;
          self.transfer('edit');
        }
        else {
          self.redirect('/articles/' + article.id + '/edit');
        }
      });
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Article.remove(params.id, function (err) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      }
      else {
        self.redirect({controller: self.name});
      }
    });
  };

};

exports.Articles = Articles;
