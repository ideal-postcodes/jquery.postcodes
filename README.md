# Postcodes jQuery Plugin

Add UK address lookups with a simple postcode input field on any web form with the Ideal-Postcodes.co.uk API. Ideal Postcodes uses Royal Mail's addressing database, the Postcode Address File (PAF).

## Registering

PAF is licensed from the Royal Mail and is, unfortunately, not free to use. Ideal Postcodes aims to be simple to use and fairly priced to use for web and mobile developers.

We charge _2p_ per [external](https://ideal-postcodes.co.uk/termsandconditions#external) lookup.

## How it Works

This plugin creates an input field to lookup postcodes on the Ideal Postcodes API. If the user searches a valid postcode, a dropdown menu is displayed and the selected address is piped into appropriate fields.

![Ideal Postcodes Plugin Example](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/misc/ideal_postcodes_snippet.png)

## Getting Started
1) [Download the minified version](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/postcodes.min.js)

[min]: https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/jquery.postcodes.min.js

2) [Sign up](https://ideal-postcodes.co.uk) to get an API key

3) Load the plugin on your page

```html
<script src="jquery.js"></script>
<script src="dist/jquery.postcodes.min.js"></script>
```
	
4) Include an empty div tag to house the postcode entry elements

```html
<div id="postcode_lookup_field"></div>
```

5) Call idealPostcodes() on your empty div tag wrapped in a jQuery object, passing your API key and CSS selectors to indicate where the results should be piped to.

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

6) Test using the postcode "ID1 1QD"

## Advanced Usage

### $.lookupPostcode(postcode, api_key, success[, error])

Performs a postcode lookup on the Ideal Postcodes API

**Arguments:**

- **postcode** (string) The postcode to lookup (case insensitive)
- **api_key** (string) Key to access service
- **success** (function) Asynchronous handler when data is received. If data.code !== 2000, an error has occured 
- **error** (function, optional) Asynchronous handler in case of request timeout

**Example:**

```javascript
var API_KEY = 'ak_Iddqd8Idkfa7Idchoppers8';

$.lookupPostcode('ID11QD', API_KEY, function (data) {
	console.log(data.result[0]); // => {postcode: "ID1 1QD", post_town: "LONDON", line_1: "Kingsley Hall", line_2: "Powis Road", line_3: ""} 
})
```

## Documentation
More documentation can be found [here](https://ideal-postcodes.co.uk/documentation)