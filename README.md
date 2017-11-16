# UK Postcode Lookup jQuery Plugin

Add UK address lookups with a simple postcode input field on any web form with the Ideal-Postcodes.co.uk API. Ideal Postcodes uses Royal Mail's addressing database, the Postcode Address File (PAF).

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

Please use jQuery 1.9.x or higher. This plugin has been tested against jQuery 1.9.x, 1.10.x, 1.11.x, 2.0.x, 2.1.x, 2.2.x, 3.0.x. 3.1.x and 3.2.x

You may run the plugin locally and test in your browser

```bash
$ npm start # starts a HTTP server

# Navigate to the `examples` folder and select an example in a *.html file
```

Our test postcodes are:
- **ID1 1QD** Returns a successful postcode lookup response (2000)
- **ID1 KFA** Returns "postcode not found" error (4040)
- **ID1 CLIP** Returns "no lookups remaining" error (4020)
- **ID1 CHOP** Returns "daily (or individual) lookup limit breached" error (4021)

## License

MIT
