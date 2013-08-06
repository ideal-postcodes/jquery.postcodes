# Ideal-Postcodes.co.uk jQuery Plugin

Add UK address lookups with a simple postcode input field on any web form with the Ideal-Postcodes.co.uk API. Ideal Postcodes uses Royal Mail's addressing database, the Postcode Address File (PAF).

PAF is licensed from the Royal Mail and is, unfortunately, not free to use. Ideal Postcodes aims to be simple to use and fairly priced to use for web and mobile developers.

## How it Works

This plugin creates an input field to lookup postcodes on the Ideal Postcodes API. If the user searches a valid postcode, a dropdown menu is displayed and the selected address is piped into appropriate fields.

![Ideal Postcodes Plugin Example](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/misc/ideal_postcodes_snippet.png)

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/jquery.postcodes.min.js
[max]: https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/jquery.postcodes.js

[Sign up](https://ideal-postcodes.co.uk) to get an API key

Load the plugin on your page

```html
<script src="jquery.js"></script>
<script src="dist/jquery.postcodes.min.js"></script>
```

Include an empty div tag to house the postcode entry elements

```html
<div id="postcode_lookup_field"></div>
```

Call idealPostcodes() on your empty div tag wrapped in a jQuery object, passing your API key and CSS selectors to indicate where the results should be piped to.

```html
<script>
$('#postcode_lookup_field').idealPostcodes({
	api_key: 'ak_Iddqd8Idkfa7Idchoppers8',  // Set your API key
	address_line_one: '#first_line',	// Enter CSS selectors to your input...
	address_line_two: '#second_line',	// fields to pipe your results
	address_line_three: '#third_line',
	post_town_line: '#town',
	postcode_line: '#postcode'
});
</script>
```

## Testing
Use the postcode "ID1 1QD".

## Documentation
Documentation can be found [here](https://ideal-postcodes.co.uk/documentation)