(function($) {
  "use strict";
  var apiKey = $.idealKey;
  var $input_field;
  var $lookup_button;
  var $dropdown;
  var inputId;
  var buttonId;
  var dropdownContainerId;
  var errorMessageContainerId;
  var defaults = $.idealPostcodes.defaults();

  var isPresent = function (elemName, elemId) {
    notEqual($("#" + elemId).length, 0, "has " + elemName);
  };

  var isNotPresent = function (elemName, elemId) {
    equal($("#" + elemId).length, 0, "has no " + elemName);
  };

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
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        },
        onSearchError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+inputId);
      $lookup_button = $("#"+defaults.button_id);
    },
    teardown: function () {
      $(document).off("completedJsonp");
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

  asyncTest("Lookup with invalid postcode", 4, function () {
    $input_field.val("ID11QE");
    equal($lookup_button.prop("disabled"), false, "initial lookup button not disabled");
    $(document).on("completedJsonp", function () {
      start();
      isPresent("error message", defaults.error_message_id);
      equal($lookup_button.prop("disabled"), false, "lookup button not disabled after click");
      strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
    });
    $lookup_button.trigger("click");
  });

  module("Postcode Lookups: Custom Lookup Trigger", { 
    setup: function () {
      buttonId = "customInput";
      $("<a />", {
        id: buttonId,
        href: ""
      })
      .html("My Custom Button Message")
      .appendTo($("#qunit-fixture"));
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        button: "#" + buttonId,
        disable_interval: 0,
        onSearchCompleted: function () {
          $.event.trigger("completedJsonp");
        },
        onSearchError: function () {
          $.event.trigger("completedJsonp");
        }
      });
      $input_field = $("#"+defaults.input_id);
      $lookup_button = $("#"+buttonId);
    },
    teardown: function () {
      $(document).off("completedJsonp");
    }
  });

  test("Lookup elements are setup correctly", 4, function () {
    isPresent("default input box", defaults.input_id);
    isPresent("custom lookup trigger", buttonId);
    isNotPresent("default lookup button", defaults.button_id);
    isNotPresent("error message", defaults.error_message_id);
  });

  asyncTest("Successful Postcode Lookup", 7, function () {
    var customMessage = $lookup_button.html();
    $input_field.val("ID11QD");
    equal($lookup_button.html(), customMessage, "Button should have custom label");
    $(document).on("completedJsonp", function () {
      start();
      equal($lookup_button.html(), customMessage, "Button should have custom label");
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

  asyncTest("Lookup with invalid postcode", 2, function () {
    $input_field.val("ID11QE");
    $(document).on("completedJsonp", function () {
      start();
      isPresent("error message", defaults.error_message_id);
      strictEqual($("#" + defaults.error_message_id).html(), defaults.error_message_not_found, "it has the correct error message");
    });
    $lookup_button.trigger("click");
  });

  module("Custom Dropdown Container", {
    setup: function () {
      dropdownContainerId = "custom-dropdown-container";
      $("<div />", {
        id: dropdownContainerId
      })
      .html("Results: ")
      .appendTo($("#qunit-fixture"));
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        dropdown_container: "#" + dropdownContainerId,
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

  asyncTest("Dropdown is added to a custom parent element", 1, function () {
    $input_field.val("ID11QD");
    $(document).on("completedJsonp", function () {
      start();
      var dropdownParentActual = $("#" + defaults.dropdown_id).first().parent()[0];
      var dropdownParentExpected = $("#" + dropdownContainerId).first()[0];
      strictEqual(dropdownParentActual, dropdownParentExpected,
        "the dropdown menu is a child of the custom dropdown container element");
    });
    $lookup_button.trigger("click");
  });

  module("Custom Error Message Container", {
    setup: function () {
      errorMessageContainerId = "custom-error-container";
      $("<div />", {
        id: errorMessageContainerId
      })
      .html("Errors: ")
      .appendTo($("#qunit-fixture"));
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        error_message_container: "#" + errorMessageContainerId,
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

  asyncTest("Error message is added to a custom parent element", 1, function () {
    $input_field.val("ID1KFA");
    $(document).on("completedJsonp", function () {
      start();
      var errorMessageParentActual = $("#" + defaults.error_message_id).first().parent()[0];
      var errorMessageParentExpected = $("#" + errorMessageContainerId).first()[0];
      strictEqual(errorMessageParentActual, errorMessageParentExpected,
        "the error message element is a child of the custom error container element");
    });
    $lookup_button.trigger("click");
  });

}(jQuery));
