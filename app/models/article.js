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

Article = geddy.model.register('Article', Article);

