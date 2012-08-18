var Comment = function () {

  this.defineProperties({
    author: {type: 'string'}
  , name: {type: 'string'}
  , email: {type: 'string'}
  , website: {type: 'string'}
  , modsUp: {type: 'text'}
  , modsDown: {type: 'text'}
  , modsCount: {type: 'int'}
  , body: {type: 'text'}
  , bodyHtml: {type: 'text'}
  });

  this.belongsTo('Article');
  this.autoIncrementId = true;
  this.adapter = 'postgres';
};

Comment = geddy.model.register('Comment', Comment);

