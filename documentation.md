# jQuery Plugin [![Build Status](https://travis-ci.org/ideal-postcodes/jquery.postcodes.png)](https://travis-ci.org/ideal-postcodes/jquery.postcodes) [![npm version](https://badge.fury.io/js/jquery-postcodes.svg)](http://badge.fury.io/js/jquery-postcodes)

The jQuery plugin is the fastest way to integrate postcode lookups on a web page. To see working examples, [visit our jQuery Demo page](/jquery).

This plugin generates an **input field** to receive postcode inputs from the user and a **button** to run address lookups via the Ideal Postcodes API. If a matching postcode is found, a drop down menu is created and the selected address is piped into the form. If no matching postcode is found or an error occurred, the plugin will append an appropriate message.

The plugin provides addresses according to [Royal Mail's Addressing Guidelines](http://www.royalmail.com/personal/help-and-support/How-do-I-address-my-mail-correctly). This consists of 3 address lines, a Post Town and Postcode and is sufficient to uniquely identify a premise in the UK.

***

# Build Info

Latest : [Github](https://github.com/ideal-postcodes/jquery.postcodes), [NPM](https://www.npmjs.org/package/jquery-postcodes)

Tested against jQuery 1.9, 1.10, 1.11, 2.0 and 2.1.

[![Sauce Test Status](https://saucelabs.com/browser-matrix/cablanchard.svg)](https://saucelabs.com/u/cablanchard) 

***

# Latest Changelog

Version 3.0.0 brings some backwards incompatible changes

- Reformed postcode, address search and key checking APIs
- Request tagging
- Custom error message container
- More appropriately named custom callbacks
- `onLookupSuccess` is now called `onSearchCompleted`
- Removed client side postcode validation

The documentation for version 2.2.4 can be [found here](https://ideal-postcodes.co.uk/documentation/jquery-plugin-2-2-4)

***

# Getting Started

1) **[Download the plugin](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/postcodes.min.js)** and add to your page

<pre><code class="html">&lt;script src=&quot;jquery.postcodes.min.js&quot;&gt;&lt;/script&gt;</code></pre>

2) **[Sign up](https://ideal-postcodes.co.uk)** to get an API key

3) **Setup a Postcode Search Field** by inserting an empty div tag and calling <code>.setupPostcodeLookup()</code>. Pass in a configuration object identifying your API Key and address fields (via CSS selectors)

<pre><code class="html">&lt;div id="postcode_lookup_field"&gt;&lt;/div&gt;
&lt;script&gt;
$('#postcode_lookup_field').setupPostcodeLookup({
	api_key: 'your_key_goes_here',
	// Pass in CSS selectors pointing to your input fields
	output_fields: {
		line_1: '#first_line',
		line_2: '#second_line',
		line_3: '#third_line',
		post_town: '#post_town',
		postcode: '#postcode'
	}
});
&lt;/script&gt;
</code></pre>

***

<a name="fields"></a>
# Available Addressing Data

By rigging just 5 fields in the above example, you will have the necessary information you need (and in the correct formatting) to identify any household in the UK by mail.

However, you can extract more information on each address for your addresss form by passing more properties into the output_fields object.

Here's the complete list of available data fields:

<pre><code class="json">"output_fields": {
	"line_1": "<css_selector>",                      // Address Line 1 
	"line_2": "<css_selector>",                      // Address Line 2
	"line_3": "<css_selector>",                      // Address Line 3
	"post_town": "<css_selector>",                   // Post Town
	"postcode": "<css_selector>",                    // Postcode
    "premise": "<css_selector>",                     // Premise Name
	"udprn" : "<css_selector>",                      // Unique Delivery Point Reference Number
	"organisation_name" : "<css_selector>",          // Organisation Name
	"department_name" : "<css_selector>",            // Department Name
	"po_box" : "<css_selector>",                     // PO Box Number
	"postcode_inward" : "<css_selector>",            // Postcode Inward Code
	"postcode_outward" : "<css_selector>",           // Postcode Outward Code
	"building_number" : "<css_selector>",            // Building Number
	"building_name" : "<css_selector>",              // Building Name
	"sub_building_name" : "<css_selector>",          // Sub Building Name
	"thoroughfare" : "<css_selector>",               // Thoroughfare
	"dependant_thoroughfare" : "<css_selector>",     // Dependant Thoroughfare
	"dependant_locality" : "<css_selector>",         // Dependant Locality
	"double_dependant_locality" : "<css_selector>",  // Double Dependant Locality
	"postcode_type" : "<css_selector>",              // Postcode Type
	"su_organisation_indicator" : "<css_selector>",  // Organisation Type
	"delivery_point_suffix" : "<css_selector>",      // Delivery Point Suffix
	"longitude" : "<css_selector>",                  // Longitude
	"latitude" : "<css_selector>",                   // Latitude
	"northings" : "<css_selector>",                  // Northings
	"eastings" : "<css_selector>",                   // Eastings
	"county" : "<css_selector>",                     // Aggregated County Field
    "postal_county" : "<css_selector>",              // Postal County
    "administrative_county" : "<css_selector>",      // Administrative County
    "traditional_county" : "<css_selector>",         // Traditional County
	"district" : "<css_selector>",                   // District
	"ward" : "<css_selector>"                        // Ward
}
</code></pre>

More information on what these fields mean can be found [here](https://ideal-postcodes.co.uk/documentation/paf-data)

To add them into your form, simply include it in output_fields when initialising Ideal Postcodes. The example below demonstrates how the organisation name can be routed to the input with the id "organisation_field"

<pre><code class="html">&lt;script&gt;
$("#myLookupField").setupPostcodeLookup({
	api_key: 'iddqd',
	output_fields: {
		line_1: '#first_line',
		line_2: '#second_line',
		line_3: '#third_line',
		post_town: '#post_town',
		postcode: '#postcode',
		organisation_name: '#organisation_field'
	}
});
&lt;/script&gt;
</code></pre>

***

<a name="examples"></a>
# Plugin Configuration Examples

The plugin may also be configured for closer integration on a form. Below is a non-exhaustive list of what may be done:

[Pipe additional addressing data to your form like organisation name, county or geolocation](/jquery#additional)

[Style input elements generated by the plugin with CSS classes](/jquery#styling)

[Provide your own customised input or button elements](/jquery#input)

[Add multiple more than one postcode lookup fields on a page](/jquery#multi)

[Handle cases where your key cannot be used. E.g. No balance or limit reached.](/jquery#check)

***

# Other Methods

This plugin also exposes a couple of methods which you may find useful without having to invoke the plugin. These methods are listed below

<br />

## $.idealPostcodes.lookupPostcode(options, callback)

Retrieve all addresses at a given postcode

**Function Arguments**

<div class="table-responsive">
<table class="table">
<thead>
<tr>
<th>Argument</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>options</td>
<td><code>Object</code></td>
<td>A configuration object for postcode lookups. Configurable attributes listed below</td>
</tr>
<tr>
<td>options.postcode</td>
<td><code>String</code></td>
<td>The postcode to lookup (case insensitive)</td>
</tr>
<tr>
<td>options.api_key</td>
<td><code>String</code></td>
<td>API Key to access service</td>
</tr>
<tr>
<td>options.tags</td>
<td><code>Array</code></td>
<td>Label your requests using <code>tags</code>, which can be queried later. Accepts an array of strings. E.g. <code>["CRM"]</code></td>
</tr>
<tr>
<td>callback</td>
<td>Function</td>
<td>Asynchronous handler when data addresses are received. This function accepts 2 arguments. The first is <code>error</code>, which will be <code>null</code> for successful requests. Errors will surface if your key has no balance or one or your predefined limits has been reached. The second argument is <code>addresses</code>, which is an array of address objects matching your query. Invalid postcodes will return an empty array.</td>
</tr>
</tbody>
</table>
</div>

**Example**

<pre><code class="javascript">
var API_KEY = 'iddqd';

$.idealPostcodes.lookupPostcode({ 
	postcode: 'ID11QD', 
	api_key: API_KEY 
}, function (error, addresses) {
	if (error) {
		// Handle error
	}
    console.log(addresses[0]); 
    // prints to console: 
    // {  
    //      postcode: "ID1 1QD", 
    //      post_town: "LONDON", 
    //      line_1: "Kingsley Hall", 
    //      line_2: "Powis Road", 
    //      line_3: ""
    //      ...truncated...
    //  } 
});
</code></pre>

<br />

## $.idealPostcodes.lookupAddress(options, callback)

Performs an address search on the Ideal Postcodes API using a search string

**Function Arguments**

<div class="table-responsive">
<table class="table">
<thead>
<tr>
<th>Argument</th>
<th>Type</th>
<th>Description</th>
</tr>
</thead>
<tbody>
<tr>
<td>options</td>
<td><code>Object</code></td>
<td>A configuration object for address search. Configurable attributes listed below</td>
</tr>
<tr>
<td>options.query</td>
<td><code>String</code></td>
<td>The address query string to search for</td>
</tr>
<tr>
<td>options.api_key</td>
<td><code>String</code></td>
<td>API Key to access service</td>
</tr>
<tr>
<tr>
<td>options.limit</td>
<td><code>Number</code></td>
<td>Maximum number of matches to return (default is 10, maximum is 150)</td>
</tr>
<tr>
<td>options.tags</td>
<td><code>Array</code></td>
<td>Label your requests using <code>tags</code>, which can be queried later. Accepts an array of strings. E.g. <code>["CRM"]</code></td>
</tr>
<tr>
<td>callback</td>
<td>Function</td>
<td>Asynchronous handler when data addresses are received. This function accepts 2 arguments. The first is <code>error</code>, which will be <code>null</code> for successful requests. Errors will surface if your key has no balance or one or your predefined limits has been reached. The second argument is <code>addresses</code>, which is an array of address objects matching your query. Invalid postcodes will return an empty array.</td>
</tr>
</tbody>
</table>
</div>

**Example**

<pre><code class="javascript">
var API_KEY = 'iddqd';

$.idealPostcodes.lookupAddress({ 
	postcode: '10 Downing Street London', 
	api_key: API_KEY 
}, function (error, addresses) {
	if (error) {
		// Handle error
	}
    console.log(addresses[0]); 
    // prints to console: 
    // {  
    //      postcode: "SW1A 2AA", 
    //      post_town: "LONDON", 
    //      line_1: "Prime Minister & First Lord Of The Treasury", 
    //      line_2: "10 Downing Street", 
    //      line_3: ""
    //      ...truncated...
    //  } 
});
</code></pre>

<br />

***

# Available jQuery Configuration Options

Below is a list of optional parameters you can use to style or modify the postcode lookup elements generated by the plugin. Pass this in your configuration object when calling `.setupPostcodeLookup()`.

<div class="table-responsive"><table class="table">
<thead><tr><th>Property</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
<tbody>
<tr>
<td>debug_mode</td>
<td><code>Boolean</code></td>
<td><code>false</code></td>
<td>When set to true, any errors will display the error messages and response code</td>
</tr>
<tr>
<td>disable_interval</td>
<td><code>Number</code></td>
<td>1000</td>
<td>Sets a short time period (in ms) after a lookup in which the lookup button is disabled</td>
</tr>
<tr>
<td>remove_organisation</td>
<td><code>Boolean</code></td>
<td><code>false</code></td>
<td>Removes the organisation name from the address lines (line_1, line_2, line_3). When an organisation is registered at an address, clear addressing guidelines dictate that the organisation name must be at the head of the address (line_1). Switching this flag to true will remove the organisation name.</td>
</tr>

<tr>
<td>check_key</td>
<td><code>Boolean</code></td>
<td><code>false</code></td>
<td><p>If enabled, the plugin will check if the key is in a usable state before initialising itself.</p><p>The check can fail if:</p><ul>
<li>Your key has no remaining lookups</li>
<li>Your key has run into its lookup limit for the day</li>
<li>Your key is requested from a URL which is not on your whitelist</li>
<li>The user seeking to use the key has exceeded their limit for the day</li>
</ul>
<p>If the check fails, the plugin will not initialise. You can use the callbacks provided to customise your response to a successful or unsuccessful key check.</p></td>
</tr>

<tr>
<td>address_search</td>
<td><code>Boolean</code> or <code>Object</code></td>
<td><code>false</code></td>
<td>
    <p>If enabled, any lookups which do not validate as a standard postcode will be passed to the address search API instead.</p>
    <p>You can configure address search by passing in an <code>Object</code>. Currently this configuration object only accepts one parameter: limit. Limit determines the maximum number of search results to return. (Default is 10, maximum is 150)</p>
</td>
</tr>
<tr>
<td>tags</td>
<td><code>Array</code></td>
<td><code>undefined</code></td>
<td>
	<p>Label your requests using <code>tags</code>, which can be queried later. Accepts an array of strings. E.g. <code>["CRM"]</code></p>
</td>
</tr>

<tr class="active">
<td colspan="4">
<b>Input Field.</b> Modifies the postcode input field
</td>
</tr>
<tr>
<td>input_class</td>
<td><code>String</code></td>
<td>""</td>
<td>Sets the class of the input field</td>
</tr>
<tr>
<td>input_label</td>
<td><code>String</code></td>
<td>"Please enter your postcode"</td>
<td>Sets the embedded label</td>
</tr>
<tr>
<td>input</td>
<td><code>String</code></td>
<td><code>undefined</code></td>
<td>If you wish to use your own input field, you can specify the unique css selector for that field here. E.g. "#myCustomPostcodeLookupField". Please note that all input field parameters like <code>input_class</code> and <code>input_label</code> will be ignored. It will be up to you to implement styling and any desired behaviours in your input field.</td>
</tr>

<tr class="active">
<td colspan="4">
<b>Lookup Button.</b> Modifies the lookup button
</td>
</tr>
<tr>
<td>button_class</td>
<td><code>String</code></td>
<td>""</td>
<td>Sets the class of the lookup button</td>
</tr>
<tr>
<td>button_label</td>
<td><code>String</code></td>
<td>"Find my Address"</td>
<td>Sets the label on the button</td>
</tr>
<tr>
<td>button_disabled_message</td>
<td><code>String</code></td>
<td>"Looking up postcode..."</td>
<td>Sets label of the button when it is temporarily disabled (during a lookup)</td>
</tr>
<td>button</td>
<td><code>String</code></td>
<td><code>undefined</code></td>
<td>If you wish to use your own lookup button, you can specify the unique css selector for that field here. E.g. "#customLookupTrigger". Any "clickable" DOM element will work as a valid "button" to trigger a lookup. Please note that all other parameters like <code>button_disabled_message</code> will be ignored. It will be up to you to implement styling and any desired behaviours for your lookup button.</td>
</tr>

<tr class="active">
<td colspan="4">
<b>Dropdown Menu.</b> Modifies the address selection menu (a select element)
</td>
</tr>
<tr>
<td>dropdown_class</td>
<td><code>String</code></td>
<td>""</td>
<td>Sets the class of the dropdown select menu</td>
</tr>
<tr>
<td>dropdown_select_message</td>
<td><code>String</code></td>
<td>"Please select your address"</td>
<td>Sets the topline message for the dropdown menu</td>
</tr>
<tr>
<td>dropdown_container</td>
<td><code>String</code></td>
<td><code>undefined</code></td>
<td>Specify a custom container for the dropdown menu using a CSS selector</td>
</tr>
<tr>

<tr class="active">
<td colspan="4">
<b>Error Messages.</b> The error message in various invalid states
</td>
</tr>
<tr>
<td>error_message_class</td>
<td><code>String</code></td>
<td>""</td>
<td>Sets the class of the error message p element</td>
</tr>
<tr>
<td>error_message_default</td>
<td><code>String</code></td>
<td>"Sorry, we weren't able to get the address you were looking for. Please type your address manually"</td>
<td>The default error message following a failed postcode lookup.</td>
</tr>
<tr>
<td>error_message_<br/>invalid_postcode</td>
<td><code>String</code></td>
<td>"Please check your postcode, it seems to be incorrect"</td>
<td>The error message following a postcode which does not pass a basic regex test</td>
</tr>
<tr>
<td>error_message_not_found</td>
<td><code>String</code></td>
<td>"Your postcode could not be found. Please type in your address"</td>
<td>The error message following a postcode lookup in which the postcode does not exist</td>
</tr>
<tr>
<td>error_message_container</td>
<td><code>String</code></td>
<td><code>undefined</code></td>
<td>Specify a custom container for the error message container menu using a CSS selector. If an error prompt needs to be shown (e.g. postcode not found) a &lt;p&gt; tag containing the message is inserted into the specified container.</td>
</tr>
<tr>

<tr class="active">
<td colspan="4">
<b>Callbacks.</b> You may also specify functions that will be invoked at various stages of making a postcode lookup
</td>
</tr>
<tr>
<td>onLoaded</td>
<td><code>function</code></td>
<td>undefined</td>
<td>A function invoked once the plugin has initialised. <br />If the plugin is configured to check the key, i.e. <code>check_key: true</code>, this callback will only be invoked if the key is usable.</td>
</tr>
<tr>
<td>onFailedCheck</td>
<td><code>function</code></td>
<td>undefined</td>
<td>A function invoked if <code>check_key</code> is enabled and the check fails.</td>
</tr>
<tr>
<td>onSearchCompleted</td>
<td><code>function</code></td>
<td>undefined</td>
<td>A function invoked when a successful API request is made. An API request is made <br />Note that this is also invoked on 400-type errors such as "postcode not found" or "lookup balance exhausted". This property takes a function, which accepts a `data` argument representing the raw JSON response.</td>
</tr>
<tr>
<td>onAddressesReceived</td>
<td><code>function</code></td>
<td>undefined</td>
<td>A function invoked when a successful API request is made and at least 1 address is returned. This property takes a function, which accepts an `addresses` argument representing the addresses returned by the API.</td>
</tr>
<tr>
<td>onAddressSelected</td>
<td><code>function</code></td>
<td>undefined</td>
<td>A function invoked when the user selects an address option on the plugin's dropdown menu. This property takes a function, which accepts a <code>address</code> argument representing the full details of the selected address. <code>this</code> is bound to the selected DOM element.</td>
</tr>
<tr>
<td>onDropdownCreated</td>
<td><code>function</code></td>
<td>undefined</td>
<td>A function invoked addresses have been retrieved and the dropdown has been inserted into the DOM. This property takes a function, which accepts a <code>$dropdown</code> argument representing the jQuery wrapped dropdown element.</td>
</tr>
<tr>
<td>onLookupTriggered</td>
<td><code>function</code></td>
<td>undefined</td>
<td>A function invoked when the user triggers a lookup (e.g. by clicking the button). This callback is invoked before any request is made to the API.</td>
</tr>
<tr>
<td>onSearchError</td>
<td><code>function</code></td>
<td>undefined</td>
<td>A function invoked when the API returns an error. This property takes a function, which accepts an <code>error</code> argument representing the error returned by the API.<br />Examples of errors includes "lookup balance exhausted" and "lookup limit reached" errors.</td>
</tr>
</tbody></table></div>
