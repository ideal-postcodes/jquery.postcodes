# Ideal Postcodes jQuery Plugin

Add UK Address lookups using postcodes on any address form using Royal Mail's addressing database, the Postcode Address File (PAF).

![Ideal Postcodes Plugin Example](https://raw.github.com/ideal-postcodes/jquery.postcodes/master/misc/ideal_postcodes_snippet.png)

## How it Works

This plugin creates an input field to lookup postcodes on the Ideal Postcodes API. If the user, a selection menu is created and the selected address is piped into the form.

If no matching postcode is found or an error occurred, the plugin will append an appropriate message.

## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/jquery.postcodes.min.js
[max]: https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/jquery.postcodes.js

[Sign up](https://ideal-postcodes.co.uk) to get an API key

In your web page:

```html
<script src="jquery.js"></script>
<script src="dist/jquery.postcodes.min.js"></script>
<div id="postcode_lookup_field"></div>	
<script>
$('#postcode_lookup_field').idealPostcodes({
	api_key: 'ak_Iddqd8Idkfa7Idchoppers8',
	address_line_one: '#first_line',	
	address_line_two: '#second_line',					
	address_line_three: '#third_line',
	post_town_line: '#town',
	postcode_line: '#postcode'
});
</script>
```

## Documentation
Documentation can be found [here](https://ideal-postcodes.co.uk/documentation)

## Testing
Use the postcode "ID1 1QD" to test the service