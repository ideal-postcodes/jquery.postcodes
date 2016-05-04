# UK Postcode Lookup jQuery Plugin

Add UK address lookups with a simple postcode input field on any web form with the Ideal-Postcodes.co.uk API. Ideal Postcodes uses Royal Mail's addressing database, the Postcode Address File (PAF).

![Dependency Status](https://david-dm.org/ideal-postcodes/jquery.postcodes.png) 
[![Build Status](https://travis-ci.org/ideal-postcodes/jquery.postcodes.png)](https://travis-ci.org/ideal-postcodes/jquery.postcodes) 
[![Sauce Test Status](https://saucelabs.com/buildstatus/cablanchard)](https://saucelabs.com/u/cablanchard)
[![Sauce Test Status](https://saucelabs.com/browser-matrix/cablanchard.svg)](https://saucelabs.com/u/cablanchard)

PAF is licensed from the Royal Mail and incurs a license fee per lookup. We make PAF available to the public at **2p** per [external](https://ideal-postcodes.co.uk/termsandconditions#external) lookup.

## How it Works

This plugin creates an input field to lookup postcodes on the Ideal Postcodes API. If your user searches a valid postcode, a dropdown menu is displayed and the selected address is piped into appropriate fields.

The plugin provides addresses according to [Royal Mail's Addressing Guidelines](http://www.royalmail.com/personal/help-and-support/How-do-I-address-my-mail-correctly). This consists of 3 address lines, a Post Town and Postcode and is sufficient to uniquely identify a premise in the UK.

![Ideal Postcodes Plugin Example](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/examples/ideal_postcodes_snippet.png)

## Getting Started
1) **[Download the plugin](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/postcodes.min.js)** and add to your page

```html
<script src="jquery.js"></script>
<script src="jquery.postcodes.min.js"></script>
```

2) **[Sign up](https://ideal-postcodes.co.uk)** to get an API key

3) **Setup a Postcode Search Field** by inserting an empty div tag and calling `.setupPostcodeLookup()`. Pass in a configuration object identifying specifying your API Key and address fields (using CSS selectors)

```html
<div id="postcode_lookup_field"></div>
<script>
$('#postcode_lookup_field').setupPostcodeLookup({
	// Set your API key
	api_key: 'iddqd',
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

## Documentation & Configuration

[Latest documentation can be found at ideal-postcodes.co.uk](https://ideal-postcodes.co.uk/documentation/jquery-plugin)

This plugin also allows you to draw additional addressing information. The complete list of available data fields can be found [here](https://ideal-postcodes.co.uk/documentation/paf-data).

There are a lot of ways to configure the plugin to create an address lookup feature that suits most use cases. The documentation will guide you through how to use additional configuration options like customised styling, customised inputs & triggers, useful callbacks, key checking, etc.

For examples of the more advanced ways you can configure the plugin take a look at [ideal-postcodes.co.uk/jquery](https://ideal-postcodes.co.uk/jquery).

## Testing

Run automated tests with

```
grunt test
```

Please use jQuery 1.9.x or higher. This plugin has been tested against jQuery 1.9.x, 1.10.x, 1.11.x, 2.0.x, 2.1.x and 2.2.x.

Our test postcodes are:
- **ID1 1QD** Returns a successful postcode lookup response (2000)
- **ID1 KFA** Returns "postcode not found" error (4040)
- **ID1 CLIP** Returns "no lookups remaining" error (4020)
- **ID1 CHOP** Returns "daily (or individual) lookup limit breached" error (4021)

## License
MIT

## Changelog

*v3.0.2*
- API Request timeouts now bubble up to API. Default request timeout increased to 10 seconds.

*v3.0.0*
- Significant API backwards incompatible API changes
- Simplified `$.idealPostcodes.lookupPostcode` and `$.idealPostcodes.lookupAddress` APIs
- Added request tagging [read more here](https://ideal-postcodes.co.uk/documentation/metadata)
- Added new callbacks and renamed existing callbacks
- `onLookupSuccess` is now `onSearchCompleted`
- Added callbacks `onAddressesReceived`, `onDropdownCreated`, `onLookupTriggered`, `onSearchError`
- Added ability to insert error messages into custom containers

*v2.2.4*
- Configuration object now accepts `dropdown_container` to specify a custom container to display the results dropdown

*v2.2.2*
- onLookupSuccess is now also triggered when pre-flight postcode validation fails

*v2.2.1*
- Added optional max_results for address searches

*v2.2.0*
- Added fallback to address search if address_search: true. Any postcode search which does not validate as a postcode will be passed through to the address search API.

*v2.1.2*
- Key checks are only performed against the API if the plugin is invoked in the DOM and not upon initialisation
- Results from a key check are now cached and multiple calls to the same key are merged into the same request

*v2.1.1*
- Changed lookup behaviour. Looking up a new postcode no longer clears existing results

*v2.1.0*
- Added option to strip organisation name from address lines

*v2.0.0*
- Deprecated old configuration method of .setup() followed by $.fn.setupPostcodeLookup
- Added pre-initialisation checks
- Added callbacks: onLoaded, onCheckFailed

*v1.3.1*
- Bug fix for IE7

*v1.3.0*
- Added custom input and lookup button configuration parameters

*v1.2.2*
- Avoids use of object.class. For Safari 4.0 and 5.0
- Avoid setting type. Fixes for earlier jQuery version in older browsers

*v1.2.1*
- Fixed removal of elements from DOM

*v1.2.0*
- Significant rewrite to allow for multiple lookups per page

*v1.1.2*
- Minor fix for when label is selected in address dropdown

