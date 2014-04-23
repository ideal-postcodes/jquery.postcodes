/*! Ideal Postcodes jQuery Plugin - v1.2.0 - 2014-04-23
* https://github.com/ideal-postcodes/jquery.postcodes
* Copyright (c) 2014 Ideal Postcodes; Licensed MIT */
(function($) {
  "use strict";
  var idealInstances = [];
  var globalInstance;
  var defaults = {
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
    
    /* 
     * Below is not required
     */

    api_endpoint: "https://api.ideal-postcodes.co.uk/v1",

    // Input Field Configuration
    $input: undefined,
    input_label: "Please enter your postcode",
    input_muted_style: "color:#CBCBCB;",
    input_class: "",
    input_id: "idpc_input",

    // Button configuration
    $button: undefined,
    button_id: "idpc_button",
    button_label: "Find my Address",
    button_class: "",
    button_disabled_message: "Looking up postcode...",

    // Dropdown configuration
    $dropdown: undefined,
    dropdown_id: "idpc_dropdown",
    dropdown_select_message: "Please select your address",
    dropdown_class: "",

    // Error Message Configuration
    $error_message: undefined,
    error_message_id: "idpc_error_message",
    error_message_invalid_postcode: "Please check your postcode, it seems to be incorrect",
    error_message_not_found: "Your postcode could not be found. Please type in your address",
    error_message_default: "Sorry, we weren't able to get the address you were looking for. Please type your address manually",
    error_message_class: "",

    // Configuration to prevent wasting lookups
    last_lookup: "", // Tracks previous lookup, prevents consecutive lookup of same postcode
    disable_interval: 1000, // Disables lookup button in (ms) after lookup

    // Debug - Set to true to pipe API error messages to client
    debug_mode: false,

    // Register callbacks at specific stages
    onLookupSuccess: undefined,
    onLookupError: undefined,
    onAddressSelected: undefined
  };

  function IdealPostcodes (options) {
    // Load in defaults
    this.config = {};
    $.extend(this, defaults);

    // Override with options
    if (options) {
      $.extend(this, options);
    }

    // Convert output_fields container to jQuery objects
    var $output_fields = {};
    for (var key in this.output_fields) {
      if (this.output_fields[key] !== undefined) {
        $output_fields[key] = $(this.output_fields[key]);
      }
    }
    this.$output_fields = $output_fields;
  }


  IdealPostcodes.prototype.setupPostcodeInput = function (context) {
    var self = this;
    this.$context = context;

    // Introduce user defined input
    this.$input = $('<input />', {
      type: "text",
      id: this.input_id,
      value: this.input_label,
      class: this.input_class
    })
    .val(this.input_label)
    .attr("style", this.input_muted_style)
    .focus(function () {
      self.$input.removeAttr('style').val("");
    })
    .blur(function () {
      if (!self.$input.val()) {
        self.$input.val(self.input_label);
        self.$input.attr('style', self.input_muted_style);
      }
    })
    .submit(function () {
      return false;
    })
    .keypress(function (event) {
      if (event.which === 13) {
        self.$button.trigger("click");
      }
    })
    .appendTo(this.$context);

    //Introduce user defined submission
    this.$button = $('<button />', {
      html: this.button_label,
      id: this.button_id,
      class: this.button_class
    })
    .attr("type", "button")
    .attr("onclick", "return false;")
    .submit(function () {
      return false;
    })
    .click(function () {
      var postcode = self.$input.val();
      if (self.last_lookup !== postcode) {
        self.last_lookup = postcode;
        self.disableLookup();
        self.clearAll();
        self.lookupPostcode(postcode);
      }
      return false;
    })
    .appendTo(this.$context);
  };

  /*
   * Prevents lookup button from being triggered
   */

  IdealPostcodes.prototype.disableLookup = function (message) {
    message = message || this.button_disabled_message;
    this.$button.prop('disabled', true).html(message);
  };

  /*
   * Allows lookup button to be triggered
   */

  IdealPostcodes.prototype.enableLookup = function () {
    var self = this;
    if (self.disable_interval === 0) {
      self.$button.prop('disabled', false).html(self.button_label);
    } else {
      setTimeout(function (){
        self.$button.prop('disabled', false).html(self.button_label);
      }, self.disable_interval);
    }
  }; 

  /*
   * Clears the following fields
   *
   */

  IdealPostcodes.prototype.clearAll = function () {
    this.setDropDown();
    this.setErrorMessage();
    this.setAddressFields();
  };

  /*
   * Removes all elements from DOM
   *
   */

  IdealPostcodes.prototype.removeAll = function () {
    this.$context = null;

    [this.$input, this.$button, this.$dropdown, this.$error_message].forEach(function (element) {
      if (element) {
        element.remove();
      }
    });
  };

  /*
   * Triggers a postcode lookup and appropriate response
   *
   */

  IdealPostcodes.prototype.lookupPostcode = function (postcode) {
    var self = this;
    if (!$.idealPostcodes.validatePostcodeFormat(postcode)) {
      this.enableLookup();
      return self.setErrorMessage(this.error_message_invalid_postcode);
    }

    $.idealPostcodes.lookupPostcode(postcode, self.api_key, 
      // Successful result
      function (data) {
        self.response_code = data.code;
        self.response_message = data.message;
        self.result = data.result;
        self.enableLookup();

        if (self.response_code === 2000) {
          self.last_lookup = postcode;
          self.setDropDown(self.result);
        } else if (self.response_code === 4040) {
          self.setErrorMessage(self.error_message_not_found); 
        } else {
          if (self.debug_mode) {
            self.setErrorMessage("(" + self.response_code + ") " + self.response_message);
          } else {
            self.setErrorMessage(self.error_message_default);  
          } 
        }
        if (self.onLookupSuccess) {
          self.onLookupSuccess(data);
        }
      }, 
      // Unsuccessful result
      function () {
        self.setErrorMessage("Unable to connect to server");
        self.enableLookup();
        if (self.onLookupError) {
          self.onLookupError();
        }
      }
    );
  };

  /*
   * Sets the dropdown menu
   *
   * Removes dropdown from DOM if data is undefined
   */

  IdealPostcodes.prototype.setDropDown = function (data) {
    var self = this;

    // Remove dropdown menu
    if (this.$dropdown && this.$dropdown.length) {
      this.$dropdown.remove();
      delete this.$dropdown;
    }

    // Return if data undefined
    if (!data) {
      return;
    }

    var dropDown = $('<select />', {
      id: self.dropdown_id,
      class: self.dropdown_class
    });

    $('<option />', {
      value: "ideal",
      text: self.dropdown_select_message
    }).appendTo(dropDown);
    
    var length = data.length;
    for (var i = 0; i < length; i += 1) {
      $('<option />', {
        value: i,
        text: data[i].line_1 + " " + data[i].line_2
      }).appendTo(dropDown);
    }

    dropDown.appendTo(self.$context)
    .change(function () {
      var index = $(this).val();
      if (index >= 0) {
        self.setAddressFields(data[index]);
        if (self.onAddressSelected) {
          self.onAddressSelected.call(this, data[index]);
        }
      }
    });
    
    self.$dropdown = dropDown;

    return dropDown;
  };

  /*
   * Sets the error message
   *
   * Removes error message from DOM if undefined
   */

  IdealPostcodes.prototype.setErrorMessage = function (message) {
    if (this.$error_message && this.$error_message.length) {
      this.$error_message.remove();
      delete this.$error_message;
    }

    if (!message) {
      return;
    }

    // Need to enable lookup button
    // Idpc.enable_lookup_button();
    this.$error_message = $('<p />', {
      html: message,
      id: this.error_message_id,
      class: this.error_message_class
    }).appendTo(this.$context);

    return this.$error_message;
  };

  /*
   * Sets the address output fields
   *
   * Empties output fields if undefined
   */

  IdealPostcodes.prototype.setAddressFields = function (data) {
    data = data || {};

    for (var key in this.$output_fields) {
      this.$output_fields[key].val(data[key] || "");
    }
  };

  

  $.idealPostcodes = {

    // Expost defaults for testing
    defaults: function () {
      return defaults;
    },

    // Call to register key, configure misc options
    setup: function (options) {
      globalInstance = new IdealPostcodes(options);
      idealInstances.push(globalInstance);
    },

    validatePostcodeFormat: function (postcode) {
      return !!postcode.match(/^[a-zA-Z0-9]{1,4}\s?\d[a-zA-Z]{2}$/) || !!postcode.match(/^id1/i);
    },

    // Lookup postcode on API
    lookupPostcode: function (postcode, api_key, success, error) {
      var endpoint = defaults.api_endpoint,
          resource = "postcodes",
          url = [endpoint, resource, postcode].join('/'),
          options = {
            url: url,
            data: {
              api_key: api_key
            },
            dataType: 'jsonp',
            timeout: 5000,
            success: success
          };

      if (error) {
        options.error = error;
      }

      $.ajax(options);
    },

    clearAll: function () {
      var length = idealInstances.length;
      for (var i = 0; i < length; i += 1) {
        idealInstances[i].removeAll();
      }
    }
  };

  // Creates Postcode lookup field and button when called on <div>
  $.fn.setupPostcodeLookup = function (options) {
    if (options) {
      // Create new postcode lookup instance
      var postcodeLookup = new IdealPostcodes(options);
      idealInstances.push(postcodeLookup);
      postcodeLookup.setupPostcodeInput($(this));
    } else {
      // Use global postcode lookup instance (created by .setup)
      globalInstance.setupPostcodeInput($(this));
    }
    return this;
  };

}(jQuery));
