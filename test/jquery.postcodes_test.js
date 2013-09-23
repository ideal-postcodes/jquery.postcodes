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

  module('idealPostcodes.validatePostcodeFormat');

  test('correctly ascertains validity of submitted postcode format', 5, function () {
    equal($.idealPostcodes.validatePostcodeFormat('ID11QD'), true);
    equal($.idealPostcodes.validatePostcodeFormat('id11qd'), true);
    equal($.idealPostcodes.validatePostcodeFormat('id1 1qd'), true);
    equal($.idealPostcodes.validatePostcodeFormat('ID1 1QD'), true);
    equal($.idealPostcodes.validatePostcodeFormat('IDDQD'), false);
  });

  module('jquery#lookupPostcode');

  module('jquery#lookupAddress');

  module('jQuery#setupPostcodeLookup');

  var defaults, $input_field, $lookup_button;

  test('has postcode input box', 6, function () {
    $.idealPostcodes.setup({
      api_key: 'api_key',
      disable_interval: 0
    });
    $('#postcode_lookup_field').setupPostcodeLookup();
    defaults = $.idealPostcodes.defaults();
    $input_field = $("#"+defaults.input_id);
    $lookup_button = $("#"+defaults.button_id);

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
    $.idealPostcodes.setup({
      api_key: 'api_key',
      disable_interval: 0
    });
    $('#postcode_lookup_field').setupPostcodeLookup();
    defaults = $.idealPostcodes.defaults();
    $input_field = $("#"+defaults.input_id);
    $lookup_button = $("#"+defaults.button_id);

    $input_field.val("BOGUSPOSTCODE");
    $lookup_button.trigger("click");
    ok($("#" + defaults.error_message_id).length, "it has an error message");
    strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_invalid_postcode,"it has the correct error message");
  });  

  // Testing below this point requires an API key to work 

  /* Requires a functioning api key. This will not consume any lookups
  var api_key = "";

  var $dropdown;

  asyncTest('successful postcode lookup', 7, function () {
    $.idealPostcodes.setup({
      api_key: api_key,
      disable_interval: 0
    });
    $('#postcode_lookup_field').setupPostcodeLookup();

    defaults = $.idealPostcodes.defaults();
    $input_field = $("#"+defaults.input_id);
    $lookup_button = $("#"+defaults.button_id);

    $input_field.val("ID11QD");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      strictEqual($dropdown.children('option[value=ideal]').text(), defaults.dropdown_select_message, "it has the correct display text");
      $dropdown.val("5").trigger("change"); // Select 3 lined output
      [defaults.output_fields.line_1, defaults.output_fields.line_2, defaults.output_fields.line_3, defaults.output_fields.post_town, defaults.output_fields.postcode].forEach(function (elem) {
        ok($(elem).val(), elem + " has content");
      });
    });
  });

  asyncTest('no postcode result', 2, function () {
    $.idealPostcodes.setup({
      api_key: api_key,
      disable_interval: 0
    });
    $('#postcode_lookup_field').setupPostcodeLookup();

    defaults = $.idealPostcodes.defaults();
    $input_field = $("#"+defaults.input_id);
    $lookup_button = $("#"+defaults.button_id);

    $input_field.val("ID11QE");
    $lookup_button.trigger("click");
    $(document).off("completedJsonp").on("completedJsonp", function () {
      start();
      ok($("#" + defaults.error_message_id).length, "it has an error message");
      strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
    });
  });

  */

}(jQuery));
