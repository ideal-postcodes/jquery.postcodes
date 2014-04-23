[![Build Status](https://travis-ci.org/ideal-postcodes/jquery.postcodes.png)](https://travis-ci.org/ideal-postcodes/jquery.postcodes) 
![Dependency Status](https://david-dm.org/ideal-postcodes/jquery.postcodes.png)

# UK Postcode Lookup jQuery Plugin

Add UK address lookups with a simple postcode input field on any web form with the Ideal-Postcodes.co.uk API. Ideal Postcodes uses Royal Mail's addressing database, the Postcode Address File (PAF).

PAF is licensed from the Royal Mail and is, unfortunately, not free to use. Ideal Postcodes aims to be simple to use and fairly priced to use for web and mobile developers. We charge **2p** per [external](https://ideal-postcodes.co.uk/termsandconditions#external) lookup.

## How it Works

This plugin creates an input field to lookup postcodes on the Ideal Postcodes API. If your user searches a valid postcode, a dropdown menu is displayed and the selected address is piped into appropriate fields.

The plugin provides addresses according to [Royal Mail's Addressing Guidelines](http://www.royalmail.com/personal/help-and-support/How-do-I-address-my-mail-correctly). i.e. Maximum of 3 address lines, a Post Town and Postcode.

![Ideal Postcodes Plugin Example](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/misc/ideal_postcodes_snippet.png)

## Getting Started
1) **[Download the plugin](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/postcodes.min.js)** and add to your page

```html
<script src="jquery.js"></script>
<script src="jquery.postcodes.min.js"></script>
```

2) **[Sign up](https://ideal-postcodes.co.uk)** to get an API key

3) **Setup a Postcode Search Field** by inserting an empty div tag and calling .setupPostcodeLookup(). Pass in a configuration object identifying (at minimum) your API Key and your address fields (via CSS selectors)

```html
<div id="postcode_lookup_field"></div>
<script>
$('#postcode_lookup_field').setupPostcodeLookup({
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

## Available Data

By rigging just 5 fields in the above example, you will have the necessary information you need (and in the correct formatting) to identify any household in the UK by mail. However, you can extract more information on each address by passing additional properties into the output_fields object. The complete list of available data fields can be found [here](https://ideal-postcodes.co.uk/documentation/paf-data).

## Documentation
More documentation can be found [here](https://ideal-postcodes.co.uk/documentation/jquery-plugin)

## Testing

```
grunt test
```

Tested against jQuery versions: 1.7.x, 1.8.x, 1.9.x, 1.10.x, 1.11.x, 2.0.x, 2.1.x

## License
MIT

## Changelog

*v1.2.0*
- Significant rewrite to allow for multiple lookups per page

*v1.1.2*
- Minor fix for when label is selected in address dropdown

