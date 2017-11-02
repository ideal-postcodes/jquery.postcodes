(function($) {
  "use strict";
  var apiKey = $.idealKey;
  var $input_field;
  var $lookup_button;
  var defaults = $.idealPostcodes.defaults();

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

  module("shouldLookupTrigger Callback", { 
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        shouldLookupTrigger: function (done) {
          this.$input.val("ID1KFA");
          callbackInvoked(true);
          done();
          $.event.trigger("completedJsonp", []);
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

  asyncTest("shouldLookupTrigger is invoked before lookup", 2, function () {
    $input_field.val("ID11QD");
    $(document).on("completedJsonp", function () {
      start();
      ok(callbackInvoked);
      equal($input_field.val(), "ID1KFA");
    });
    $lookup_button.trigger("click");
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

  asyncTest("triggered when addresses are received", 9, function () {
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

  asyncTest("not triggered when no addresses are received", 1, function () {
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

  asyncTest("not triggered when error", 1, function () {
    $input_field.val("ID1CLIP");
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

  module("onDropdownCreated Callback", {
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onDropdownCreated: function (dropdown) {
          callbackInvoked(true);
          $.event.trigger("dropdown", [dropdown]);
        },
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      callbackInvoked(false);
      $(document).off("dropdown").off("completedJsonp");
    }
  });

  asyncTest("triggered when addresses retrieved and populated", 2, function () {
    $input_field.val("ID11QD");
    $(document).on("dropdown", function (e, dropdown) {
        start();
        ok(callbackInvoked());
        ok(dropdown.is($("#" + defaults.dropdown_id)));
      });
    $lookup_button.trigger("click");
  });

  asyncTest("not triggered when no addresses are found", 1, function () {
    $input_field.val("ID1KFA");
    $(document)
    .on("completedJsonp", function () {
      start();
      equal(callbackInvoked(), false);
    })
    .on("dropdown", function () {
      // This should not be invoked
      callbackInvoked(true);
    });
    $lookup_button.trigger("click");
  });

  asyncTest("not triggered when error", 1, function () {
    $input_field.val("ID1CLIP");
    $(document)
    .on("completedJsonp", function () {
      start();
      equal(callbackInvoked(), false);
    })
    .on("dropdown", function () {
      // This should not be invoked
      callbackInvoked(true);
    });
    $lookup_button.trigger("click");
  });

  module("onDropdownDestroyed Callback", {
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onDropdownDestroyed: function () {
          callbackInvoked(true);
          $.event.trigger("dropdownDestroyed");
        },
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      callbackInvoked(false);
      $(document).off("dropdownDestroyed").off("completedJsonp");
    }
  });

  asyncTest("triggered when addresses are retrieved", 2, function () {
    $(document).on("dropdownDestroyed", function () {
        start();
        ok(callbackInvoked());
        ok($("#" + defaults.dropdown_id).length === 0);
      });
    var counter = 0;
    $(document).on("completedJsonp", function () {
      counter += 1;
      if (counter < 2) { // Trigger a second time to destroyDropdown
        $input_field.val("ID1 1QD"); // Modify slightly to retrigger lookup
        $lookup_button.trigger("click");
      }
    });
    $input_field.val("ID11QD");
    $lookup_button.trigger("click");
  });

  module("onLookupTriggered Callback", {
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onLookupTriggered: function (dropdown) {
          callbackInvoked(true);
          $.event.trigger("clicked", [dropdown]);
        },
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      callbackInvoked(false);
      $(document).off("clicked").off("completedJsonp");
    }
  });

  asyncTest("triggered when button clicked", 1, function () {
    $input_field.val("ID11QD");
    $(document).on("clicked", function () {
      ok(callbackInvoked());
      start();
    });
    $lookup_button.trigger("click");
  });

  asyncTest("triggered when 'Enter' is pressed", 1, function () {
    $input_field.val("ID11QD");
    var e = $.Event("keypress");
    e.which = 13;
    $(document).on("clicked", function () {
      ok(callbackInvoked());
      start();
    });
    $input_field.trigger(e);
  });

  module("onSearchError Callback", {
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        onSearchError: function (error) {
          callbackInvoked(true);
          $.event.trigger("errorTrigger", [error]);
        },
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      callbackInvoked(false);
      $(document).off("errorTrigger").off("completedJsonp");
    }
  });

  asyncTest("triggered when lookup limit error", 1, function() {
    $input_field.val("ID1CLIP");
    $(document).on("errorTrigger", function () {
      start();
      ok(callbackInvoked());
    });
    $lookup_button.trigger("click");
  });

  asyncTest("triggered when no lookups error", 1, function () {
    $input_field.val("ID1CHOP");
    $(document).on("errorTrigger", function () {
      start();
      ok(callbackInvoked());
    });
    $lookup_button.trigger("click");
  });

  asyncTest("not triggered if no error", 1, function () {
    $input_field.val("ID11QD");
    $(document)
      .on("errorTrigger", function () {
        callbackInvoked(true);
      })
      .on("completedJsonp", function () {
        start();
        equal(callbackInvoked(), false);
      });
    $lookup_button.trigger("click");
  });

}(jQuery));
