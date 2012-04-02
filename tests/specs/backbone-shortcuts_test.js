define([
  'underscore',
  'backbone',
  'backbone-shortcuts'
], function(_, Backbone){
  'use strict';

  var spies = {};

  describe("Backbone-Shortcuts", function () {

    beforeEach(function(){
      $('body').append('<div id="container"><a></a></div>');
    });
    afterEach(function(){
      _.each(spies, function(spy){
        spy.restore();
      });
    });


    describe("When a new view is created", function () {

      var view;
      beforeEach(function(){

        spies.delegateShortcuts = sinon.spy(Backbone.Shortcuts, 'delegateShortcuts');
        var View = Backbone.View.extend({
          el: '#container',
          shortcuts: {
            'enter': 'my_function'
          }
        });
        view = new View();
      });

      afterEach(function(){
        view.remove();
      });

      describe("And the view has a 'shortcuts' object", function () {

        it("should delegate the shortcuts", function () {
          expect(spies.delegateShortcuts).toHaveBeenCalledWith(view.shortcuts);
        });

      });

    });

    describe("When the view's events are undelegated", function () {

      var view;
      beforeEach(function(){

        spies.undelegateShortcuts = sinon.spy(Backbone.Shortcuts, 'undelegateShortcuts');
        var View = Backbone.View.extend({
          el: '#container',
          shortcuts: {
            'enter': 'my_function'
          }
        });
        view = new View();
      });

      it("Should undelegate the shortcuts", function () {
        view.undelegateEvents();
        expect(spies.undelegateShortcuts).toHaveBeenCalled(view.shortcuts);
      });


    });

  });

});