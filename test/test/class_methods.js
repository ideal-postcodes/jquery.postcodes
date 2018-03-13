(function($) {
  "use strict";
  var apiKey = $.idealKey;
  var defaults = $.idealPostcodes.defaults();

  module("$.idealPostcodes.lookupPostcode");

  asyncTest("lookup a postcode", 4, function () {
    $.idealPostcodes.lookupPostcode({ 
      query: "ID11QD", 
      api_key: apiKey
    }, function (error, addresses, raw) {
      start();
      equal(error, null, "should not return an error");
      notEqual(addresses.length, 0, "should return an array of addresses");
      equal(addresses[0].postcode, "ID1 1QD", "should contain relevant addresses");
      equal(raw.code, 2000);
    });
  });

  asyncTest("accepts `postcode` as query attribute", 4, function () {
    $.idealPostcodes.lookupPostcode({ 
      postcode: "ID11QD", 
      api_key: apiKey
    }, function (error, addresses, raw) {
      start();
      equal(error, null, "should not return an error");
      notEqual(addresses.length, 0, "should return an array of addresses");
      equal(addresses[0].postcode, "ID1 1QD", "should contain relevant addresses");
      equal(raw.code, 2000);
    });
  });

  asyncTest("returns empty response if postcode not found", 3, function () {
    $.idealPostcodes.lookupPostcode({
      query: "ID1KFA", 
      api_key: apiKey
    }, function (error, addresses, raw) {
      start();
      equal(error, null, "should not return an error");
      equal(addresses.length, 0, "No addresses found");
      equal(raw.code, 4040);
    });
  });

  asyncTest("returns an error if no lookups remaining", 4, function () {
    $.idealPostcodes.lookupPostcode({
      query: "ID1CLIP", 
      api_key: apiKey
    }, function (error, addresses, raw) {
      start();
      notEqual(error, null, "should return an error");
      ok(error.message.match(/^4020/));
      equal(addresses.length, 0, "No addresses found");
      equal(raw.code, 4020);
    });
  });

  asyncTest("returns an error if limit reached", 4, function () {
    $.idealPostcodes.lookupPostcode({
      query: "ID1CHOP", 
      api_key: apiKey
    }, function (error, addresses, raw) {
      start();
      notEqual(error, null, "should return an error");
      ok(error.message.match(/^4021/));
      equal(addresses.length, 0, "No addresses found");
      equal(raw.code, 4021);
    });
  });

  asyncTest("accepts tags", 4, function () {
    $.idealPostcodes.lookupPostcode({
      query: "ID11QD", 
      api_key: apiKey,
      tags: ["foo", "bar"]
    }, function (error, addresses, raw) {
      start();
      equal(error, null, "should not return an error");
      notEqual(addresses.length, 0, "should return an array of addresses");
      equal(addresses[0].postcode, "ID1 1QD", "should contain relevant addresses");
      equal(raw.code, 2000);
    });
  });

  asyncTest("accepts licensees", 4, function () {
    $.idealPostcodes.lookupPostcode({
      query: "ID11QD", 
      api_key: apiKey,
      licensee: "testlicensee"
    }, function (error, addresses, raw) {
      start();
      equal(error, null, "should not return an error");
      notEqual(addresses.length, 0, "should return an array of addresses");
      equal(addresses[0].postcode, "ID1 1QD", "should contain relevant addresses");
      equal(raw.code, 2000);
    });
  });

  asyncTest("accepts custom endpoint", 4, function () {
    $.idealPostcodes.lookupPostcode({
      query: "ID11QD", 
      api_key: apiKey,
      endpoint: "http://api.ideal-postcodes.co.uk/v1"
    }, function (error, addresses, raw) {
      start();
      equal(error, null, "should not return an error");
      notEqual(addresses.length, 0, "should return an array of addresses");
      equal(addresses[0].postcode, "ID1 1QD", "should contain relevant addresses");
      equal(raw.code, 2000);
    });
  });

  module("$.idealPostcodes.lookupAddress");

  asyncTest("returns an address search", 5, function () {
    $.idealPostcodes.lookupAddress({
      query: "ID1 1QD",
      api_key: apiKey
    }, function (error, addresses, data) {
      start();
      equal(error, null, "does not return an error");
      equal(addresses.length, 7, "returns addresses");
      equal(data.code, 2000, "returns 2000 for valid search query");
      equal(data.result.total, 7);
      equal(data.result.hits[0].postcode, "ID1 1QD", "should contain relevant addresses");
    });
  });

  asyncTest("accepts tags", 5, function () {
    $.idealPostcodes.lookupAddress({
      query: "ID1 1QD",
      api_key: apiKey,
      tags: ["foo", "bar"]
    }, function (error, addresses, data) {
      start();
      equal(error, null, "does not return an error");
      equal(addresses.length, 7, "returns addresses");
      equal(data.code, 2000, "returns 2000 for valid search query");
      equal(data.result.total, 7);
      equal(data.result.hits[0].postcode, "ID1 1QD", "should contain relevant addresses");
    });
  });

  asyncTest("returns an address search", 5, function () {
    $.idealPostcodes.lookupAddress({
      query: "10 Downing Street London",
      api_key: apiKey
    }, function (error, addresses, data) {
      start();
      equal(error, null, "does not return an error");
      equal(addresses.length, 2, "returns addresses");
      equal(data.code, 2000, "returns 2000 for valid search query");
      equal(data.result.total, 2);
      equal(data.result.hits[0].postcode, "SW1A 2AA", "should contain relevant addresses");
    });
  });

  asyncTest("returns an empty result if no matches", 4, function () {
    $.idealPostcodes.lookupAddress({
      query: "ID1 KFA",
      api_key: apiKey
    }, function (error, addresses, data) {
      start();
      equal(error, null, "does not return error");
      equal(addresses.length, 0, "returns empty array");
      equal(data.code, 2000, "should return 2000 for valid search query");
      equal(data.result.total, 0);
    });
  });

  asyncTest("is sensitive to limits", 4, function () {
    $.idealPostcodes.lookupAddress({
      query: "Test Limit",
      api_key: apiKey,
      limit: 20
    }, function (error, addresses, data) {
      start();
      equal(error, null, "does not return error");
      equal(addresses.length, 20, "returns list of addresses");
      equal(data.code, 2000, "should return 2000 for valid search query");
      equal(data.result.hits.length, 20);
    });
  });

  asyncTest("returns an error if no lookups remaining", 4, function () {
    $.idealPostcodes.lookupAddress({
      query: "ID1 CLIP",
      api_key: apiKey
    }, function (error, addresses, data) {
      start();
      notEqual(error, null, "returns an error");
      equal(data.code, 4020, "API returns an error");
      ok(error.message.match(/^4020/));
      equal(addresses.length, 0);
    });
  });

  asyncTest("returns an error if lookup limit reached", 4, function () {
    $.idealPostcodes.lookupAddress({
      query: "ID1 CHOP",
      api_key: apiKey
    }, function (error, addresses, data) {
      start();
      notEqual(error, null, "returns an error");
      equal(data.code, 4021, "API returns an error");
      ok(error.message.match(/^4021/));
      equal(addresses.length, 0);
    });
  });

  asyncTest("accepts licensee", 3, function () {
    $.idealPostcodes.lookupAddress({
      query: "Test Licensee",
      api_key: apiKey,
      licensee: "testlicensee",
      limit: 7
    }, function (error, addresses, data) {
      start();
      equal(error, null, "does not return an error");
      equal(addresses.length, 7, "returns addresses");
      equal(data.code, 2000, "returns 2000 for valid search query");
    });
  });

  asyncTest("accepts custom endpoint", 5, function () {
    $.idealPostcodes.lookupAddress({
      query: "ID1 1QD",
      api_key: apiKey,
      endpoint: "http://api.ideal-postcodes.co.uk/v1",
    }, function (error, addresses, data) {
      start();
      equal(error, null, "does not return an error");
      equal(addresses.length, 7, "returns addresses");
      equal(data.code, 2000, "returns 2000 for valid search query");
      equal(data.result.total, 7);
      equal(data.result.hits[0].postcode, "ID1 1QD", "should contain relevant addresses");
    });
  });

  module("$.idealPostcodes.checkKey");

  asyncTest("returns true if key is usable and cache result", 2, function () {
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

  asyncTest("returns false if key is not usable and cache result", 2, function () {
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

  asyncTest("returns false if invalid response is returned and clear the cache", 1, function () {
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

  asyncTest("accepts licensee argument", 1, function () {
    var success = function () {
      equal(2000, 2000);
      start();
    };
    var failure = function () {
      start();
    };
    $.idealPostcodes.checkKey({
      api_key: "idklicensees",
      licensee: "testlicensee"
    }, success, failure);
  });

  asyncTest("accepts custom endpoint", 2, function () {
    var success = function () {
      equal(2000, 2000);
      equal($.idealPostcodes.keyCheckCache["iddqd"], true, "Successful result is cached");
      start();
    };
    var failure = function () {
      start();
    };
    $.idealPostcodes.checkKey({
      api_key: "iddqd",
      endpoint: "http://api.ideal-postcodes.co.uk/v1"
    }, success, failure);
  });

  var formatter; 
  var expected;
  var address = {
    "line_1": "Prime Minister & First Lord Of The Treasury",
    "line_2": "10 Downing Street",
    "post_town": "LONDON",
    "postcode_outward": "SW1A",
    "postcode": "SW1A 2AA"
  };

  module("Address Formatter: Postcode Search", {
    setup: function () {
      formatter = defaults.address_formatters.postcode_search;
    }
  });

  test("Returns a properly formatted address", 1, function () {
    // expected = [address.line_1, address.line_2].join(", ");
    expected = "Prime Minister & First Lord Of The Treasury 10 Downing Street";
    equal(formatter(address), expected);
  });

  module("Address Formatter: Address Search", {
    setup: function () {
      formatter = defaults.address_formatters.address_search;
    }
  });

  test("Returns a properly formatted address", 1, function () {
    // expected = [address.line_1, address.line_2, address.post_town, adddress.postcode_outward].join(", ");
    expected = "Prime Minister & First Lord Of The Treasury, 10 Downing Street, LONDON, SW1A";
    equal(formatter(address), expected);
  });

}(jQuery));
