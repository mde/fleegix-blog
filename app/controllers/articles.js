var _formatRssFeed = function (data) {
  var articles = []
    , feed = {
        title: 'Fleegix.org'
      , link: 'http://fleegix.org/'
      , article: articles
      };
  data.forEach(function (item) {
    var article = {};
    var body = item.bodyHtml;
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
  /*
  this.before(this._requireAuthentication, {
    except: ['index', 'show']
  , async: true
  });
  */
  this.before(this._getPreviousArticles, {
    async: true
  });

  this.respondsWith = ['html', 'json', 'xml'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Article.all({publishedAt: {ne: null}},
        {sort: {'publishedAt': 'desc'}},
        function (err, data) {
      // RSS
      if (params.format == 'xml' || self.request.url == '/articles.rss') {
        self.respond(_formatRssFeed(data), {format: 'xml'});
      }
      // Standard rendering hokey-pokey
      else {
        self.respond({
          articles: data
        , previous: self._previousArticles
        , authenticated: self.session.get('authenticated')
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

    params.permalink = params.permalink ||
      params.title.toLowerCase().replace(/ /g, '-');

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
    var self = this;

    geddy.model.Article.load({permalink: params.id},
        function (err, article) {
      if (err) {
        throw err;
      }
      article.getComments(function (err, comments) {
        self.respond({
          params: params
        , article: article
        , comments: comments
        , previous: self._previousArticles
        , authenticated: self.session.get('authenticated')
        });
      });
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Article.load(params.id,
        function (err, article) {
      self.respond({
        params: params
      , article: article
      , token: self.sameOriginToken
      });
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    var article = geddy.model.Article.create(params);

    article._saved = true;
    article.save(function (err, article) {
      if (err) {
        params.errors = err;
        self.transfer('edit');
      }
      else {
        self.redirect('/articles/' + article.id + '/edit');
      }
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
