/**
 * |--------------------|
 * | Backbone-Shortcuts |
 * |--------------------|
 *  Backbone-Shortcuts is freely distributable under the MIT license.
 *
 *  <a href="https://github.com/chalbert/Backbone-Shortcuts">More details & documentation</a>
 *
 * @author Nicolas Gilbert
 *
 * @requires _
 * @requires Backbone
 * @requires Underscore-Keys - https://github.com/chalbert/Underscore-Keys
 */

(function(factory){
  'use strict';

  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'backbone', 'underscore-keys'], factory);
  } else {
    factory(_, Backbone);
  }

})(function (_, Backbone){
  'use strict';


  var /** @borrows Backbone.View#delegateEvents */
      delegateEvents = Backbone.View.prototype.delegateEvents,
      /** @borrows Backbone.View#delegateEvents */
      undelegateEvents = Backbone.View.prototype.undelegateEvents,
      shortcutsStack = {};

  Backbone.Shortcuts = {

    /**
     * Global callback for shortcut delegation
     *
     * @param {Object} e Event object
     */
    applyShortcuts: function(e){
      if(!document.activeElement || !$(document.activeElement).is('body')) return;

      var shortcut,
          key = _.getKey(e.which);
      if (shortcutsStack[key] && shortcutsStack[key].length) {
        e.stopPropagation();
        e.preventDefault();
        shortcut = shortcutsStack[key][0];
        if (shortcut.fn) shortcut.fn.apply(shortcut.context, arguments);
      }
    },

    /**
     * Delegate a view shortcuts
     * 
     * @param {Object} shortcuts Hash of shortcuts
     * @param {Object} view
     */
    delegateShortcuts: function(shortcuts, context){
      if (!shortcuts) return;
      var shortcutObject = {};
      _.each(shortcuts, function(shortcut, key) {
        shortcutsStack[key] || (shortcutsStack[key] = []);

        shortcutObject = {
          fn: context[shortcut],
          context: context
        };

        shortcutsStack[key].unshift(shortcutObject);
      }, this);
    },

    /**
     * Undelegate a context shortcuts
     *
     * @param {Object} shortcuts Hash of shortcuts
     * @param {Object} context
     */
    undelegateShortcuts: function(shortcuts, context) {
      if (!shortcuts) return;
      var stack;
      _.each(shortcuts, function(shortcut, key) {
        stack = shortcutsStack[key];
        if (stack) {
          for (var n = 0; n < stack.length; n++) {
            if (stack[n].fn === context[shortcut]
                && stack[n].context === context) stack.splice(n, 1);
          }
        }
      }, this);
    }

  };

  /**
   * @lends Backbone.View.prototype
   */
  _.extend(Backbone.View.prototype, {
    delegateEvents: function(){
      delegateEvents.apply(this, arguments);
      Backbone.Shortcuts.delegateShortcuts(this.shortcuts, this);
    },
    undelegateEvents: function(){
      undelegateEvents.apply(this, arguments);
      Backbone.Shortcuts.undelegateShortcuts(this.shortcuts, this);
    }
  });

  /**
   * Event binding for global shortcuts callback
   */
  $(document).keydown($.proxy(Backbone.Shortcuts.applyShortcuts, this));

  return Backbone;

});