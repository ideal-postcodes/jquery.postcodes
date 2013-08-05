/*! Ideal Postcodes jQuery Plugin - v0.1.0 - 2013-08-05
* https://github.com/ideal-postcodes/jquery.postcodes
* Copyright (c) 2013 Christopher Blanchard; Licensed MIT */
(function($) {
  "use strict";

  var defaults = {
    // Required user data starts here...
    api_key: "",
    address_line_one: "#address_line_one",
    address_line_two: "#address_line_two",
    address_line_three: "#address_line_three",
    post_town_line: "#post_town_line",
    postcode_line: "#postcode_line",

    // Below is not required
    api_endpoint: "https://api.ideal-postcodes.co.uk/v1/postcodes/",
    $input: "",
    input_label: "Please enter your postcode",
    input_muted_style: "color:#CBCBCB;",
    input_class: "",
    input_id: "idpc_input",
    $button: "",
    button_id: "idpc_button",
    button_label: "Find my Address",
    button_class: "",
    dropdown_id: "idpc_dropdown",
    dropdown_select_message: "Please select your address",
    dropdown_class: "",
    $error_message: "",
    error_message_id: "idpc_error_message",
    error_message_invalid_postcode: "Please check your postcode, it seems to be incorrect",
    error_message_not_found: "Your postcode could not be found. Please type in your address",
    error_message_default: "Sorry, we weren't able to get the address you were looking for. Please type your address manually",
    error_message_class: "",
    last_lookup: "",
    disable_interval: 1000,
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
      }).appendTo(Idpc.$context);

      //Introduce user defined submission
      Idpc.$button = $('<button />', {
        html: Idpc.button_label,
        id: Idpc.button_id,
        class: Idpc.button_class
      })
      .click(function () {
        var postcode = Idpc.$input.val();
        if (Idpc.last_lookup !== postcode) {
          Idpc.disable_lookup_button();
          Idpc.clear_existing_fields();
          Idpc.lookup_postcode(postcode);
        }
      })
      .appendTo(Idpc.$context);
    },

    // Perform AJAX (JSONP) request
    lookup_postcode: function (postcode) {
      if (Idpc.valid_postcode(postcode)) {
        var url = Idpc.api_endpoint + postcode + "?api_key=" + Idpc.api_key;
        $.ajax({
          url: url,
          dataType: 'jsonp',
          timeout: 5000,
          success: function (data) {
            Idpc.handle_api_success(data);
            $.event.trigger("completedJsonp"); // added for API testing
            // Introduce callback
          },
          error: function () {
            Idpc.show_error("Unable to connect to server");
            $.event.trigger("completedJsonp");
            // Introduce callback
          }
        });
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
      if (Idpc.$dropdown && Idpc.$dropdown.length) {
        Idpc.$dropdown.remove();
      }
      if (Idpc.$error_message && Idpc.$error_message.length) {
        Idpc.$error_message.remove();
      }
      $(Idpc.address_line_one).val("");
      $(Idpc.address_line_two).val("");
      $(Idpc.address_line_three).val("");
      $(Idpc.post_town_line).val("");
      $(Idpc.line).val("");
    },

    // Creates a dropdown menu with address data - selection is forwarded to user form
    show_dropdown: function (data) {
      var length = data.length;
      var dropDown = $('<select />', {
        id: Idpc.dropdown_id,
        class: Idpc.postcode_dropdown_class
      });
      $('<option />', {
        value: "ideal",
        text: Idpc.postcode_dropdown_select_message
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
          $(Idpc.address_line_one).val(data[index].line_1);
          $(Idpc.address_line_two).val(data[index].line_2);
          $(Idpc.address_line_three).val(data[index].line_3);
          $(Idpc.post_town_line).val(data[index].post_town);
          $(Idpc.postcode_line).val(data[index].postcode);
        }
      });
    },

    // Puts up an error message if called
    show_error: function (message) {
      Idpc.enable_lookup_button();
      Idpc.$postcode_error_message = $('<p />', {
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

  // Expost defaults for testing purposes
  $.fn.idealPostcodes.defaults = defaults;

}(jQuery));
