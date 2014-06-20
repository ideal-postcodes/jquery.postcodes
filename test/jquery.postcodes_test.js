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

  module('idealPostcodes.validatePostcodeFormat');

  test('correctly ascertains validity of submitted postcode format', 5, function () {
    equal($.idealPostcodes.validatePostcodeFormat('ID11QD'), true);
    equal($.idealPostcodes.validatePostcodeFormat('id11qd'), true);
    equal($.idealPostcodes.validatePostcodeFormat('id1 1qd'), true);
    equal($.idealPostcodes.validatePostcodeFormat('ID1 1QD'), true);
    equal($.idealPostcodes.validatePostcodeFormat('IDDQD'), false);
  });

  module('jQuery#setupPostcodeLookup', { 
    setup: function () {
      $.idealPostcodes.setup({
        api_key: 'api_key',
        disable_interval: 0
      });
      $('#postcode_lookup_field').setupPostcodeLookup();
      defaults = $.idealPostcodes.defaults();
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

  test('has postcode input box', 6, function () {
    ok($input_field.length, "there appears to be an input");
    ok($lookup_button.length, "there appears to be button");
    strictEqual($lookup_button.html(), defaults.button_label,"button has correct labeling");
    strictEqual($input_field.val(), defaults.input_label,"input has correct labeling");
    $input_field.trigger("focus");
    strictEqual($input_field.val(), "","input responds correctly when clicked on");
    $input_field.trigger("blur");
    strictEqual($input_field.val(), defaults.input_label, "input responds correctly when defocused with no input");
  });

  test('postcode validation', 2, function () {
    $input_field.val("BOGUSPOSTCODE");
    $lookup_button.trigger("click");
    ok($("#" + defaults.error_message_id).length, "it has an error message");
    strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_invalid_postcode,"it has the correct error message");
  }); 

  module("Postcode lookups", { 
    setup: function () {
      $.idealPostcodes.setup({
        api_key: apiKey,
        disable_interval: 0,
        onLookupSuccess: function () {
          $.event.trigger("completedJsonp");
        },
        onLookupError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $('#postcode_lookup_field').setupPostcodeLookup();
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

  asyncTest('successful postcode lookup', 7, function () {
    $input_field.val("ID11QD");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      strictEqual($dropdown.children('option[value=ideal]').text(), defaults.dropdown_select_message, "it has the correct display text");
      $dropdown.val("5").trigger("change"); // Select 3 lined output
      [defaults.output_fields.line_1, defaults.output_fields.post_town, defaults.output_fields.postcode].forEach(function (elem) {
        ok($(elem).val(), elem + " has content");
      });
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
  
  asyncTest('Postcode not found result', 4, function () {
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

  asyncTest("Postcode lookup should be triggered by enter key in input box", 8, function () {
    $input_field.val("ID11QD");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    var e = $.Event('keypress');
    e.which = 13;
    $input_field.trigger(e);

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

  test("Lookup with invalid postcode caught by regexp", 9, function () {
    $input_field.val("asd");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    isPresent("default input box", defaults.input_id);
    isPresent("default lookup button", defaults.button_id);
    isPresent("error message", defaults.error_message_id);
    equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
    // Check button is enabled
    $.idealPostcodes.clearAll();
    isNotPresent("default input box", defaults.input_id);
    isNotPresent("dropdown menu", defaults.dropdown_id);
    isNotPresent("default lookup button", defaults.button_id);
    isNotPresent("error message", defaults.error_message_id);
  });


  asyncTest("Lookup with invalid postcode", 9, function () {
    $input_field.val("ID11QE");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      isPresent("default input box", defaults.input_id);
      isPresent("default lookup button", defaults.button_id);
      isPresent("error message", defaults.error_message_id);
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      $.idealPostcodes.clearAll();
      isNotPresent("default input box", defaults.input_id);
      isNotPresent("dropdown menu", defaults.dropdown_id);
      isNotPresent("default lookup button", defaults.button_id);
      isNotPresent("error message", defaults.error_message_id);
    });
  });

  module("Postcode lookups with custom input field", { 
    setup: function () {
      inputId = "customInput";
      $("<input />", {
        id: inputId
      })
      .appendTo($("#qunit-fixture"));
      $.idealPostcodes.setup({
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
      $('#postcode_lookup_field').setupPostcodeLookup();
      $input_field = $("#"+inputId);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

  asyncTest('successful postcode lookup', 8, function () {
    $input_field.val("ID11QD");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    equal($("#" + defaults.input_id).length, 0, "has no default input box");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      strictEqual($dropdown.children('option[value=ideal]').text(), defaults.dropdown_select_message, "it has the correct display text");
      $dropdown.val("5").trigger("change"); // Select 3 lined output
      [defaults.output_fields.line_1, defaults.output_fields.post_town, defaults.output_fields.postcode].forEach(function (elem) {
        ok($(elem).val(), elem + " has content");
      });
    });
  });
  
  asyncTest('Postcode not found result', 4, function () {
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

  test("Lookup with invalid postcode caught by regexp", 11, function () {
    $input_field.val("asd");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    isNotPresent("default input box", defaults.input_id);
    isPresent("custom input box", inputId);
    isPresent("default lookup button", defaults.button_id);
    isPresent("error message", defaults.error_message_id);
    equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
    $.idealPostcodes.clearAll();
    isNotPresent("default input box", defaults.input_id);
    isNotPresent("custom input box", inputId);
    isNotPresent("dropdown menu", defaults.dropdown_id);
    isNotPresent("default lookup button", defaults.button_id);
    isNotPresent("error message", defaults.error_message_id);
  });


  asyncTest("Lookup with invalid postcode", 11, function () {
    $input_field.val("ID11QE");
    equal($("#" + defaults.button_id).prop("disabled"), false, "initial lookup button not disabled");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      isNotPresent("default input box", defaults.input_id);
      isPresent("custom input box", inputId);
      isPresent("default lookup button", defaults.button_id);
      isPresent("error message", defaults.error_message_id);
      equal($("#" + defaults.button_id).prop("disabled"), false, "lookup button not disabled after click");
      $.idealPostcodes.clearAll();
      isNotPresent("default input box", defaults.input_id);
      isNotPresent("custom input box", inputId);
      isNotPresent("dropdown menu", defaults.dropdown_id);
      isNotPresent("default lookup button", defaults.button_id);
      isNotPresent("error message", defaults.error_message_id);
    });
  });

  module("Postcode lookups with custom button", { 
    setup: function () {
      buttonId = "customInput";
      $('<a />', {
        id: buttonId,
        href: ""
      })
      .appendTo($("#qunit-fixture"));
      $.idealPostcodes.setup({
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
      $('#postcode_lookup_field').setupPostcodeLookup();
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+buttonId);
    } 
  });

  asyncTest('successful postcode lookup', 5, function () {
    $input_field.val("ID11QD");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      strictEqual($dropdown.children('option[value=ideal]').text(), defaults.dropdown_select_message, "it has the correct display text");
      $dropdown.val("5").trigger("change"); // Select 3 lined output
      [defaults.output_fields.line_1, defaults.output_fields.post_town, defaults.output_fields.postcode].forEach(function (elem) {
        ok($(elem).val(), elem + " has content");
      });
    });
  });
  
  asyncTest('Postcode not found result', 2, function () {
    $input_field.val("ID11QE");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      ok($("#" + defaults.error_message_id).length, "it has an error message");
      strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
    });
  });

  test("Lookup with invalid postcode caught by regexp", 8, function () {
    $input_field.val("asd");
    $lookup_button.trigger("click");
    isPresent("default input box", defaults.input_id);
    isNotPresent("default lookup button", defaults.button_id);
    isPresent("custom lookup button", buttonId);
    isPresent("error message", defaults.error_message_id);
    // Check button is enabled
    $.idealPostcodes.clearAll();
    isNotPresent("default input box", defaults.input_id);
    isNotPresent("default lookup button", defaults.button_id);
    isNotPresent("custom lookup button", buttonId);
    isNotPresent("error message", defaults.error_message_id);
  });


  asyncTest("Lookup with invalid postcode", 8, function () {
    $input_field.val("ID11QE");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      isPresent("default input box", defaults.input_id);
      isNotPresent("default lookup button", defaults.button_id);
      isPresent("custom lookup button", buttonId);
      isPresent("error message", defaults.error_message_id);
      $.idealPostcodes.clearAll();
      isNotPresent("default input box", defaults.input_id);
      isNotPresent("default lookup button", defaults.button_id);
      isNotPresent("custom lookup button", buttonId);
      isNotPresent("error message", defaults.error_message_id);
    });
  });

  module("Callbacks to postcode lookup", { 
    setup: function () {
      $.idealPostcodes.setup({
        api_key: apiKey,
        disable_interval: 0,
        onLookupSuccess: function (data) {
          $.event.trigger("completedJsonp", [data]);
        },
        onAddressSelected: function (selectedData) {
          $.event.trigger("addressSelected", [selectedData]);
        }
      });
      $('#postcode_lookup_field').setupPostcodeLookup();
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    } 
  });

  asyncTest("Postcode lookup triggering onLookupSuccess callback", 1, function () {
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

  module('$.lookupPostcode');

  asyncTest('Successful postcode lookup', 3, function () {
    var success = function (data) {
      start();
      equal(data.code, 2000);
      notEqual(data.result.length, 0);
      notEqual(data.result[0].postcode, "ID11QD");
    };
    $.idealPostcodes.lookupPostcode("ID11QD", apiKey, success);
  });

}(jQuery));
