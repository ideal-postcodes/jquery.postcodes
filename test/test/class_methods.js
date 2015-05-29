(function($) {
  "use strict";

  var apiKey = "iddqd";

  /*
   * Class Method Tests
   *
   */

  module("Class Methods");

  asyncTest("$.idealPostcodes.lookupPostcode should lookup a postcode", 3, function () {
    var success = function (data) {
      start();
      equal(data.code, 2000, "should return 2000 for valid postcode");
      notEqual(data.result.length, 0, "should return an array of addresses");
      equal(data.result[0].postcode, "ID1 1QD", "should contain relevant addresses");
    };
    $.idealPostcodes.lookupPostcode({ 
      query: "ID11QD", 
      api_key: apiKey
    }, success);
  });

  asyncTest("$.idealPostcodes.lookupPostcode also accept `postcode` as query attribute", 3, function () {
    var success = function (data) {
      start();
      equal(data.code, 2000, "should return 2000 for valid postcode");
      notEqual(data.result.length, 0, "should return an array of addresses");
      equal(data.result[0].postcode, "ID1 1QD", "should contain relevant addresses");
    };
    $.idealPostcodes.lookupPostcode({ 
      postcode: "ID11QD", 
      api_key: apiKey
    }, success);
  });

  asyncTest("$.idealPostcodes.lookupPostcode should return an empty response if postcode not found", 2, function () {
    var success = function (data) {
      start();
      equal(data.code, 4040, "should return code 4040 for invalid postcode");
      equal(data.result, undefined, "Postcode should not be defined");
    };
    $.idealPostcodes.lookupPostcode({
      query: "ID1KFA", 
      api_key: apiKey
    }, success);
  });

  asyncTest("$.idealPostcodes.lookupAddress should lookup an address", 3, function () {
    var success = function (data) {
      start();
      equal(data.code, 2000, "should return 2000 for valid search query");
      equal(data.result.total, 7);
      equal(data.result.hits[0].postcode, "ID1 1QD", "should contain relevant addresses");
    };
    $.idealPostcodes.lookupAddress({
      query: "ID1 1QD",
      api_key: apiKey
    }, success);
  });

  asyncTest("$.idealPostcodes.lookupAddress should lookup an address", 3, function () {
    var success = function (data) {
      start();
      equal(data.code, 2000, "should return 2000 for valid search query");
      equal(data.result.total, 2);
      equal(data.result.hits[0].postcode, "SW1A 2AA", "should contain relevant addresses");
    };
    $.idealPostcodes.lookupAddress({
      query: "10 Downing Street London",
      api_key: apiKey
    }, success);
  });

  asyncTest("$.idealPostcodes.lookupAddress should lookup an address", 2, function () {
    var success = function (data) {
      start();
      equal(data.code, 2000, "should return 2000 for valid search query");
      equal(data.result.total, 0);
    };
    $.idealPostcodes.lookupAddress({
      query: "ID1 KFA",
      api_key: apiKey
    }, success);
  });

  asyncTest("$.idealPostcodes.lookupAddress should be sensitive to limits", 2, function () {
    var success = function (data) {
      start();
      equal(data.code, 2000, "should return 2000 for valid search query");
      equal(data.result.hits.length, 20);
    };
    $.idealPostcodes.lookupAddress({
      query: "Test Limit",
      api_key: apiKey,
      limit: 20
    }, success);
  });

  asyncTest("$.idealPostcodes.checkKey should return true if key is usable and cache result", 2, function () {
    var success = function () {
      equal(2000, 2000);
      equal($.idealPostcodes.keyCheckCache["iddqd"], true, "Successful result is cached");
      start();
    };
    var failure = function () {
      start();
    };
    $.idealPostcodes.checkKey({
      api_key: "iddqd"
    }, success, failure);
  });

  asyncTest("$.idealPostcodes.checkKey should return false if key is not usable and cache result", 2, function () {
    var success = function () {
      start();
    };
    var failure = function () {
      equal(2000, 2000);
      equal($.idealPostcodes.keyCheckCache["idkfa"], false, "Failed result is cached");
      start();
    };
    $.idealPostcodes.checkKey({
      api_key: "idkfa"
    }, success, failure);
  });

  asyncTest("$.idealPostcodes.checkKey should return false if invalid response is returned and clear the cache", 1, function () {
    var success = function () {
      start();
    };
    var failure = function () {
      start();
      equal(2000, 2000);
    };
    $.idealPostcodes.checkKey({
      api_key: "idd"
    }, success, failure);
  });

}(jQuery));
