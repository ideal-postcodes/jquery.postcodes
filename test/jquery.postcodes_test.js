var log = [];
// var testName = "jquery.postcodes test";

QUnit.done(function (test_results) {
  var tests = [];
  for(var i = 0, len = log.length; i < len; i++) {
    var details = log[i];
    tests.push({
      name: details.name,
      result: details.result,
      expected: details.expected,
      actual: details.actual,
      source: details.source
    });
  }
  test_results.tests = tests;

  window.global_test_results = test_results;
});
QUnit.testStart(function(testDetails){
  QUnit.log = function(details){
    if (!details.result) {
      details.name = testDetails.name;
      log.push(details);
    }
  };
});

(function($) {
  "use strict";

  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  var $input_field;
  var $lookup_button;
  var $dropdown;
  var inputId;
  var buttonId;
  var defaults = $.idealPostcodes.defaults;
  var apiKey = "iddqd";

  var isPresent = function (elemName, elemId) {
    notEqual($("#" + elemId).length, 0, "has " + elemName);
  };

  var isNotPresent = function (elemName, elemId) {
    equal($("#" + elemId).length, 0, "has no " + elemName);
  };

  /*
   * Class Method Tests
   *
   */

  module("Class Methods");

  test("$.idealPostcodes.validatePostcodeFormat", 5, function () {
    equal($.idealPostcodes.validatePostcodeFormat("ID11QD"), true);
    equal($.idealPostcodes.validatePostcodeFormat("id11qd"), true);
    equal($.idealPostcodes.validatePostcodeFormat("id1 1qd"), true);
    equal($.idealPostcodes.validatePostcodeFormat("ID1 1QD"), true);
    equal($.idealPostcodes.validatePostcodeFormat("IDDQD"), false);
  });

  asyncTest("$.idealPostcodes.lookupPostcode should lookup a postcode", 3, function () {
    var success = function (data) {
      start();
      equal(data.code, 2000, "should return 2000 for valid postcode");
      notEqual(data.result.length, 0, "should return an array of addresses");
      equal(data.result[0].postcode, "ID1 1QD", "should contain relevant addresses");
    };
    $.idealPostcodes.lookupPostcode("ID11QD", apiKey, success);
  });

  asyncTest("$.idealPostcodes.lookupPostcode should return an empty response if postcode not found", 2, function () {
    var success = function (data) {
      start();
      equal(data.code, 4040, "should return code 4040 for invalid postcode");
      equal(data.result, undefined, "Postcode should not be defined");
    };
    $.idealPostcodes.lookupPostcode("ID1KFA", apiKey, success);
  });

  asyncTest("$.idealPostcodes.checkKey should return true if key is usable", 1, function () {
    var success = function () {
      start();
      // Hack: Callback needs to be invoked
      equal(2000, 2000);
    };
    var failure = function () {
      start();
    };
    $.idealPostcodes.checkKey("iddqd", success, failure);
  });

  asyncTest("$.idealPostcodes.checkKey should return false if key is not usable", 1, function () {
    var success = function () {
      start();
    };
    var failure = function () {
      start();
      // Hack: Callback needs to be invoked
      equal(2000, 2000);
    };
    $.idealPostcodes.checkKey("idkfa", success, failure);
  });

  /*
   * Plugin Initialisation and Usage Tests
   *
   */

  module("jQuery#setupPostcodeLookup", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: "api_key",
        disable_interval: 0
      });
      defaults = $.idealPostcodes.defaults();
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

  asyncTest("#setupPostcodeLookup creates necessary elements for postcode lookup", 6, function () {
    ok($input_field.length, "there appears to be an input");
    ok($lookup_button.length, "there appears to be button");
    strictEqual($lookup_button.html(), defaults.button_label,"button has correct labeling");
    strictEqual($input_field.val(), defaults.input_label,"input has correct labeling");
    $.when($input_field.triggerHandler("focus")).done(function () {
      strictEqual($input_field.val(), "","input responds correctly when clicked on");
      $.when($input_field.triggerHandler("blur")).done(function () {
        strictEqual($input_field.val(), defaults.input_label, "input responds correctly when defocused with no input");
        start();
      });
    });
  });

  module("Postcode Lookups: Basic Case", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onLookupSuccess: function () {
          $.event.trigger("completedJsonp");
        },
        onLookupError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

 test("Postcode entries are validated before submission", 2, function () {
    $input_field.val("BOGUSPOSTCODE");
    $lookup_button.trigger("click");
    ok($("#" + defaults.error_message_id).length, "it has an error message");
    strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_invalid_postcode,"it has the correct error message");
  }); 


  asyncTest("Address options are presented after a successful postcode lookup", 7, function () {
    $input_field.val("ID11QD");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      strictEqual($dropdown.children("option[value=ideal]").text(), defaults.dropdown_select_message, "it has the correct display text");
      $dropdown.val("5").trigger("change"); // Select 3 lined output
      var addressLines = [defaults.output_fields.line_1, defaults.output_fields.post_town, defaults.output_fields.postcode];
      for (var i = 0; i < addressLines.length; i++) {
        ok($(addressLines[i]).val(), addressLines[i] + " has content");
      }
    });
  });
  
  asyncTest("Postcode lookup cleanup", 8, function () {
    $input_field.val("ID11QD");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      isPresent("default input box", defaults.input_id);
      isPresent("dropdown menu", defaults.dropdown_id);
      isPresent("default lookup button", defaults.button_id);
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      $.idealPostcodes.clearAll();
      isNotPresent("default input box", defaults.input_id);
      isNotPresent("dropdown menu", defaults.dropdown_id);
      isNotPresent("default lookup button", defaults.button_id);
    });
  });
  
  asyncTest("Postcode not found result", 4, function () {
    $input_field.val("ID11QE");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      ok($("#" + defaults.error_message_id).length, "it has an error message");
      strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
    });
  });

  asyncTest("Postcode lookup should be triggered by enter key in input box", 5, function () {
    $input_field.val("ID11QD");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    var e = $.Event("keypress");
    e.which = 13;
    $input_field.trigger(e);

    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      isPresent("default input box", defaults.input_id);
      isPresent("dropdown menu", defaults.dropdown_id);
      isPresent("default lookup button", defaults.button_id);
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
    });
  });

  test("Lookup with invalid postcode caught by regexp", 5, function () {
    $input_field.val("asd");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    isPresent("default input box", defaults.input_id);
    isPresent("default lookup button", defaults.button_id);
    isPresent("error message", defaults.error_message_id);
    equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
    // Check button is enabled
  });


  asyncTest("Lookup with invalid postcode", 5, function () {
    $input_field.val("ID11QE");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      isPresent("default input box", defaults.input_id);
      isPresent("default lookup button", defaults.button_id);
      isPresent("error message", defaults.error_message_id);
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
    });
  });

  module("Postcode Lookups: Custom Input Field", { 
    setup: function () {
      inputId = "customInput";
      $("<input />", {
        id: inputId
      })
      .appendTo($("#qunit-fixture"));
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        input: "#" + inputId,
        disable_interval: 0,
        onLookupSuccess: function () {
          $.event.trigger("completedJsonp");
        },
        onLookupError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+inputId);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

  test("Lookup elements are setup correctly", 4, function () {
    isNotPresent("default input box", defaults.input_id);
    isPresent("custom input box", inputId);
    isPresent("default lookup button", defaults.button_id);
    isNotPresent("error message", defaults.error_message_id);
  });

  asyncTest("Successful Postcode Lookup", 7, function () {
    $input_field.val("ID11QD");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      strictEqual($dropdown.children("option[value=ideal]").text(), defaults.dropdown_select_message, "it has the correct display text");
      $dropdown.val("5").trigger("change"); // Select 3 lined output
      var addressLines = [defaults.output_fields.line_1, defaults.output_fields.post_town, defaults.output_fields.postcode];
      for (var i = 0; i < addressLines.length; i++) {
        ok($(addressLines[i]).val(), addressLines[i] + " has content");
      }
    });
  });

  asyncTest("Lookup with invalid postcode", 4, function () {
    $input_field.val("ID11QE");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      isPresent("error message", defaults.error_message_id);
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
    });
  });

  test("Invalid postcode caught by regexp", 3, function () {
    $input_field.val("asd");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    isPresent("error message", defaults.error_message_id);
    equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
  });


  module("Postcode Lookups: Custom Lookup Trigger", { 
    setup: function () {
      buttonId = "customInput";
      $("<a />", {
        id: buttonId,
        href: ""
      })
      .appendTo($("#qunit-fixture"));
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        button: "#" + buttonId,
        disable_interval: 0,
        onLookupSuccess: function () {
          $.event.trigger("completedJsonp");
        },
        onLookupError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+buttonId);
    } 
  });

  test("Lookup elements are setup correctly", 4, function () {
    isPresent("default input box", defaults.input_id);
    isPresent("custom lookup trigger", buttonId);
    isNotPresent("default lookup button", defaults.button_id);
    isNotPresent("error message", defaults.error_message_id);
  });


  asyncTest("Successful Postcode Lookup", 5, function () {
    $input_field.val("ID11QD");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      strictEqual($dropdown.children("option[value=ideal]").text(), defaults.dropdown_select_message, "it has the correct display text");
      $dropdown.val("5").trigger("change"); // Select 3 lined output
      var addressLines = [defaults.output_fields.line_1, defaults.output_fields.post_town, defaults.output_fields.postcode];
      for (var i = 0; i < addressLines.length; i++) {
        ok($(addressLines[i]).val(), addressLines[i] + " has content");
      }
    });
  });

  asyncTest("Lookup with invalid postcode", 2, function () {
    $input_field.val("ID11QE");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      isPresent("error message", defaults.error_message_id);
      strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
    });
  });

  test("Invalid postcode caught by regexp", 1, function () {
    $input_field.val("asd");
    $lookup_button.trigger("click");
    isPresent("error message", defaults.error_message_id);
  });

  module("jQuery#setupPostcodeLookup with passing pre-initialisation check", { 
    setup: function () {
      stop();
      $("#postcode_lookup_field").setupPostcodeLookup({
        // Test key which will return true
        api_key: "iddqd",
        check_key: true,
        disable_interval: 0,
        onLoaded: function () {
          $input_field = $("#"+defaults.input_id);
          $lookup_button = $("#"+defaults.button_id);
          start();
        }
      });
    } 
  });

  asyncTest("has postcode lookup tools setup", 6, function () {
    start();
    ok($input_field.length, "there is an input field");
    ok($lookup_button.length, "there is a lookup button");
    strictEqual($lookup_button.html(), defaults.button_label, "button has correct labeling");
    strictEqual($input_field.val(), defaults.input_label, "input has correct labeling");
    $.when($input_field.triggerHandler("focus")).done(function () {
      strictEqual($input_field.val(), "","input responds correctly when clicked on");
      $.when($input_field.triggerHandler("blur")).done(function () {
        strictEqual($input_field.val(), defaults.input_label, "input responds correctly when defocused with no input");
      });
    });
  });

  module("jQuery#setupPostcodeLookup with failing pre-initialisation check", { 
    setup: function () {
      stop();
      $("#postcode_lookup_field").setupPostcodeLookup({
        // Test key which will return false
        api_key: "idkfa",
        check_key: true,
        disable_interval: 0,
        onFailedCheck: function () {
          $input_field = $("#"+defaults.input_id);
          $lookup_button = $("#"+defaults.button_id);
          start();
        }
      });
    } 
  });

  test("has no postcode lookup tools setup", 2, function () {
    equal($input_field.length, 0, "there is no postcode input");
    equal($lookup_button.length, 0, "there is no button");
  });

  module("onLoaded Callback Test", {
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onLoaded: function () {
          $(this).addClass("myNewRandomClass");
        }
      });
    } 
  });

  test("onLoaded callback should work", 2, function () {
    var $widget = $(".myNewRandomClass");
    equal($widget.length, 1);
    equal($widget[0].id, "postcode_lookup_field");
  });

  module("onLookupSuccess and onAddressSelected Callback Test", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onLookupSuccess: function (data) {
          $.event.trigger("completedJsonp", [data]);
        },
        onAddressSelected: function (selectedData) {
          $.event.trigger("addressSelected", [selectedData]);
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

  asyncTest("onLookupSuccess and onAddressSelected triggered by postcode lookup callback and clicking on an address respectively", 1, function () {
    $input_field.val("ID11QD");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function (e, data) {
      $(document).off("addressSelected").on("addressSelected", function (e, selectedData) {
        start();
        deepEqual(data.result[2], selectedData);
      });
      $("#idpc_dropdown").val(2).trigger("change");
    });
  });
  
}(jQuery));
