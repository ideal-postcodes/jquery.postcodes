/*! Ideal Postcodes jQuery Plugin - v3.0.7 - 2018-03-14
* https://github.com/ideal-postcodes/jquery.postcodes
2018 Ideal Postcodes; Licensed MIT */
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
      postcode: "#postcode"
      // postcode_inward: undefined,
      // postcode_outward: undefined,
      // udprn: undefined,
      // dependant_locality: undefined,
      // double_dependant_locality: undefined,
      // thoroughfare: undefined,
      // dependant_thoroughfare: undefined,
      // building_number: undefined,
      // building_name: undefined,
      // sub_building_name: undefined,
      // po_box: undefined,
      // department_name: undefined,
      // organisation_name: undefined,
      // postcode_type: undefined,
      // su_organisation_indicator: undefined,
      // delivery_point_suffix: undefined
    },
    
    /* 
     * Below is not required
     */

    endpoint: "https://api.ideal-postcodes.co.uk/v1",

    // Input Field Configuration
    // input: undefined,
    // $input: undefined,
    input_label: "Please enter your postcode",
    placeholder_label: "",
    input_muted_style: "color:#CBCBCB;",
    input_class: "",
    input_id: "idpc_input",

    // Button configuration
    // button: undefined,
    // $button: undefined,
    button_id: "idpc_button",
    button_label: "Find my Address",
    button_class: "",
    button_disabled_message: "Looking up postcode...",

    // Dropdown configuration
    // $dropdown: undefined,
    dropdown_id: "idpc_dropdown",
    dropdown_select_message: "Please select your address",
    dropdown_class: "",
    // dropdown_container: undefined,

    // Error Message Configuration
    // $error_message: undefined,
    error_message_id: "idpc_error_message",
    error_message_invalid_postcode: "Please check your postcode, it seems to be incorrect",
    error_message_not_found: "Your postcode could not be found. Please type in your address",
    error_message_address_not_found: "We could not find a match for your address. Please type in your address",
    error_message_default: "Sorry, we weren't able to get the address you were looking for. Please type your address manually",
    error_message_class: "",
    // error_message_container: undefined,

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

    // Optional licensee key
    licensee: null,

    // Methods to format address suggestions for dropdown box
    address_formatters: {
      // Dropdown address formatting for postcode search suggestions
      postcode_search: function (address) {
        var result = [address.line_1];
        if (address.line_2 !== "") {
          result.push(address.line_2);
        }
        return result.join(" ");
      },
      // Dropdown address formatting for address search suggestions
      address_search: function (address) {
        // Define new suggestion format
        var result = [address.line_1];
        if (address.line_2 !== "") {
          result.push(address.line_2);
        }
        result.push(address.post_town);
        result.push(address.postcode_outward);
        return result.join(", ");
      }
    },

    // Register callbacks at specific stages
    // onLoaded: undefined,              // When plugin is initialised
    // onFailedCheck: undefined,         // When key check fails (requires check_key: true)
    // onSearchCompleted: undefined,     // When a lookup succeeds, E.g. Server responds that Postcode is found or doesn't exist
    // onAddressesRetrieved: undefined,  // When a lookup succeeds with a list of addresses
    // onAddressSelected: undefined,     // User has clicked an address in dropdown
    // onDropdownCreated: undefined,     // When the address selection dropdown is inserted to DOM
    // onDropdownDestroyed: undefined,   // When the address selection dropdown is removed (following new search)
    // onLookupTriggered: undefined,     // When user clicks the button to trigger a lookup
    // shouldLookupTrigger: undefined,   // 
    // onSearchError: undefined,         // When a request succeeds but the API returns an error code

    // Tags to be included with search requests
    // tags: undefined
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

  function AddressFinderController (options) {
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


  AddressFinderController.prototype.setupPostcodeInput = function (context) {
    this.$context = context;
    this.setupInputField();
    this.setupLookupButton();
  };

  /*
   * Connects an input field to the plugin to collect postcodes
   *
   * If a selector (this.input) is specified, that input is used
   * If no selector specified, a new input field is generated and added to context
   */
  AddressFinderController.prototype.setupInputField = function () {
    var self = this;
    if ($(this.input).length) {
      // Use custom input
      this.$input = $(this.input).first();
    } else {
      // Create input field and add to DOM
      this.$input = $('<input />', {
        type: "text",
        id: this.input_id,
        value: this.input_label,
        placeholder: this.placeholder_label
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
   */
  AddressFinderController.prototype.setupLookupButton = function () {
    var self = this;
    if ($(self.button).length) {
      self.$button = $(self.button).first();
    } else {
      self.$button = $('<button />', {
        html: self.button_label,
        id: self.button_id,
        type: "button"
      })
      .appendTo(self.$context)
      .addClass(self.button_class)
      .attr("onclick", "return false;")
      .submit(function () {
        return false;
      });
    }
    self.$button.click(function () {
      if (self.onLookupTriggered) {
        self.onLookupTriggered.call(self);
      }

      var executeLookup = function () {
        var term = self.$input.val();
        if (self.last_lookup !== term) {
          self.last_lookup = term;
          self.clearAll();
          self.disableLookup();
          self.executeSearch(term);
        }
      };

      if (self.shouldLookupTrigger) {
        self.shouldLookupTrigger.call(self, executeLookup);
      } else {
        executeLookup();
      }

      return false;
    });
    return self.$button;
  };

  /*
   * Prevents lookup button from being triggered
   */
  AddressFinderController.prototype.disableLookup = function (message) {
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
  AddressFinderController.prototype.enableLookup = function () {
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
   */
  AddressFinderController.prototype.clearAll = function () {
    this.setDropDown();
    this.setErrorMessage();
  };

  /*
   * Removes all elements from DOM
   */
  AddressFinderController.prototype.removeAll = function () {
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
   *  - On successful search but no addresses, show error message
   *  - On failed search, show error message
   */
  AddressFinderController.prototype.executeSearch = function (term) {
    var self = this;
    var message;
    var callback = function (error, addresses, data) {
      self.enableLookup();
      self.cacheSearchResults(data);
      if (error) {
        message = self.debug_mode ? error.message : self.error_message_default;
        self.setErrorMessage(message);
        if (self.onSearchError) {
          self.onSearchError.call(self, error);
        }
      } else {
        if (addresses.length > 0) {
          self.last_lookup = term;

          if (self.onAddressesRetrieved) {
            self.onAddressesRetrieved.call(self, addresses);
          }

          self.setDropDown(addresses);

        } else {
          message = self.address_search ? self.error_message_address_not_found : 
            self.error_message_not_found;
          self.setErrorMessage(message); 
        }
      }

      if (self.onSearchCompleted) {
        self.onSearchCompleted.call(self, data);
      }
    };

    // Check if address search specified
    if (self.address_search) {
      return self.executeAddressSearch(term, callback);
    } else {
      return self.executePostcodeSearch(term, callback);
    }
  };

  /*
   * Invoke postcode lookup
   */
  AddressFinderController.prototype.executePostcodeSearch = function (postcode, callback) {
    var self = this;
    var options = {
      query: postcode, 
      api_key: self.api_key,
      endpoint: self.endpoint
    };

    if (self.tags) {
      options.tags = self.tags;
    }

    if (self.licensee) {
      options.licensee = self.licensee;
    }

    $.idealPostcodes.lookupPostcode(options, callback);
  };

  /*
   * Invoke an address search
   */
  AddressFinderController.prototype.executeAddressSearch = function (query, callback) {
    var self = this;
    var options = {
      query: query,
      api_key: self.api_key,
      endpoint: self.endpoint
    };
    
    if (typeof self.address_search === "object") {
      options.limit = self.address_search.limit || 10;
    }

    if (self.tags) {
      options.tags = self.tags;
    }

    if (self.licensee) {
      options.licensee = self.licensee;
    }

    $.idealPostcodes.lookupAddress(options, callback);
  };

  /*
   *  Caches search result with raw data object
   */ 
  AddressFinderController.prototype.cacheSearchResults = function (data) {
    if (data === null) {
      return null;
    }
    this.response_code = data.code;
    this.response_message = data.message;
    this.result = data.result;
    return data;
  };

  /*
   * Sets the dropdown menu
   *
   * Removes dropdown from DOM if data is undefined
   */
  AddressFinderController.prototype.setDropDown = function (data) {
    var self = this;

    var suggestionFormatter = self.address_formatters.postcode_search;
    if (self.address_search) {
      suggestionFormatter = self.address_formatters.address_search;
    } 

    if (this.$dropdown && this.$dropdown.length) {
      this.$dropdown.remove();
      delete this.$dropdown;
      if (this.onDropdownDestroyed) {
        this.onDropdownDestroyed.call(this);
      }
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

    var dropdownContainer;
    if ($(this.dropdown_container).length) {
      // Use custom dropdown container
      dropdownContainer = $(this.dropdown_container).first();
    } else {
      dropdownContainer = this.$context;
    }

    dropDown.appendTo(dropdownContainer)
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

    if (self.onDropdownCreated) {
      self.onDropdownCreated.call(self, dropDown);
    }
    
    self.$dropdown = dropDown;

    return dropDown;
  };

  /*
   * Sets the error message
   *
   * Removes error message from DOM if undefined
   */
  AddressFinderController.prototype.setErrorMessage = function (message) {
    if (this.$error_message && this.$error_message.length) {
      this.$error_message.remove();
      delete this.$error_message;
    }

    if (!message) {
      return;
    }

    var container;
    if ($(this.error_message_container).length) {
      container = $(this.error_message_container).first();
    } else {
      container = this.$context;
    }

    this.$error_message = $('<p />', {
      html: message,
      id: this.error_message_id
    })
    .addClass(this.error_message_class)
    .appendTo(container);

    return this.$error_message;
  };

  /*
   * Sets the address output fields
   *
   * Empties output fields if undefined
   */
  AddressFinderController.prototype.setAddressFields = function (data) {
    data = data || {};

    for (var key in this.$output_fields) {
      this.$output_fields[key].val(data[key] || "");
    }
  };

  var extractError = function (data) {
    return data.code + " - " + data.message;
  };

  $.idealPostcodes = {

    // Expose defaults for testing
    defaults: function () {
      return defaults;
    },

    // Expose key check cache for testing
    keyCheckCache: keyCheckCache,

    /*
     * Perform a Postcode Lookup - retrieve a list of addresses using a postcode
     * - options: (object) Configuration object for postcode lookup
     *  - options.query: (string) Postcode to lookup, case and space insensitive
     *  - options.api_key: (string) API Key required
     *  - options.licensee: (string) Licensee key
     *  - options.endpoint: (string) API endpoint
     * - success: (function) Callback invoked upon successful request
     * - error: (function) Optional callback invoked upon failed HTTP request
     */
    lookupPostcode: function (o, callback) {
      var postcode = o.query || o.postcode || "";
      var api_key = o.api_key || "";
      var endpoint = o.endpoint || defaults.endpoint;
      var resource = "postcodes";
      var url = [endpoint, resource, encodeURI(postcode)].join('/');
      var queryString = {
        api_key: api_key
      };
      var errorHandler;
      if (o.error) {
        errorHandler = o.error;
      } else {
        errorHandler = function (jqxhr, error) {
          return callback(new Error("Request Failed: " + error), [], null, jqxhr);
        };
      }

      if (o.tags && $.isArray(o.tags)) {
        queryString.tags = o.tags.join(",");
      }

      if (o.licensee) {
        queryString.licensee = o.licensee;
      }

      var options = {
        url: url,
        data: queryString,
        dataType: 'jsonp',
        timeout: 10000,
        success: function (data, _, jqxhr) {
          if (data.code === 2000) {
            return callback(null, data.result, data, jqxhr);
          } else if (data.code === 4040) {
            return callback(null, [], data, jqxhr);
          } else {
            return callback(new Error(extractError(data)), [], data, jqxhr);
          }
        },
        error: errorHandler
      };

      $.ajax(options);
    },

    /*
     * Perform an Address Search - query for addresses using a search string
     * - options: (object) Configuration object for address search
     *   - options.query (string) address to search for
     *   - options.api_key: (string) API Key required
     *   - options.licensee: (string) Licensee key
     *   - options.limit: (number) Maximum number of addresses to return (default 10)
     *   - options.endpoint: (string) API endpoint 
     * - success: (function) Callback invoked upon successful request
     * - error: (function) Optional callback invoked upon failed HTTP request
     */
    lookupAddress: function (o, callback) {
      var query = o.query || "";
      var api_key = o.api_key || "";
      var endpoint = o.endpoint || defaults.endpoint;
      var resource = "addresses";
      var url = [endpoint, resource].join('/');
      var queryString = {
        api_key: api_key,
        query: query
      };
      var errorHandler;
      if (o.error) {
        errorHandler = o.error;
      } else {
        errorHandler = function (jqxhr, error) {
          return callback(new Error("Request Failed: " + error), [], null, jqxhr);
        };
      }
      
      queryString.limit = o.limit || 10;

      if (o.tags && $.isArray(o.tags)) {
        queryString.tags = o.tags.join(",");
      }

      if (o.licensee) {
        queryString.licensee = o.licensee;
      }

      var options = {
        url: url,
        data: queryString,
        dataType: 'jsonp',
        timeout: 10000,
        success: function (data, _, jqxhr) {
          if (data.code === 2000) {
            return callback(null, data.result.hits, data, jqxhr);
          } else {
            return callback(new Error(extractError(data)), [], data, jqxhr);
          }
        },
        error: errorHandler
      };

      $.ajax(options);
    },

    /*
     * Checks whether key can be used
     * - options: (object) Configuration object for key checking
     *  - options.api_key: (string) API Key to test
     *  - options.licensee: (string) Licensee key
     *  - options.endpoint: (string) API endpoint
     * - success: (function) Callback invoked when key is available
     * - error: (function) Optional callback invoked when key is not available or HTTP request failed
     */
    checkKey: function (o, success, error) {
      var api_key = o.api_key || "";

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

      var endpoint = o.endpoint || defaults.endpoint;
      var resource = "keys";
      var url = [endpoint, resource, api_key].join('/');
      var options = {
        url: url,
        dataType: 'jsonp',
        timeout: 10000
      };

      if (o.licensee) {
        options.data = {
          licensee: o.licensee
        };
      }

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
        var postcodeLookup = new AddressFinderController(options);
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
      var keyOptions = { api_key: options.api_key };
      if (options.endpoint) {
        keyOptions.endpoint = options.endpoint;
      }
      if (options.licensee) {
        keyOptions.licensee = options.licensee;
      }
      $.idealPostcodes.checkKey(keyOptions, initPlugin, failedKeyCheck);
    } else {
      initPlugin();
    }

    return self;
  };

}(jQuery));
