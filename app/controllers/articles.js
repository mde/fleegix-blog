var md = require('node-markdown').Markdown
  , hl = require('highlight').Highlight;

var Articles = function () {
  this.before(this._requireAuthorization, {
    except: ['index', 'show']
  , async: true
  });
  this.before(this._getPreviousArticles, {
    async: true
  });

  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Article.all({publishedAt: {ne: null}},
        {sort: {'publishedAt': 'desc'}},
        function(err, articles) {
      self.respond({
        params: params
      , articles: articles
      , previous: self._previousArticles
      });
    });
  };

  this.add = function (req, resp, params) {
    this.respond({params: params});
  };

  this.create = function (req, resp, params) {
    params.id = params.id || geddy.string.uuid(10);

    var self = this
      , article = geddy.model.Article.create(params);

    article.save(function(err, data) {
      if(err) {
        params.errors = err;
        self.transfer('add');
      } else self.redirect({controller: self.name});
    });
  };

  this.show = function (req, resp, params) {
    var self = this;
    geddy.model.Article.load({permalink: params.id},
        function(err, article) {
      article.getComments(function (err, comments) {

        article.body = article.body.replace(/<code:javascript>/g, '<pre><code>');
        article.body = article.body.replace(/<\/code>/g, '</code></pre>');

        article.bodyHtml = md(article.body);
        article.bodyHtml = hl(article.bodyHtml, false, true);

        article.publishedAt = geddy.utils.date.relativeTime(article.publishedAt);
        self.respond({
          params: params
        , article: article
        , comments: comments
        , previous: self._previousArticles
        });
      });
    });
  };

  this.edit = function (req, resp, params) {
    var self = this;

    geddy.model.Article.load(params.id, function(err, article) {
      self.respond({params: params, article: article});
    });
  };

  this.update = function (req, resp, params) {
    var self = this;

    geddy.model.Article.load(params.id, function(err, article) {
      article.id = params.id;

      article.save(function(err, data) {
        if(err) {
          params.errors = err;
          self.transfer('edit');
        } else self.redirect({controller: self.name});
      });
    });
  };

  this.remove = function (req, resp, params) {
    var self = this;

    geddy.model.Article.remove(params.id, function(err) {
      if(err) {
        params.errors = err;
        self.transfer('edit');
      } else self.redirect({controller: self.name});
    });
  };

};

exports.Articles = Articles;
