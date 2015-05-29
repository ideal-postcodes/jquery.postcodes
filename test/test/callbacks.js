(function($) {
  "use strict";

  var $input_field;
  var $lookup_button;
  var defaults = $.idealPostcodes.defaults();
  var apiKey = "iddqd";

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

  test("onLoaded callback should be invoked when plugin loaded", 2, function () {
    var $widget = $(".myNewRandomClass");
    equal($widget.length, 1);
    equal($widget[0].id, "postcode_lookup_field");
  });

  module("onSearchCompleted Callback", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
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

  asyncTest("onSearchCompleted triggered by postcode lookup", 1, function () {
    $input_field.val("ID11QD");
    $(document).on("completedJsonp", function (e, data) {
      start();
      equal(data.result.length > 0, true);
    });
    $lookup_button.trigger("click");
  });

  asyncTest("onSearchCompleted is triggered when Postcode not Found error returned", 2, function () {
    $input_field.val("ID1KFA");
    $(document).on("completedJsonp", function (e, data) {
      start();
      equal(data.code, 4040);
      equal(data.message, "Postcode Not Found");
    });
    $lookup_button.trigger("click");
  });

  asyncTest("onSearchCompleted is triggered when No Lookups Remaining error returned", 1, function () {
    $input_field.val("ID1CLIP");
    $(document).on("completedJsonp", function (e, data) {
      start();
      equal(data.code, 4020);
    });
    $lookup_button.trigger("click");
  });

  asyncTest("onSearchCompleted is triggered when Limit Breached error returned", 1, function () {
    $input_field.val("ID1CHOP");
    $(document).on("completedJsonp", function (e, data) {
      start();
      equal(data.code, 4021);
    });
    $lookup_button.trigger("click");
  });

  module("onAddressSelected Callback", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
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

  asyncTest("onAddressSelected triggered by clicking on an address", 1, function () {
    var addresses;
    $input_field.val("ID11QD");
    $(document).on("completedJsonp", function (e, data) {
      addresses = data;
      $("#idpc_dropdown").val(2).trigger("change");
    });
    $(document).off("addressSelected").on("addressSelected", function (e, selectedData) {
      start();
      deepEqual(addresses.result[2], selectedData);
    });
    $lookup_button.trigger("click");
  });

}(jQuery));
