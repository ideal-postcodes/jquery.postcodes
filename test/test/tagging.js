(function($) {
  "use strict";
  var apiKey = $.idealKey;
  var $input_field;
  var $lookup_button;
  var defaults = $.idealPostcodes.defaults();

  module("Postcode Lookups: Tagging", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        tags: ["foo", "bar"],
        onSearchCompleted: function (data) {
          $.event.trigger("completedJsonp", [data]);
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      $(document).off("completedJsonp");
    }
  });

  asyncTest("Tag is included in search requests", 1, function () {
    $input_field.val("ID11QD");
    $(document).on("completedJsonp", function (e, data) {
      start();
      equal(data.result.length, 7);
    });
    $lookup_button.trigger("click");
  });

  module("Address Lookups: Tagging", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        address_search: true,
        tags: ["foo", "bar"],
        onSearchCompleted: function (data) {
          $.event.trigger("completedJsonp", [data]);
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      $(document).off("completedJsonp");
    }
  });

  asyncTest("Tag is included in search requests", 1, function () {
    $input_field.val("ID1 1QD");
    $(document).on("completedJsonp", function (e, data) {
      start();
      equal(data.result.hits.length, 7);
    });
    $lookup_button.trigger("click");
  });

}(jQuery));