var Article = function () {

  this.defineProperties({
    title: {type: 'string'}
  , permalink: {type: 'string'}
  , commentsCount: {type: 'int'}
  , commenting: {type: 'int'}
  , excerpt: {type: 'text'}
  , body: {type: 'text'}
  , excerptHtml: {type: 'text'}
  , bodyHtml: {type: 'text'}
  , filter: {type: 'string'}
  , publishedAt: {type: 'datetime'}
  });

  this.hasMany('Comments');
  this.autoIncrementId = true;
  this.adapter = 'postgres';
};

Article.prototype.permalinkParts = function () {
  var parts
    , pathParts;
  parts = this.permalink.split('-');
  pathParts = [];
  pathParts.push(parts.shift()); // YYYY
  pathParts.push(parts.shift()); // MM
  pathParts.push(parts.shift()); // DD
  pathParts.push(parts.join('-')); // hyphenated title
  return pathParts;
}

Article = geddy.model.register('Article', Article);

