# Postcodes jQuery Plugin

Add UK address lookups with a simple postcode input field on any web form with the Ideal-Postcodes.co.uk API. Ideal Postcodes uses Royal Mail's addressing database, the Postcode Address File (PAF).

## Registering

PAF is licensed from the Royal Mail and is, unfortunately, not free to use. Ideal Postcodes aims to be simple to use and fairly priced to use for web and mobile developers.

We charge **2p** per [external](https://ideal-postcodes.co.uk/termsandconditions#external) lookup.

## How it Works

This plugin creates an input field to lookup postcodes on the Ideal Postcodes API. If the user searches a valid postcode, a dropdown menu is displayed and the selected address is piped into appropriate fields.

The plugin provides addresses according to [Royal Mail's Addressing Guidelines](http://www.royalmail.com/personal/help-and-support/How-do-I-address-my-mail-correctly). i.e. Maximum of 3 address lines, a Post Town and Postcode. More address data is also available.

![Ideal Postcodes Plugin Example](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/misc/ideal_postcodes_snippet.png)

## Getting Started
1) **[Download the plugin](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/postcodes.min.js)** and add to your page

```html
<script src="jquery.js"></script>
<script src="jquery.postcodes.min.js"></script>
```

2) **[Sign up](https://ideal-postcodes.co.uk)** to get an API key

3) **Configure Ideal Postcodes** by applying your API Key and identifying your address fields with CSS selectors 

```html
<script>
$.idealPostcodes.setup({
	// Set your API key
	api_key: 'ak_Iddqd8Idkfa7Idchoppers8',
	// Pass in CSS selectors pointing to your input fields to pipe the results
	output_fields: {
		line_1: '#first_line',
	  line_2: '#second_line',
	  line_3: '#third_line',
	  post_town: '#post_town',
	  postcode: '#postcode'
	}
});
</script>
```

4) **Setup a Postcode Search Field** by inserting an empty div tag and calling .setupPostcodeLookup()

```html
<div id="postcode_lookup_field"></div>
<script>
$('#postcode_lookup_field').setupPostcodeLookup();
</script>
```

5) **Test for free** using the postcode "ID1 1QD"

## Complete List of Available Data

By rigging just 5 fields in the above example, you will have the necessary information you need (and in the correct formatting) to identify any household in the UK by mail.

However, you can extract more information on each address for your addresss form by passing more properties into the output_fields object.

Here's the complete list of available data fields:

```javascript
output_fields: {
	line_1: "<css_selector>",												// Address Line 1 
	line_2: "<css_selector>",												// Address Line 2
	line_3: "<css_selector>",												// Address Line 3
	post_town: "<css_selector>",										// Post Town
	postcode: "<css_selector>",											// Postcode
	udprn : "<css_selector>",												// Unique Delivery Point Reference Number
	organisation_name : "<css_selector>",						// Organisation Name
	department_name : "<css_selector>",							// Department Name
	po_box : "<css_selector>",											// PO Box Number
	postcode_inward : "<css_selector>",							// Postcode Inward Code
	postcode_outward : "<css_selector>",						// Postcode Outward Code
	building_number : "<css_selector>",							// Building Number
	building_name : "<css_selector>",								// Building Name
	sub_building_name : "<css_selector>",						// Sub Building Name
	thoroughfare : "<css_selector>",								// Thoroughfare
	dependant_thoroughfare : "<css_selector>",			// Dependant Thoroughfare
	dependant_locality : "<css_selector>",					// Dependant Locality
	double_dependant_locality : "<css_selector>",		// Double Dependant Locality
	postcode_type : "<css_selector>",								// Postcode Type
	su_organisation_indicator : "<css_selector>",		// Organisation Type
	delivery_point_suffix : "<css_selector>"				// Delivery Point Suffix
}
```

More information on what these fields mean can be found [here](https://ideal-postcodes.co.uk/paf-data)

To add them into your form, simply include it in output_fields when initialising Ideal Postcodes. The example below demonstrates how the organisation name can be routed to the input with the id "organisation_field"

```html
<script>
$.idealPostcodes.setup({
	api_key: 'ak_Iddqd8Idkfa7Idchoppers8',
	output_fields: {
		line_1: '#first_line',
	  line_2: '#second_line',
	  line_3: '#third_line',
	  post_town: '#post_town',
	  postcode: '#postcode',
	  organisation_name: '#organisation_field'
	}
});
</script>
```

## Advanced Usage

### $.idealPostcodes.lookupPostcode(postcode, api_key, success[, error])

Performs a postcode lookup on the Ideal Postcodes API

**Arguments:**

- **postcode** (string) The postcode to lookup (case insensitive)
- **api_key** (string) Key to access service
- **success** (function) Asynchronous handler when data is received. If data.code !== 2000, an error has occured 
- **error** (function, optional) Asynchronous handler in case of request timeout

**Example:**

```javascript
var API_KEY = 'ak_Iddqd8Idkfa7Idchoppers8';

$.idealPostcodes.lookupPostcode('ID11QD', API_KEY, function (data) {
	console.log(data.result[0]); // => {postcode: "ID1 1QD", post_town: "LONDON", line_1: "Kingsley Hall", line_2: "Powis Road", line_3: ""} 
})
```

## Documentation
More documentation can be found [here](https://ideal-postcodes.co.uk/documentation)

## License
MIT

## Changelog

**v 1.0.0**
- Refactored setup into 2 step process for more flexibility
- Expanded postcode lookup to include complete PAF data including UDPRN, Organisation Names, etc.
- Bug fixes