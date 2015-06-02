(function($) {
  "use strict";
  var apiKey = $.idealKey;
  var $input_field;
  var $lookup_button;
  var $dropdown;
  var defaults = $.idealPostcodes.defaults();

  module("jQuery#setupPostcodeLookup with address search fallback", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        address_search: true,
        disable_interval: 0,
        onSearchCompleted: function (data) {
          $.event.trigger("completedJsonp", [data]);
        },
        onAddressSelected: function (selectedData) {
          $.event.trigger("addressSelected", [selectedData]);
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      $(document).off("completedJsonp").off("addressSelected");
    }
  });

  asyncTest("performs an address lookup if postcode is not valid and return options in correct format", 5, function () {
    $input_field.val("10 Downing Street London");
    $(document).on("completedJsonp", function (event, response) {
      start();
      $dropdown = $("#" + defaults.dropdown_id);  
      ok($dropdown.length, "it has a dropdown menu");
      equal(response.result.hits.length, 2, "it returns the right number of results");
      $.each(response.result.hits, function (index, elem) {
        ok(elem.postcode === "SW1A 2AA" || elem.postcode === "WC1N 1LX", "it contains the right results");
      });
      equal($dropdown.children("option[value=0]").text(), "Prime Minister & First Lord Of The Treasury, 10 Downing Street, LONDON, SW1A", "it is the right format");
    });
    $lookup_button.trigger("click");
  });
  
  asyncTest("returns an error message if no matches were found in an address search", 3, function () {
    $input_field.val("ID1KFA");
    $(document).on("completedJsonp", function (event, response) {
      start();
      var $errorMessage = $("#" + defaults.error_message_id);
      $dropdown = $("#" + defaults.dropdown_id);
      equal($dropdown.length, 0);
      equal($errorMessage.html(), defaults.error_message_address_not_found);
      equal(response.result.hits.length, 0);
    });
    $lookup_button.trigger("click");
  });

  module("jQuery#setupPostcodeLookup with address search fallback", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        address_search: {
          limit: 20
        },
        disable_interval: 0,
        onSearchCompleted: function (data) {
          $.event.trigger("completedJsonp", [data]);
        },
        onAddressSelected: function (selectedData) {
          $.event.trigger("addressSelected", [selectedData]);
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      $(document).off("completedJsonp").off("addressSelected");
    }
  });

  asyncTest("should perform an address lookup and be sensitive to limit", 22, function () {
    $input_field.val("Test Limit");
    $(document).on("completedJsonp", function (event, response) {
      start();
      $dropdown = $("#" + defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");
      equal(response.result.hits.length, 20, "it returns the right number of results");
      $.each(response.result.hits, function (index, elem) {
        ok(elem.postcode === "L21 1EX");
      });
    });
    $lookup_button.trigger("click");
  });

}(jQuery));
