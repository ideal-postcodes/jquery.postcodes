(function($) {
  "use strict";
  var apiKey = $.idealKey;
  var $input_field;
  var $lookup_button;
  var $dropdown;
  var defaults = $.idealPostcodes.defaults();

  module("Remove Organisation from address lines", {
    setup: function () {
      $("#postcode_lookup_field").setupPostcodeLookup({
        api_key: apiKey,
        disable_interval: 0,
        remove_organisation: true,
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

  asyncTest("strips Organisation name from address lines", 5, function () {
    $input_field.val("ID11QD");
    $(document).on("completedJsonp", function (event, response) {
      start();
      var organisationAddress, organisationIndex;
      $dropdown = $("#"+defaults.dropdown_id);
      ok($dropdown.length, "it has a dropdown menu");

      $.each(response.result, function (index, address) {
        if (address.organisation_name.length !== 0) {
          organisationAddress = address;
          organisationIndex = index;
        }
      });

      ok(organisationAddress);

      $dropdown.val(organisationIndex.toString()).trigger("change"); // Select organisation address
      var addressLines = [defaults.output_fields.line_1, defaults.output_fields.line_2, defaults.output_fields.line_3];
      $.each(addressLines, function (index, line) {
        notEqual($(line).val(), organisationAddress.organisation_name, "does not contain organisation name");
      });
    });
    $lookup_button.trigger("click");
  });

}(jQuery));
