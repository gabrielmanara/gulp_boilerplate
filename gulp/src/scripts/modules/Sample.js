(function($, App) {
  'use strict';

  App.Sample = App.Sample || {
    init: function(element) {
      this.callSomeBeautifulFunc(element);
    },

    callSomeBeautifulFunc: function(element) {
      console.log('Beautiful Context' + element);
    }

  }

}(jQuery, App));