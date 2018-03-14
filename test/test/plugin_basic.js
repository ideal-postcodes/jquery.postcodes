(function($) {
  "use strict";
  var apiKey = $.idealKey;
  var $input_field;
  var $lookup_button;
  var $dropdown;
  var defaults = $.idealPostcodes.defaults();

  var isPresent = function (elemName, elemId) {
    notEqual($("#" + elemId).length, 0, "has " + elemName);
  };

  var isNotPresent = function (elemName, elemId) {
    equal($("#" + elemId).length, 0, "has no " + elemName);
  };

  module("jQuery#setupPostcodeLookup", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: "api_key",
        disable_interval: 0
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

  test("#setupPostcodeLookup creates necessary elements for postcode lookup", 6, function () {
    ok($input_field.length, "there appears to be an input");
    ok($lookup_button.length, "there appears to be button");
    strictEqual($lookup_button.html(), defaults.button_label,"button has correct labeling");
    strictEqual($input_field.val(), defaults.input_label,"input has correct labeling");
    $.when($input_field.triggerHandler("focus")).done(function () {
      strictEqual($input_field.val(), "","input responds correctly when clicked on");
      $.when($input_field.triggerHandler("blur")).done(function () {
        strictEqual($input_field.val(), defaults.input_label, "input responds correctly when defocused with no input");
      });
    });
  });

  module("Postcode Lookups: Basic Case", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        },
        onSearchError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      $(document).off("completedJsonp");
    }
  });

  asyncTest("Address options are presented after a successful postcode lookup", 7, function () {
    $input_field.val("ID11QD");
    equal($lookup_button.prop("disabled"), false, "initial lookup button not disabled");
    $(document).on("completedJsonp", function () {
      start();
      equal($lookup_button.prop("disabled"), false, "lookup button not disabled after click");
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      strictEqual($dropdown.children("option[value=ideal]").text(), defaults.dropdown_select_message, "it has the correct display text");
      $dropdown.val("5").trigger("change"); // Select 3 lined output
      var addressLines = [defaults.output_fields.line_1, defaults.output_fields.post_town, defaults.output_fields.postcode];
      for (var i = 0; i < addressLines.length; i++) {
        ok($(addressLines[i]).val(), addressLines[i] + " has content");
      }
    });
    $lookup_button.trigger("click");
  });
  
  asyncTest("Postcode lookup cleanup", 8, function () {
    $input_field.val("ID11QD");
    equal($lookup_button.prop("disabled"), false, "initial lookup button not disabled");
    $(document).on("completedJsonp", function () {
      start();
      isPresent("default input box", defaults.input_id);
      isPresent("dropdown menu", defaults.dropdown_id);
      isPresent("default lookup button", defaults.button_id);
      equal($lookup_button.prop("disabled"), false, "lookup button not disabled after click");
      $.idealPostcodes.clearAll();
      isNotPresent("default input box", defaults.input_id);
      isNotPresent("dropdown menu", defaults.dropdown_id);
      isNotPresent("default lookup button", defaults.button_id);
    });
    $lookup_button.trigger("click");
  });
  
  asyncTest("Postcode not found result", 4, function () {
    $input_field.val("ID11QE");
    equal($lookup_button.prop("disabled"), false, "initial lookup button not disabled");
    $(document).on("completedJsonp", function () {
      start();
      equal($lookup_button.prop("disabled"), false, "lookup button not disabled after click");
      ok($("#" + defaults.error_message_id).length, "it has an error message");
      strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
    });
    $lookup_button.trigger("click");
  });

  asyncTest("Postcode lookup should be triggered by enter key in input box", 5, function () {
    $input_field.val("ID11QD");
    equal($lookup_button.prop("disabled"), false, "initial lookup button not disabled");
    var e = $.Event("keypress");
    e.which = 13;
    $(document).on("completedJsonp", function () {
      start();
      isPresent("default input box", defaults.input_id);
      isPresent("dropdown menu", defaults.dropdown_id);
      isPresent("default lookup button", defaults.button_id);
      equal($lookup_button.prop("disabled"), false, "lookup button not disabled after click");
    });
    $input_field.trigger(e);
  });

  asyncTest("Lookup with invalid postcode", 5, function () {
    $input_field.val("ID11QE");
    equal($lookup_button.prop("disabled"), false, "initial lookup button not disabled");
    $(document).on("completedJsonp", function () {
      start();
      isPresent("default input box", defaults.input_id);
      isPresent("default lookup button", defaults.button_id);
      isPresent("error message", defaults.error_message_id);
      equal($lookup_button.prop("disabled"), false, "lookup button not disabled after click");
    });
    $lookup_button.trigger("click");
  });

  module("Passing pre-initialisation check", { 
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

  test("has postcode lookup tools setup", 6, function () {
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

  module("Failing pre-initialisation check", { 
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

  module("Sublicensee: Pre-initialisation check", { 
    setup: function () {
      stop();
      var startTests = function () {
        $input_field = $("#"+defaults.input_id);
        $lookup_button = $("#"+defaults.button_id);
        start();
      };
      $("#postcode_lookup_field").setupPostcodeLookup({
        // Test key which will return false
        api_key: "iddlicensees",
        licensee: "testlicensee",
        check_key: true,
        disable_interval: 0,
        onFailedCheck: startTests,
        onLoaded: startTests
      });
    } 
  });

  test("has postcode lookup tools setup", 2, function () {
    equal($input_field.length, 1, "there is postcode input");
    equal($lookup_button.length, 1, "there is button");
  });

  module("Custom endpoint", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        endpoint: "http://api.ideal-postcodes.co.uk/v1",
        disable_interval: 0,
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        },
        onSearchError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      $(document).off("completedJsonp");
    }
  });

  asyncTest("Requests resolve custom API endpoint", 1, function () {
    $input_field.val("ID11QD");
    $(document).on("completedJsonp", function () {
      start();
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
    });
    $lookup_button.trigger("click");
  });

  module("Custom endpoint with address search", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        endpoint: "http://api.ideal-postcodes.co.uk/v1",
        address_search: true,
        disable_interval: 0,
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        },
        onSearchError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      $(document).off("completedJsonp");
    }
  });

  asyncTest("Requests resolve custom API endpoint", 1, function () {
    $input_field.val("10 Downing Street London");
    $(document).on("completedJsonp", function () {
      start();
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
    });
    $lookup_button.trigger("click");
  });

}(jQuery));
