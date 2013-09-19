/*
 * jquery.postcodes
 * https://github.com/ideal-postcodes/jquery.postcodes
 *
 * Copyright (c) 2013 Christopher Blanchard
 * Licensed under the MIT license.
 *
 * This plugin requires an account at 
 * https://ideal-postcodes.co.uk
 */

(function($) {
  "use strict";

  var defaults = {
    /*
    * Required parameters start here...
    */

    // Please Enter your API Key
    api_key: "",

    // Required Fields to Populate your Form
    // Please enter an appropriate CSS selector that
    // uniquely identifies the input field you wish
    // the result to be piped in
    output_fields: {
      line_1: "#line_1",
      line_2: "#line_2",
      line_3: "#line_3",
      post_town: "#post_town",
      postcode: "#postcode",
      postcode_inward: undefined,
      postcode_outward: undefined,
      udprn: undefined,
      dependant_locality: undefined,
      double_dependant_locality: undefined,
      thoroughfare: undefined,
      dependant_thoroughfare: undefined,
      building_number: undefined,
      building_name: undefined,
      sub_building_name: undefined,
      po_box: undefined,
      department_name: undefined,
      organisation_name: undefined,
      postcode_type: undefined,
      su_organisation_indicator: undefined,
      delivery_point_suffix: undefined
    },
    
    // Below is not required
    api_endpoint: "https://api.ideal-postcodes.co.uk/v1/postcodes/",

    // Input Field Configuration
    $input: "",
    input_label: "Please enter your postcode",
    input_muted_style: "color:#CBCBCB;",
    input_class: "",
    input_id: "idpc_input",

    // Button configuration
    $button: "",
    button_id: "idpc_button",
    button_label: "Find my Address",
    button_class: "",

    // Dropdown configuration
    dropdown_id: "idpc_dropdown",
    dropdown_select_message: "Please select your address",
    dropdown_class: "",

    // Error Message Configuration
    $error_message: "",
    error_message_id: "idpc_error_message",
    error_message_invalid_postcode: "Please check your postcode, it seems to be incorrect",
    error_message_not_found: "Your postcode could not be found. Please type in your address",
    error_message_default: "Sorry, we weren't able to get the address you were looking for. Please type your address manually",
    error_message_class: "",

    // Configuration to prevent wasting lookups
    last_lookup: "", // Tracks previous lookup, prevents consecutive lookup of same postcode
    disable_interval: 1000, // Disables lookup button in (ms) after lookup

    // Debug - Set to true to pipe API error messages to client
    debug_mode: false
  };

  var Idpc = {

    // Update defaults and call setup() to begin loading form elements
    init: function (context, options) {
      Idpc.$context = context;
      $.extend(Idpc, defaults);
      if (options) {
        $.extend(Idpc, options);
      }
      Idpc.setup();
    },
    
    // Create and append postcode input and submit button to specified div context
    setup: function () {
      // Rig output fields
      var $output_fields = {};
      for (var key in Idpc.output_fields) {
        if (Idpc.output_fields[key] !== undefined) {
          $output_fields[key] = $(Idpc.output_fields[key]);
          if (Idpc.debug_mode && $output_fields[key] === 0) {
            console.log("Warning! Invalid CSS selector provided for ", key);
          } 
        }
      }
      Idpc.output_fields = $output_fields;

      // Introduce user defined input
      Idpc.$input = $('<input />', {
        type: "text",
        id: Idpc.input_id,
        value: Idpc.input_label,
        class: Idpc.input_class
      })
      .val(Idpc.input_label)
      .attr("style", Idpc.input_muted_style)
      .focus(function () {
        Idpc.$input.removeAttr('style').val("");
      })
      .blur(function () {
        if (!Idpc.$input.val()) {
          Idpc.$input.val(Idpc.input_label);
          Idpc.$input.attr('style', Idpc.input_muted_style);
        }
      })
      .submit(function () {
        return false;
      })
      .appendTo(Idpc.$context);

      //Introduce user defined submission
      Idpc.$button = $('<button />', {
        html: Idpc.button_label,
        id: Idpc.button_id,
        class: Idpc.button_class
      })
      .attr("type", "button")
      .attr("onclick", "return false;")
      .submit(function () {
        return false;
      })
      .click(function () {
        var postcode = Idpc.$input.val();
        if (Idpc.last_lookup !== postcode) {
          Idpc.disable_lookup_button();
          Idpc.clear_existing_fields();
          Idpc.lookupPostcode(postcode);
        }
        return false;
      })
      .appendTo(Idpc.$context);
    },

    // Perform AJAX (JSONP) request
    lookupPostcode: function (postcode) {
      if (Idpc.valid_postcode(postcode)) {
        var success = function (data) {
          Idpc.handle_api_success(data);
          $.event.trigger("completedJsonp"); // added for API testing, better solution needed
          // To introduce callback
        };
        var error = function () {
          Idpc.show_error("Unable to connect to server");
          $.event.trigger("completedJsonp");
          // To introduce callback
        };
        $.lookupPostcode(postcode, Idpc.api_key, success, error);
      } else {
        Idpc.show_error(Idpc.error_message_invalid_postcode);
      }
    },

    // Disable lookup button to prevent further AJAX requests
    disable_lookup_button: function (message) {
      Idpc.$button.prop('disabled', true).html(message || "Looking up postcode...");
    },

    // Enables lookup button and return it to a normal state after a short interval (see defaults)
    enable_lookup_button: function () {
      setTimeout(function (){
        Idpc.$button.prop('disabled', false).html(Idpc.button_label);
      }, Idpc.disable_interval);
    },

    // Test for valid postcode format
    valid_postcode: function (postcode) {
      var regex = /^[a-zA-Z0-9]{1,4}\s?\d[a-zA-Z]{2}$/;
      return !!postcode.match(regex);
    },

    // Callback if JSONP request returns with code 2000
    handle_api_success: function (data) {
      Idpc.response_code = data.code;
      Idpc.response_message = data.message;
      Idpc.result = data.result;
      if (Idpc.response_code === 2000) {
        Idpc.last_lookup = Idpc.$input.val();
        Idpc.show_dropdown(Idpc.result).appendTo(Idpc.$context);
        Idpc.enable_lookup_button();
      } else { // Unable to connect to server
        Idpc.handle_api_error();
      }
    },

    // Callback if JSONP request does not return with code 2000
    handle_api_error: function () {
      if (Idpc.response_code === 4040) { // Postcode not found
        Idpc.show_error(Idpc.error_message_not_found); 
      } else {
        if (Idpc.debug_mode) {
          Idpc.show_error("(" + Idpc.response_code + ") " + Idpc.response_message);
        } else {
          Idpc.show_error(Idpc.error_message_default);  
        } 
      }
      Idpc.enable_lookup_button();
    },

    // Empties fields including user specified address fields and returns them to normal state
    clear_existing_fields: function () {
      Idpc.clear_dropdown_menu();
      Idpc.clear_error_messages();
      Idpc.clear_input_fields();
    },

    clear_dropdown_menu: function () {
      if (Idpc.$dropdown && Idpc.$dropdown.length) {
        Idpc.$dropdown.remove();
      }
    },

    clear_error_messages: function () {
      if (Idpc.$error_message && Idpc.$error_message.length) {
        Idpc.$error_message.remove();
      }
    },

    clear_input_fields: function () {
      for (var key in Idpc.output_fields) {
        Idpc.output_fields[key].val("");
      }
    },

    // Creates a dropdown menu with address data - selection is forwarded to user form
    show_dropdown: function (data) {
      var length = data.length;
      var dropDown = $('<select />', {
        id: Idpc.dropdown_id,
        class: Idpc.dropdown_class
      });
      $('<option />', {
        value: "ideal",
        text: Idpc.dropdown_select_message
      }).appendTo(dropDown);
      
      for (var i = 0; i < length; i += 1) {
        $('<option />', {
          value: i,
          text: data[i].line_1 + " " + data[i].line_2
        }).appendTo(dropDown);
      }
      Idpc.link_to_fields(dropDown);
      Idpc.$dropdown = dropDown;
      return dropDown;
    },

    // Creates event handler that pipes selected address to user form
    link_to_fields: function ($address_dropdown) {
      var data = Idpc.result;
      return $address_dropdown.change(function () {
        var index = $(this).val();
        if (index >= 0) {
          Idpc.populate_output_fields(data[index])
        }
      });
    },

    populate_output_fields: function (result_object) {
      for (var key in Idpc.output_fields) {
        Idpc.output_fields[key].val(result_object[key]);
      }
    },

    // Puts up an error message if called
    show_error: function (message) {
      Idpc.enable_lookup_button();
      Idpc.$error_message = $('<p />', {
        html: message,
        id: Idpc.error_message_id,
        class: Idpc.error_message_class
      }).appendTo(Idpc.$context);
    }

  };

  $.fn.idealPostcodes = function (options) {
    Idpc.init(this, options);
    return this;
  };

  $.lookupPostcode = function (postcode, api_key, success, error) {
    var endpoint = Idpc.api_endpoint || defaults.api_endpoint,
        url = endpoint + postcode + "?api_key=" + api_key,
        options = {
          url: url,
          dataType: 'jsonp',
          timeout: 5000,
          success: success
        };

    if (error) {
      options.error = error;
    }

    $.ajax(options);
  };

  // Expost defaults for testing purposes
  $.fn.idealPostcodes.defaults = defaults;

}(jQuery));
