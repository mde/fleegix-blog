
var helpers = {
  'formatPreviousArticles': function (articles) {
    var ret = []
      , article;
    ret.push('<ul>');
    articles.forEach(function (article) {
      ret.push('<li><a href="/articles/' + article.permalink +
          '">' + article.title + '</a></li>');
    });
    ret.push('</ul>');
    return ret.join('\n');
  }
};

module.exports = helpers;
