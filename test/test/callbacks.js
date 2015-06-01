(function($) {
  "use strict";

  var $input_field;
  var $lookup_button;
  var defaults = $.idealPostcodes.defaults();
  var apiKey = "iddqd";

  var callbackInvoked = (function () {
    var invoked = false;
    return function (val) {
      if (typeof val !== 'undefined') {
        return invoked = val;
      }
      if (invoked) {
        invoked = false;
        return true;
      } else {
        return false;
      }
    };
  })();

  module("onLoaded Callback Test", {
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        onLoaded: function () {
          callbackInvoked(true);
        }
      });
    },
    teardown: function () {
      callbackInvoked(false);
    }
  });

  test("onLoaded callback should be invoked when plugin loaded", 1, function () {
    ok(callbackInvoked());
  });

  module("onSearchCompleted Callback", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        onSearchCompleted: function (data) {
          callbackInvoked(true);
          $.event.trigger("completedJsonp", [data]);
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      callbackInvoked(false);
      $(document).off("completedJsonp");
    }
  });

  asyncTest("onSearchCompleted triggered by postcode lookup", 2, function () {
    $input_field.val("ID11QD");
    $(document).on("completedJsonp", function (e, data) {
      start();
      ok(callbackInvoked);
      equal(data.result.length > 0, true);
    });
    $lookup_button.trigger("click");
  });

  asyncTest("onSearchCompleted is triggered when Postcode not Found error returned", 3, function () {
    $input_field.val("ID1KFA");
    $(document).on("completedJsonp", function (e, data) {
      start();
      ok(callbackInvoked());
      equal(data.code, 4040);
      equal(data.message, "Postcode Not Found");
    });
    $lookup_button.trigger("click");
  });

  asyncTest("onSearchCompleted is triggered when No Lookups Remaining error returned", 2, function () {
    $input_field.val("ID1CLIP");
    $(document).on("completedJsonp", function (e, data) {
      start();
      ok(callbackInvoked());
      equal(data.code, 4020);
    });
    $lookup_button.trigger("click");
  });

  asyncTest("onSearchCompleted is triggered when Limit Breached error returned", 2, function () {
    $input_field.val("ID1CHOP");
    $(document).on("completedJsonp", function (e, data) {
      start();
      ok(callbackInvoked());
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
          callbackInvoked(true);
          $.event.trigger("addressSelected", [selectedData]);
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      callbackInvoked(false);
      $(document).off("completedJsonp").off("addressSelected");
    }
  });

  asyncTest("onAddressSelected triggered by clicking on an address", 2, function () {
    var addresses;
    $input_field.val("ID11QD");
    $(document)
    .on("completedJsonp", function (e, data) {
      addresses = data;
      $("#idpc_dropdown").val(2).trigger("change");
    })
    .on("addressSelected", function (e, selectedData) {
      start();
      ok(callbackInvoked());
      deepEqual(addresses.result[2], selectedData);
    });
    $lookup_button.trigger("click");
  });

  module("onAddressesRetrieved Callback", {
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onAddressesRetrieved: function (data) {
          callbackInvoked(true);
          $.event.trigger("retrieved", [data]);
        },
        onSearchCompleted: function (data) {
          $.event.trigger("completedJsonp", [data]);
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      callbackInvoked(false);
      $(document).off("retrieved").off("completedJsonp");
    }
  });

  asyncTest("onAddressesRetrieved triggered when addresses are received", 9, function () {
    $input_field.val("ID11QD");
    $(document).on("retrieved", function (e, data) {
      start();
      ok(callbackInvoked());
      equal(data.length, 7);
      $.each(data, function (i, address) {
        equal(address.postcode, "ID1 1QD");
      });
    });
    $lookup_button.trigger("click");
  });

  asyncTest("onAddressesRetrieved not triggered when no addresses are received", 1, function () {
    $input_field.val("ID1KFA");
    $(document)
      .on("addressesReceived", function () {
        callbackInvoked(true);
      })
      .on("completedJsonp", function () {
        start();
        equal(callbackInvoked(), false);
      });
    $lookup_button.trigger("click");
  });

}(jQuery));
