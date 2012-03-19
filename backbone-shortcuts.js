define([
  'backbone',
  'underscore',
  'backbone-mediator'
], function (Backbone, _) {

  Backbone.Mediator.subscribe('shortcut:add', this.addShortcuts, this);
  Backbone.Mediator.subscribe('shortcut:remove', this.removeShortcuts, this);
  $(document).keydown($.proxy(this.document_key, this));

  var shortcutsStack = {};
  function document_key (e){
    if(!document.activeElement || !$(document.activeElement).is('body')) return;

    var key = _.getKey(e.which);
    if (this.shortcutsStack[key] && this.shortcutsStack[key].length) {
      e.stopPropagation();
      e.preventDefault();
      var shortcut = this.shortcutsStack[key][0];
      if (shortcut.fn) shortcut.fn.apply(shortcut.context, arguments);
    }
  }

  function addShortcuts (shortcuts, context){
    this.removeShortcuts(shortcuts, context);
    _.each(shortcuts, function(shortcut, key) {
      this.shortcutsStack[key] || (this.shortcutsStack[key] = []);
      this.shortcutsStack[key].unshift({
        fn: context[shortcut],
        context: context
      });
    }, this);
  }

  function removeShortcuts(shortcuts, context) {
    var stack;
    _.each(shortcuts, function(shortcut, key) {
      stack = this.shortcutsStack[key]
      if (stack) {
        for (var n = 0; n < stack.length; n++) {
          if (stack[n].fn === context[shortcut]) stack.splice(n, 1);
        }
      }
    }, this);
  }

  Backbone.View = Backbone.View.extend({
    setup: function(){
      //| > Delegate shorcuts to shortcut manager
      Backbone.Mediator.publish('shortcut:add', this.shortcuts, this);
      this._super('setup', arguments);
    }
  });

  return Backbone;


});