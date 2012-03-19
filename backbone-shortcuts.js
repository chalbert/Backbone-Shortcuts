define([
  'libs/vendor/backbone/backbone',
  'underscore',
  'backbone-mediator'
], function (Backbone, _) {

  $(document).keydown($.proxy(document_keydown, this));

  var shortcutsStack = {};

  function document_keydown (e){
    if(!document.activeElement || !$(document.activeElement).is('body')) return;

    var key = _.getKey(e.which);
    if (shortcutsStack[key] && shortcutsStack[key].length) {
      e.stopPropagation();
      e.preventDefault();
      var shortcut = shortcutsStack[key][0];
      if (shortcut.fn) shortcut.fn.apply(shortcut.context, arguments);
    }
  }

  function addShortcuts (shortcuts, context){
    removeShortcuts(shortcuts, context);
    _.each(shortcuts, function(shortcut, key) {
      shortcutsStack[key] || (shortcutsStack[key] = []);
      shortcutsStack[key].unshift({
        fn: context[shortcut],
        context: context
      });
    }, this);
  }

  function removeShortcuts(shortcuts, context) {
    var stack;
    _.each(shortcuts, function(shortcut, key) {
      stack = shortcutsStack[key]
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
      Backbone.Mediator.subscribe('shortcut:add', addShortcuts, this);
      Backbone.Mediator.subscribe('shortcut:remove', removeShortcuts, this);
      this._super('setup', arguments);
    }
  });

  return Backbone;


});