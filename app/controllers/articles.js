var Articles = function () {
  this.respondsWith = ['html', 'json', 'xml', 'js', 'txt'];

  this.index = function (req, resp, params) {
    var self = this;

    geddy.model.Article.all({}, {sort: {'publishedAt': 'desc'}},
        function(err, articles) {
      self.respond({params: params, articles: articles});
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
        self.respond({params: params, article: article,
            comments: comments});
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
