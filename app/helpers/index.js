var md = require('node-markdown').Markdown
  , hl = require('highlight').Highlight;

var helpers = {
  formatPreviousArticles: function (articles) {
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

, formatArticleBody: function (body) {
    var html = body || '';
    html = html.replace(/<code:javascript>/g, '<pre><code>')
        .replace(/<\/code>/g, '</code></pre>');
    html = md(html);
    html = hl(html, false, true);
    return html;
  }

, formatArticleDate: function (date) {
    return date ? geddy.utils.date.relativeTime(date) :
      'Draft';
  }

};

module.exports = helpers;
