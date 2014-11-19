/*
 * jquery.postcodes
 * https://github.com/ideal-postcodes/jquery.postcodes
 *
 * Copyright (c) 2014 Ideal Postcodes
 * Licensed under the MIT license.
 *
 * This plugin requires an account at 
 * https://ideal-postcodes.co.uk
 */

(function($) {
  "use strict";
  // Cache for all new instances of the plugin
  var pluginInstances = [];

  // Caches calls to the /v1/keys API
  var keyCheckCache = {};

  // Default settings
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
    input: undefined,
    $input: undefined,
    input_label: "Please enter your postcode",
    input_muted_style: "color:#CBCBCB;",
    input_class: "",
    input_id: "idpc_input",

    // Button configuration
    button: undefined,
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
    error_message_address_not_found: "We could not find a match for your address. Please type in your address",
    error_message_default: "Sorry, we weren't able to get the address you were looking for. Please type your address manually",
    error_message_class: "",

    // Address search fallback - if enabled, postcode searches which fail validation will be forward to the Address search API
    address_search: false,

    // Configuration to prevent wasting lookups
    last_lookup: "", // Tracks previous lookup, prevents consecutive lookup of same postcode
    disable_interval: 1000, // Disables lookup button in (ms) after lookup

    // Debug - Set to true to pipe API error messages to client
    debug_mode: false,

    // Check if key is usable - will not initialise if set to true and key not usable
    check_key: false,

    // Removes Organisation name from address lines
    remove_organisation: false,

    // Register callbacks at specific stages
    onLoaded: undefined,          // When plugin is initialised
    onFailedCheck: undefined,     // When key check fails (requires check_key: true)
    onLookupSuccess: undefined,   // When a lookup succeeds, E.g. Server responds that Postcode is found or doesn't exist
    onLookupError: undefined,     // When a lookup fails, can be a connection issue or bad request   
    onAddressSelected: undefined  // User has clicked an address in dropdown
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
    this.$context = context;
    this.setupInputField();
    this.setupLookupButton();
  };

  /*
   * Connects an input field to the plugin to collect postcodes
   *
   * If a selector (this.input) is specified, that input is used
   * If no selector specified, a new input field is generated and added to context
   *
   */

  IdealPostcodes.prototype.setupInputField = function () {
    var self = this;
    if ($(this.input).length) {
      // Use custom input
      this.$input = $(this.input).first();
    } else {
      // Create input field and add to DOM
      this.$input = $('<input />', {
        type: "text",
        id: this.input_id,
        value: this.input_label
      })
      .appendTo(this.$context)
      .addClass(this.input_class)
      .val(this.input_label)
      .attr("style", this.input_muted_style)
      .submit(function () {
        return false;
      })
      .keypress(function (event) {
        if (event.which === 13) {
          self.$button.trigger("click");
        }
      })
      .focus(function () {
        self.$input.removeAttr('style').val("");
      })
      .blur(function () {
        if (!self.$input.val()) {
          self.$input.val(self.input_label);
          self.$input.attr('style', self.input_muted_style);
        }
      });
    }
    return this.$input;
  };

  /*
   * Connects clickable element to the plugin to trigger
   *
   */

  IdealPostcodes.prototype.setupLookupButton = function () {
    var self = this;
    if ($(this.button).length) {
      this.$button = $(this.button).first();
    } else {
      this.$button = $('<button />', {
        html: this.button_label,
        id: this.button_id,
        type: "button"
      })
      .appendTo(this.$context)
      .addClass(this.button_class)
      .attr("onclick", "return false;")
      .submit(function () {
        return false;
      });
    }
    this.$button.click(function () {
      var postcode = self.$input.val();
      if (self.last_lookup !== postcode) {
        self.last_lookup = postcode;
        self.clearAll();
        self.disableLookup();
        self.lookupPostcode(postcode);
      }
      return false;
    });
    return this.$button;
  };

  /*
   * Prevents lookup button from being triggered
   */

  IdealPostcodes.prototype.disableLookup = function (message) {
    // Cancel if custom button
    if (this.button) {
      return;
    }
    message = message || this.button_disabled_message;
    this.$button.prop('disabled', true).html(message);
  };

  /*
   * Allows lookup button to be triggered
   */

  IdealPostcodes.prototype.enableLookup = function () {
    // Cancel if custom button
    if (this.button) {
      return;
    }
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
  };

  /*
   * Removes all elements from DOM
   *
   */

  IdealPostcodes.prototype.removeAll = function () {
    this.$context = null;

    $.each([this.$input, this.$button, this.$dropdown, this.$error_message], function (index, element) {
      if (element) {
        element.remove();
      }
    });
  };

  /*
   * Validate search term and then trigger postcode lookup
   *  - On successful search, display results in a dropdown menu
   *  - On successful search but postcode does not exist, show error message
   *  - On failed search, show error message and invoke error callback
   */

  IdealPostcodes.prototype.lookupPostcode = function (postcode) {
    var self = this;
    if (!$.idealPostcodes.validatePostcodeFormat(postcode)) {
      // Fallback to address search
      if (self.address_search) {
        var search = {
          query: postcode
        };
        if (typeof self.address_search === "object") {
          search.limit = self.address_search.limit || 10;
        }
        return this.searchAddress(search);
      } else {
        this.enableLookup();
        return self.setErrorMessage(this.error_message_invalid_postcode);
      }
    }

    $.idealPostcodes.lookupPostcode(postcode, self.api_key, 
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
          self.onLookupSuccess.call(self, data);
        }
      }, 
      // Lookup Failed
      function () {
        self.setErrorMessage("Unable to connect to server");
        self.enableLookup();
        if (self.onLookupError) {
          self.onLookupError.call(self);
        }
      }
    );
  };

  /*
   * Triggers an address search and appropriate response
   *  - On successful search, display results in a dropdown menu
   *  - On successful search but no results, show error message
   *  - On failed search, show error message and invoke error callback
   */

  IdealPostcodes.prototype.searchAddress = function (searchOptions) {
    var self = this;
    $.idealPostcodes.lookupAddress(searchOptions, self.api_key, 
      function (data) {
        self.response_code = data.code;
        self.response_message = data.message;
        self.result = data.result;
        self.enableLookup();

        if (self.response_code === 2000) {
          if (self.result.total > 0) {
            self.last_lookup = searchOptions.query;
            self.setDropDown(self.result.hits, function (address) {
              // Define new suggestion format
              var result = [address.line_1];
              if (address.line_2 !== "") {
                result.push(address.line_2);
              }
              result.push(address.post_town);
              result.push(address.postcode_outward);
              return result.join(", ");
            });
          } else {
            self.setErrorMessage(self.error_message_address_not_found); 
          }

          if (self.onLookupSuccess) {
            self.onLookupSuccess.call(self, data);
          }

        } else {
          if (self.debug_mode) {
            self.setErrorMessage("(" + self.response_code + ") " + self.response_message);
          } else {
            self.setErrorMessage(self.error_message_default);  
          } 
        }
      }, 
      // Lookup Failed
      function () {
        self.setErrorMessage("Unable to connect to server");
        self.enableLookup();
        if (self.onLookupError) {
          self.onLookupError.call(self);
        }
      }
    );
  };

  /*
   * Sets the dropdown menu
   *
   * Removes dropdown from DOM if data is undefined
   */

  IdealPostcodes.prototype.setDropDown = function (data, suggestionFormatter) {
    var self = this;

    suggestionFormatter = suggestionFormatter || function (address) {
      var result = [address.line_1];
      if (address.line_2 !== "") {
        result.push(address.line_2);
      }
      return result.join(" ");
    };

    if (this.$dropdown && this.$dropdown.length) {
      this.$dropdown.remove();
      delete this.$dropdown;
    }

    if (!data) {
      return;
    }

    var dropDown = $('<select />', {
      id: self.dropdown_id
    }).
    addClass(self.dropdown_class);

    $('<option />', {
      value: "ideal",
      text: self.dropdown_select_message
    }).appendTo(dropDown);
    
    var length = data.length;
    for (var i = 0; i < length; i += 1) {
      $('<option />', {
        value: i,
        text: suggestionFormatter(data[i])
      }).appendTo(dropDown);
    }

    dropDown.appendTo(self.$context)
    .change(function () {
      var address;
      var index = $(this).val();
      if (index >= 0) {
        if (self.remove_organisation) {
          address = removeOrganisation(data[index]);
        } else {
          address = data[index];
        }
        self.setAddressFields(address);
        if (self.onAddressSelected) {
          self.onAddressSelected.call(self, address);
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
      id: this.error_message_id
    })
    .addClass(this.error_message_class)
    .appendTo(this.$context);

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

  /* 
   * Utility method to remove organisation from Address result
   *
   * All organisations will have their name as first line
   */

  var removeOrganisation = function (address) {
    if (address.organisation_name.length !== 0 &&
        (address.line_1 === address.organisation_name)) {
      // Shift addresses up
      address.line_1 = address.line_2;
      address.line_2 = address.line_3;
      address.line_3 = "";
    }
    return address;
  };

  $.idealPostcodes = {

    // Expose defaults for testing
    defaults: function () {
      return defaults;
    },

    // Expose key check cache for testing
    keyCheckCache: keyCheckCache,

    // Simple validation for postcode. Excludes test postcodes starting with ID1
    validatePostcodeFormat: function (postcode) {
      return !!postcode.match(/^[a-zA-Z0-9]{1,4}\s?\d[a-zA-Z]{2}$/) || !!postcode.match(/^id1/i);
    },

    /*
     * Perform a Postcode Lookup
     * - postcode: (string) Postcode to lookup, case and space insensitive
     * - api_key: (string) API Key required
     * - success: (function) Callback invoked upon successful request
     * - error: (function) Optional callback invoked upon failed HTTP request
     */

    lookupPostcode: function (postcode, api_key, success, error) {
      var endpoint = defaults.api_endpoint;
      var resource = "postcodes";
      var url = [endpoint, resource, encodeURI(postcode)].join('/');
      var options = {
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

    /*
     * Perform an Address Search
     * - searchOptions: (object) config object (may be extended in later versions)
     *   - searchOptions.query (string) address to search for
     * - api_key: (string) API Key required
     * - success: (function) Callback invoked upon successful request
     * - error: (function) Optional callback invoked upon failed HTTP request
     */

    lookupAddress: function (searchOptions, api_key, success, error) {
      var endpoint = defaults.api_endpoint;
      var resource = "addresses";
      var url = [endpoint, resource].join('/');
      var queryString = {
        api_key: api_key,
        query: searchOptions.query
      };
      queryString.limit = searchOptions.limit || 10;
      var options = {
        url: url,
        data: queryString,
        dataType: 'jsonp',
        timeout: 5000,
        success: success
      };

      if (error) {
        options.error = error;
      }

      $.ajax(options);
    },

    /*
     * Checks whether key can be used
     * - api_key: (string) API Key to test
     * - success: (function) Callback invoked when key is available
     * - error: (function) Optional callback invoked when key is not available or HTTP request failed
     */

    checkKey: function (api_key, success, error) {
      error = error || function () {};

      var cache = keyCheckCache[api_key];

      if (typeof cache === 'boolean') {
        // Invoke relevant callback if result cached
        if (cache) {
          return success();
        } else {
          return error();
        }
      } else if (typeof cache === 'object') {
        // Push callbacks onto cache and exit
        keyCheckCache[api_key]["success"].push(success);
        keyCheckCache[api_key]["error"].push(error);
        return;
      } else {
        // Create cache for callbacks and proceed to AJAX request
        keyCheckCache[api_key] = {
          "success": [success],
          "error": [error]
        };
      }

      var endpoint = defaults.api_endpoint;
      var resource = "keys";
      var url = [endpoint, resource, api_key].join('/');
      var options = {
        url: url,
        dataType: 'jsonp',
        timeout: 5000
      };

      // Save to cache and invoke all callbacks
      options.success = function (data) {
        if (data && data.result && data.result.available) {
          var successStack = keyCheckCache[api_key]["success"];
          keyCheckCache[api_key] = true;
          $.each(successStack, function (index, callback) {
            callback.call(null, data);
          });
        } else {
          var errorStack = keyCheckCache[api_key]["error"];
          keyCheckCache[api_key] = false;
          $.each(errorStack, function (index, callback) {
            callback.call();
          });
        }
      };

      // Invoke error callbacks
      options.error = function () {
        var errorStack = keyCheckCache[api_key]["error"];
        delete keyCheckCache[api_key];
        $.each(errorStack, function (index, callback) {
          callback.call();
        });
      };

      $.ajax(options);
    },

    clearAll: function () {
      var length = pluginInstances.length;
      for (var i = 0; i < length; i += 1) {
        pluginInstances[i].removeAll();
      }
    }
  };

  // Creates Postcode lookup field and button when called on <div>
  $.fn.setupPostcodeLookup = function (options) {
    var self = this;

    if (self.length === 0) {
      return self;
    }

    var initPlugin = function () {
      // Initialise plugin on all DOM elements
      $.each(self, function (index, context) {
        var postcodeLookup = new IdealPostcodes(options);
        pluginInstances.push(postcodeLookup);
        postcodeLookup.setupPostcodeInput($(context));
      });

      // Invoke onLoaded callback
      if ($.isFunction(options.onLoaded)) {
        options.onLoaded.call(self);
      }
    };

    var failedKeyCheck = function () {
      if ($.isFunction(options.onFailedCheck)) {
        options.onFailedCheck.call(self);
      }
    };

    // Check if key is usable if necessary
    if (options.check_key) {
      $.idealPostcodes.checkKey(options.api_key, initPlugin, failedKeyCheck);
    } else {
      initPlugin();
    }

    return self;
  };

}(jQuery));
