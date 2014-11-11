// Thanks to https://github.com/anasnakawa/jquery.ajax.fake

(function($){

  // Caching jQuery ajax method
  var ajax = $.ajax
  var fakeWebServices = {}
  var defaults = {
    fake: true,  // is it fake ?
    wait: 0  // how long should wait before return ajax response 
  };
  
  var ajaxFake = function(options) {
    var deferred = $.Deferred(); // Create a new deferred object for each request

    // not fake, just return the original jquery ajax
    if ($.ajax.isFake === false) {
      return ajax.apply(this, arguments);
    }

    options = $.extend(defaults, options);
    
    if (!options.fake) {
      return ajax.apply(this, arguments);
    }
        
    if(!fakeWebServices[options.url]) {
      $.error('{url} 404 not found'.replace(/{url}/, options.url));
      return deferred.reject('404');
    }

    // fake it..
    setTimeout(function() {
      var data = fakeWebServices[options.url](options.data);
      if(options.success) {
        options.success(data);
      }
      if(options.complete) {
        options.complete(data);
      }
      deferred.resolve(data);
      
    }, options.wait);
    
    // return a promise object
    return deferred.promise();
  };
  
  var registerFakeWebService = function(url, callback) {
    fakeWebServices[url] = function(data) {
      return callback(data);
    }
  };
  
  // Swap out jQuery ajax for fake method
  $.ajax = ajaxFake;
  $.ajax.fake = {
    defaults: defaults,
    registerWebservice: registerFakeWebService,
    webServices: fakeWebServices
  };

})(jQuery);