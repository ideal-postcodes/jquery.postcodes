# Changelog

## [3.0.7] 2018-03-14
- Fix: Custom API endpoint can be passed to setup configuration object
- Fix: Class Methods `lookupPostcode`, `lookupAddress` and `checkKey` accept custom endpoint
- Reduce library size. Commented out optional configuration attributes which currently serve as documentation. Will be removed altogether in final minified payload

## [3.0.6] 2017-11-02
- Fix: Sublicensee key now passed into key checking API calls if `check_key: true`

## [3.0.5] 2017-11-02
- Added placeholder to input field. The placeholder is determined by the `placeholder_label` attribute
- Added `onDropdownDestroyed` destroyed callback, invoked when dropdown is removed from DOM following a new search

## [3.0.4] 2016-07-29
- Added shouldLookupTrigger callback

## [3.0.3] 2016-05-05
- Added licensee attribute to configuration object

## [3.0.2] 2016-05-04
- API Request timeouts now bubble up to API. Default request timeout increased to 10 seconds.

## [3.0.1] 2016-01-25
- Significant API backwards incompatible API changes
- Simplified $.idealPostcodes.lookupPostcode and $.idealPostcodes.lookupAddress APIs
- Added request tagging read more here
- Added new callbacks and renamed existing callbacks
- onLookupSuccess is now onSearchCompleted
- Added callbacks onAddressesReceived, onDropdownCreated, onLookupTriggered, onSearchError
- Added ability to insert error messages into custom containers

## [2.2.4] 2015-03-20
- Configuration object now accepts dropdown_container to specify a custom container to display the results dropdown

## [2.2.2] 2015-02-09
- onLookupSuccess is now also triggered when pre-flight postcode validation fails

## [2.2.1] 2014-11-19
- Added optional max_results for address searches

## [2.2.0] 2014-11-17
- Added fallback to address search if address_search: true. Any postcode search which does not validate as a postcode will be passed through to the address search API.

## [2.1.2] 2014-11-10
- Key checks are only performed against the API if the plugin is invoked in the DOM and not upon initialisation
- Results from a key check are now cached and multiple calls to the same key are merged into the same request

## [2.1.1] 2014-07-21
- Changed lookup behaviour. Looking up a new postcode no longer clears existing results

## [2.1.0] 2014-06-30
- Added option to strip organisation name from address lines

## [2.0.1] 2014-06-23
- Deprecated old configuration method of .setup() followed by $.fn.setupPostcodeLookup
- Added pre-initialisation checks
- Added callbacks: onLoaded, onCheckFailed

## [1.3.1] 2014-06-20
- Bug fix for IE7

## [1.3.0] 2014-04-23
- Added custom input and lookup button configuration parameters
- Avoids use of object.class. For Safari 4.0 and 5.0
- Avoid setting type. Fixes for earlier jQuery version in older browsers
- Fixed removal of elements from DOM

## [1.2.0] 2014-03-20
- Significant rewrite to allow for multiple lookups per page

## [1.1.2] 2014-03-20

- Minor fix for when label is selected in address dropdown
