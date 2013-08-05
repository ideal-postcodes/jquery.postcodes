# Ideal Postcodes jQuery Plugin

Add UK Address lookups using postcodes on any address form using Royal Mail's addressing database

This plugin is the fastest way to integrate Ideal Postcodes' UK lookup API on a user data entry form.

jQuery.postcodes generates 2 form elements within a specified div element. These are an **input field** to receive postcode inputs from the user and a **Button** to run address lookups via the Ideal Postcodes API.

If a matchingis found, a selection menu is created and the selected address is piped into the form.

If no matching postcode is found or an error occurred, the plugin will append an appropriate message.


## Getting Started
Download the [production version][min] or the [development version][max].

[min]: https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/jquery.postcodes.min.js
[max]: https://raw.github.com/ideal-postcodes/jquery.postcodes/master/dist/jquery.postcodes.js

[Sign up](https://ideal-postcodes.co.uk/users/sign-up) to receive an API key

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