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
  var $input_field, $lookup_button, $dropdown, setup,
      defaults = $.idealPostcodes.defaults;

  module('idealPostcodes.validatePostcodeFormat');

  test('correctly ascertains validity of submitted postcode format', 5, function () {
    equal($.idealPostcodes.validatePostcodeFormat('ID11QD'), true);
    equal($.idealPostcodes.validatePostcodeFormat('id11qd'), true);
    equal($.idealPostcodes.validatePostcodeFormat('id1 1qd'), true);
    equal($.idealPostcodes.validatePostcodeFormat('ID1 1QD'), true);
    equal($.idealPostcodes.validatePostcodeFormat('IDDQD'), false);
  });

  setup = function () {
    $.idealPostcodes.setup({
      api_key: 'api_key',
      disable_interval: 0
    });
    $('#postcode_lookup_field').setupPostcodeLookup();
    defaults = $.idealPostcodes.defaults();
    $input_field = $("#"+defaults.input_id);
    $lookup_button = $("#"+defaults.button_id);
  };

  module('jQuery#setupPostcodeLookup', { setup: setup });

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


  /*
  *
  *  Everything below this point requires an API key to work as it connects
  *  with the Ideal Postcodes API
  *
  */

  //  Requires a functioning api key. This will not consume any lookups

  var api_key = "ak_hokks5b8iVnsbg1HisZ2IPSjCSZih";

  setup = function () {
    $.idealPostcodes.setup({
      api_key: api_key,
      disable_interval: 0
    });
    $('#postcode_lookup_field').setupPostcodeLookup();
    $input_field = $("#"+defaults.input_id);
    $lookup_button = $("#"+defaults.button_id);
  };

  module("Postcode lookups", { setup: setup });

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
  
  asyncTest("Postcode lookup cleanup", 6, function () {
    $input_field.val("ID11QD");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      notEqual($("#" + defaults.input_id).length, 0);
      notEqual($("#" + defaults.dropdown_id).length, 0);
      notEqual($("#" + defaults.button_id).length, 0);
      $.idealPostcodes.clearAll();
      equal($("#" + defaults.input_id).length, 0);
      equal($("#" + defaults.dropdown_id).length, 0);
      equal($("#" + defaults.button_id).length, 0);
    });
  });

  // To introduce postcode that will induce specific errors
  //
  // asyncTest('no postcode result', 2, function () {
  //   $input_field.val("ID11QE");
  //   $lookup_button.trigger("click");
  //   $(document).off("completedJsonp").on("completedJsonp", function () {
  //     start();
  //     ok($("#" + defaults.error_message_id).length, "it has an error message");
  //     strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
  //   });
  // });

  asyncTest("Postcode lookup should be triggered by enter key in input box", 6, function () {
    $input_field.val("ID11QD");

    var e = $.Event('keypress');
    e.which = 13;
    $input_field.trigger(e);

    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      notEqual($("#" + defaults.input_id).length, 0);
      notEqual($("#" + defaults.dropdown_id).length, 0);
      notEqual($("#" + defaults.button_id).length, 0);
      $.idealPostcodes.clearAll();
      equal($("#" + defaults.input_id).length, 0);
      equal($("#" + defaults.dropdown_id).length, 0);
      equal($("#" + defaults.button_id).length, 0);
    });
  });

  asyncTest("Postcode lookup cleanup with error message", 6, function () {
    $input_field.val("ID11QE");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      notEqual($("#" + defaults.input_id).length, 0);
      notEqual($("#" + defaults.error_message_id).length, 0);
      notEqual($("#" + defaults.button_id).length, 0);
      $.idealPostcodes.clearAll();
      equal($("#" + defaults.input_id).length, 0);
      equal($("#" + defaults.error_message_id).length, 0);
      equal($("#" + defaults.button_id).length, 0);
    });
  });

  module('$.lookupPostcode');

  asyncTest('Successful postcode lookup', 4, function () {
    var success = function (data, status, jqxhr) {
      start();
      equal(jqxhr.status, 200);
      equal(data.code, 2000);
      notEqual(data.result.length, 0);
      notEqual(data.result[0].postcode, "ID11QD");
    };
    $.idealPostcodes.lookupPostcode("ID11QD", api_key, success);
  });

  // To introduce postcode that will induce specific errors
  //
  // asyncTest("Postcode doesn't exist", 2, function () {
  //   var success = function (data, status, jqxhr) {
  //     start();
  //     equal(jqxhr.status, 200);
  //     equal(data.code, 4040);
  //   };
  //   $.idealPostcodes.lookupPostcode("ID11QE", api_key, success);
  // });
  
  module('')

}(jQuery));
