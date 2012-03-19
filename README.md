# Backbone-Shortcuts

DEPENDENCIES:

* [Backbone-Mediator](https://github.com/chalbert/Backbone-Mediator)
* [Underscore-Key](https://github.com/chalbert/Underscore-Keys)

Shortcuts management with nesting support
 
### Setting shortcuts
 
Shortcuts are set as a hash of *key* & *function name* on your views.
 
    var view = Backbone.View.extend({
 
      shortcuts: {
        left: 'previous_click',
        right: 'next_click',
        escape: 'back',
        backspace: 'back'
      }
      
    });
 
### Shortcut nesting

Only a single shortcut can be linked to one key at a time. If more than one shortcut is binded to one key, the latest 
shortcut will be used. Once the lastest shortcut is removed, the previous one will be use again.

This can be seen as *shortcuts nesting*. You can define global shortcuts and then override them
selectively within a view. All the others shorcuts will still be active. If the child view is closed, 
this parent shortcut will be use once more.

For example, 'backlash' is normally navigating to the previous page. When a pop-up is open, 'backslash' is 
overriden to close the pop-up. All the other shortcuts are still active. When the pop-up is closed, its
'backslash' shortcut is unregistered. The parent page shortcut will work once more, without having 
to  be registered.
