var App = [];
$('body').ready(function() {
    $('[data-module]').each(function() {
        var module = $(this).data('module');
        try {
          App[module].init(this);
        } catch (e) {}
      });
});