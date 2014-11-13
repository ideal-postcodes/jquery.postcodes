(function($) {
  
var fake = $.ajax.fake;

var testPostcodeResult = {
  "result": [
	{
	 "postcode":"ID1 1QD",
	 "postcode_inward":"1QD",
	 "postcode_outward":"ID1",
	 "post_town":"LONDON",
	 "dependant_locality":"",
	 "double_dependant_locality":"",
	 "thoroughfare":"Barons Court Road",
	 "dependant_thoroughfare":"",
	 "building_number":"2",
	 "building_name":"",
	 "sub_building_name":"",
	 "po_box":"",
	 "department_name":"",
	 "organisation_name":"",
	 "udprn":25962203,
	 "postcode_type":"S",
	 "su_organisation_indicator":"",
	 "delivery_point_suffix":"1G",
	 "line_1":"2 Barons Court Road",
	 "line_2":"",
	 "line_3":"",
	 "country": "England",
	 "county": "",
	 "district": "Hammersmith and Fulham",
	 "ward": "North End",
	 "longitude":-0.208644362766368,
	 "latitude":51.4899488390558,
	 "eastings":524466,
	 "northings":178299
  },
  {
	 "postcode":"ID1 1QD",
	 "postcode_inward":"1QD",
	 "postcode_outward":"ID1",
	 "post_town":"LONDON",
	 "dependant_locality":"",
	 "double_dependant_locality":"",
	 "thoroughfare":"Barons Court Road",
	 "dependant_thoroughfare":"",
	 "building_number":"2",
	 "building_name":"Basement Flat",
	 "sub_building_name":"",
	 "po_box":"",
	 "department_name":"",
	 "organisation_name":"",
	 "udprn":52618355,
	 "postcode_type":"S",
	 "su_organisation_indicator":"",
	 "delivery_point_suffix":"3A",
	 "line_1":"Basement Flat",
	 "line_2":"2 Barons Court Road",
	 "line_3":"",
	 "country": "England",
	 "county": "",
	 "district": "Hammersmith and Fulham",
	 "ward": "North End",
	 "longitude":-0.208644362766368,
	 "latitude":51.4899488390558,
	 "eastings":524466,
	 "northings":178299
  },
  {
	 "postcode":"ID1 1QD",
	 "postcode_inward":"1QD",
	 "postcode_outward":"ID1",
	 "post_town":"LONDON",
	 "dependant_locality":"",
	 "double_dependant_locality":"",
	 "thoroughfare":"Barons Court Road",
	 "dependant_thoroughfare":"",
	 "building_number":"4",
	 "building_name":"",
	 "sub_building_name":"",
	 "po_box":"",
	 "department_name":"",
	 "organisation_name":"",
	 "udprn":25962215,
	 "postcode_type":"S",
	 "su_organisation_indicator":"",
	 "delivery_point_suffix":"1W",
	 "line_1":"4 Barons Court Road",
	 "line_2":"",
	 "line_3":"",
	 "country": "England",
	 "county": "",
	 "district": "Hammersmith and Fulham",
	 "ward": "North End",
	 "longitude":-0.208644362766368,
	 "latitude":51.4899488390558,
	 "eastings":524466,
	 "northings":178299
  },
  {
	 "postcode":"ID1 1QD",
	 "postcode_inward":"1QD",
	 "postcode_outward":"ID1",
	 "post_town":"LONDON",
	 "dependant_locality":"",
	 "double_dependant_locality":"",
	 "thoroughfare":"Barons Court Road",
	 "dependant_thoroughfare":"",
	 "building_number":"4",
	 "building_name":"",
	 "sub_building_name":"Basement",
	 "po_box":"",
	 "department_name":"",
	 "organisation_name":"",
	 "udprn":25962189,
	 "postcode_type":"S",
	 "su_organisation_indicator":"",
	 "delivery_point_suffix":"2P",
	 "line_1":"Basement",
	 "line_2":"4 Barons Court Road",
	 "line_3":"",
	 "country": "England",
	 "county": "",
	 "district": "Hammersmith and Fulham",
	 "ward": "North End",
	 "longitude":-0.208644362766368,
	 "latitude":51.4899488390558,
	 "eastings":524466,
	 "northings":178299
  },
  {
	 "postcode":"ID1 1QD",
	 "postcode_inward":"1QD",
	 "postcode_outward":"ID1",
	 "post_town":"LONDON",
	 "dependant_locality":"",
	 "double_dependant_locality":"",
	 "thoroughfare":"Barons Court Road",
	 "dependant_thoroughfare":"",
	 "building_number":"6",
	 "building_name":"",
	 "sub_building_name":"",
	 "po_box":"",
	 "department_name":"",
	 "organisation_name":"",
	 "udprn":25962218,
	 "postcode_type":"S",
	 "su_organisation_indicator":"",
	 "delivery_point_suffix":"1Y",
	 "line_1":"6 Barons Court Road",
	 "line_2":"",
	 "line_3":"",
	 "country": "England",
	 "county": "",
	 "district": "Hammersmith and Fulham",
	 "ward": "North End",
	 "longitude":-0.208644362766368,
	 "latitude":51.4899488390558,
	 "eastings":524466,
	 "northings":178299
  },
  {
	 "postcode":"ID1 1QD",
	 "postcode_inward":"1QD",
	 "postcode_outward":"ID1",
	 "post_town":"LONDON",
	 "dependant_locality":"",
	 "double_dependant_locality":"",
	 "thoroughfare":"Barons Court Road",
	 "dependant_thoroughfare":"",
	 "building_number":"8",
	 "building_name":"",
	 "sub_building_name":"",
	 "po_box":"",
	 "department_name":"",
	 "organisation_name":"",
	 "udprn":25962219,
	 "postcode_type":"S",
	 "su_organisation_indicator":"",
	 "delivery_point_suffix":"1Z",
	 "line_1":"8 Barons Court Road",
	 "line_2":"",
	 "line_3":"",
	 "country": "England",
	 "county": "",
	 "district": "Hammersmith and Fulham",
	 "ward": "North End",
	 "longitude":-0.208644362766368,
	 "latitude":51.4899488390558,
	 "eastings":524466,
	 "northings":178299
  },
  {
	"postcode": "ID1 1QD",
	"postcode_inward": "1QD",
	"postcode_outward": "ID1",
	"post_town": "LONDON",
	"dependant_locality": "",
	"double_dependant_locality": "",
	"thoroughfare": "Barons Court Road",
	"dependant_thoroughfare": "",
	"building_number": "59",
	"building_name": "",
	"sub_building_name": "",
	"po_box": "",
	"department_name": "",
	"organisation_name": "ID Consulting Limited",
	"udprn": 25946509,
	"postcode_type": "S",
	"su_organisation_indicator": "Y",
	"delivery_point_suffix": "1N",
	"line_1": "ID Consulting Limited",
	"line_2": "59 Barons Court Road",
	"line_3": "",
	"country": "England",
	"county": "",
	"district": "Hammersmith and Fulham",
	"ward": "North End",
	"longitude":-0.208644362766368,
	"latitude":51.4899488390558,
	"eastings":524466,
	"northings":178299
  }
  ],
  code: 2000,
  message: "Success"
};

var postcodeNotFound = {
	code: 4040,
	message: "Postcode Not Found"
};

var keyCheckPass = {
  "result": {
	"available": true
  },
  "code":2000,
  "message":"Success"
};

var keyCheckMissing = {
	code: 4010,
	message: "Invalid Key. For more information see http://ideal-postcodes.co.uk/documentation/response-codes#4010"
};

var keyCheckFail = {
  "result": {
	"available": false
  },
  "code":2000,
  "message":"Success"
};

var addressSearchTest = {
  "result": {
	"total": 7,
	"limit": 10,
	"page": 0,
	"hits": [
	  {
		"postcode": "ID1 1QD",
		"postcode_inward": "1QD",
		"postcode_outward": "ID1",
		"post_town": "LONDON",
		"dependant_locality": "",
		"double_dependant_locality": "",
		"thoroughfare": "Barons Court Road",
		"dependant_thoroughfare": "",
		"building_number": "2",
		"building_name": "",
		"sub_building_name": "",
		"po_box": "",
		"department_name": "",
		"organisation_name": "",
		"udprn": 25962203,
		"postcode_type": "S",
		"su_organisation_indicator": "",
		"delivery_point_suffix": "1G",
		"line_1": "2 Barons Court Road",
		"line_2": "",
		"line_3": "",
		"premise": "2",
		"country": "England",
		"county": "",
		"district": "Hammersmith and Fulham",
		"ward": "North End",
		"longitude": -0.208644362766368,
		"latitude": 51.4899488390558,
		"eastings": 524466,
		"northings": 178299
	  },
	  {
		"postcode": "ID1 1QD",
		"postcode_inward": "1QD",
		"postcode_outward": "ID1",
		"post_town": "LONDON",
		"dependant_locality": "",
		"double_dependant_locality": "",
		"thoroughfare": "Barons Court Road",
		"dependant_thoroughfare": "",
		"building_number": "2",
		"building_name": "Basement Flat",
		"sub_building_name": "",
		"po_box": "",
		"department_name": "",
		"organisation_name": "",
		"udprn": 52618355,
		"postcode_type": "S",
		"su_organisation_indicator": "",
		"delivery_point_suffix": "3A",
		"line_1": "Basement Flat",
		"line_2": "2 Barons Court Road",
		"line_3": "",
		"premise": "Basement Flat, 2",
		"country": "England",
		"county": "",
		"district": "Hammersmith and Fulham",
		"ward": "North End",
		"longitude": -0.208644362766368,
		"latitude": 51.4899488390558,
		"eastings": 524466,
		"northings": 178299
	  },
	  {
		"postcode": "ID1 1QD",
		"postcode_inward": "1QD",
		"postcode_outward": "ID1",
		"post_town": "LONDON",
		"dependant_locality": "",
		"double_dependant_locality": "",
		"thoroughfare": "Barons Court Road",
		"dependant_thoroughfare": "",
		"building_number": "4",
		"building_name": "",
		"sub_building_name": "",
		"po_box": "",
		"department_name": "",
		"organisation_name": "",
		"udprn": 25962215,
		"postcode_type": "S",
		"su_organisation_indicator": "",
		"delivery_point_suffix": "1W",
		"line_1": "4 Barons Court Road",
		"line_2": "",
		"line_3": "",
		"premise": "4",
		"country": "England",
		"county": "",
		"district": "Hammersmith and Fulham",
		"ward": "North End",
		"longitude": -0.208644362766368,
		"latitude": 51.4899488390558,
		"eastings": 524466,
		"northings": 178299
	  },
	  {
		"postcode": "ID1 1QD",
		"postcode_inward": "1QD",
		"postcode_outward": "ID1",
		"post_town": "LONDON",
		"dependant_locality": "",
		"double_dependant_locality": "",
		"thoroughfare": "Barons Court Road",
		"dependant_thoroughfare": "",
		"building_number": "4",
		"building_name": "",
		"sub_building_name": "Basement",
		"po_box": "",
		"department_name": "",
		"organisation_name": "",
		"udprn": 25962189,
		"postcode_type": "S",
		"su_organisation_indicator": "",
		"delivery_point_suffix": "2P",
		"line_1": "Basement",
		"line_2": "4 Barons Court Road",
		"line_3": "",
		"premise": "Basement, 4",
		"country": "England",
		"county": "",
		"district": "Hammersmith and Fulham",
		"ward": "North End",
		"longitude": -0.208644362766368,
		"latitude": 51.4899488390558,
		"eastings": 524466,
		"northings": 178299
	  },
	  {
		"postcode": "ID1 1QD",
		"postcode_inward": "1QD",
		"postcode_outward": "ID1",
		"post_town": "LONDON",
		"dependant_locality": "",
		"double_dependant_locality": "",
		"thoroughfare": "Barons Court Road",
		"dependant_thoroughfare": "",
		"building_number": "6",
		"building_name": "",
		"sub_building_name": "",
		"po_box": "",
		"department_name": "",
		"organisation_name": "",
		"udprn": 25962218,
		"postcode_type": "S",
		"su_organisation_indicator": "",
		"delivery_point_suffix": "1Y",
		"line_1": "6 Barons Court Road",
		"line_2": "",
		"line_3": "",
		"premise": "6",
		"country": "England",
		"county": "",
		"district": "Hammersmith and Fulham",
		"ward": "North End",
		"longitude": -0.208644362766368,
		"latitude": 51.4899488390558,
		"eastings": 524466,
		"northings": 178299
	  },
	  {
		"postcode": "ID1 1QD",
		"postcode_inward": "1QD",
		"postcode_outward": "ID1",
		"post_town": "LONDON",
		"dependant_locality": "",
		"double_dependant_locality": "",
		"thoroughfare": "Barons Court Road",
		"dependant_thoroughfare": "",
		"building_number": "8",
		"building_name": "",
		"sub_building_name": "",
		"po_box": "",
		"department_name": "",
		"organisation_name": "",
		"udprn": 25962219,
		"postcode_type": "S",
		"su_organisation_indicator": "",
		"delivery_point_suffix": "1Z",
		"line_1": "8 Barons Court Road",
		"line_2": "",
		"line_3": "",
		"premise": "8",
		"country": "England",
		"county": "",
		"district": "Hammersmith and Fulham",
		"ward": "North End",
		"longitude": -0.208644362766368,
		"latitude": 51.4899488390558,
		"eastings": 524466,
		"northings": 178299
	  },
	  {
		"postcode": "ID1 1QD",
		"postcode_inward": "1QD",
		"postcode_outward": "ID1",
		"post_town": "LONDON",
		"dependant_locality": "",
		"double_dependant_locality": "",
		"thoroughfare": "Barons Court Road",
		"dependant_thoroughfare": "",
		"building_number": "59",
		"building_name": "",
		"sub_building_name": "",
		"po_box": "",
		"department_name": "",
		"organisation_name": "ID Consulting Limited",
		"udprn": 25946509,
		"postcode_type": "S",
		"su_organisation_indicator": "Y",
		"delivery_point_suffix": "1N",
		"line_1": "ID Consulting Limited",
		"line_2": "59 Barons Court Road",
		"line_3": "",
		"premise": "59",
		"country": "England",
		"county": "",
		"district": "Hammersmith and Fulham",
		"ward": "North End",
		"longitude": -0.208644362766368,
		"latitude": 51.4899488390558,
		"eastings": 524466,
		"northings": 178299
	  }
	]
  },
  "code": 2000,
  "message": "Success"
}

var addressSearchTestDowningStreet = {
  "result": {
    "total": 2,
    "limit": 10,
    "page": 0,
    "hits": [
      {
        "dependant_locality": "",
        "postcode_type": "L",
        "po_box": "",
        "post_town": "LONDON",
        "delivery_point_suffix": "1A",
        "double_dependant_locality": "",
        "su_organisation_indicator": " ",
        "longitude": -0.127695242183412,
        "department_name": "",
        "district": "Westminster",
        "building_name": "",
        "dependant_thoroughfare": "",
        "northings": 179951,
        "postcode_outward": "SW1A",
        "postcode_inward": "2AA",
        "sub_building_name": "",
        "eastings": 530047,
        "postcode": "SW1A 2AA",
        "udprn": 23747771,
        "line_3": "",
        "organisation_name": "Prime Minister & First Lord Of The Treasury",
        "ward": "St James's",
        "county": "",
        "line_1": "Prime Minister & First Lord Of The Treasury",
        "building_number": "10",
        "thoroughfare": "Downing Street",
        "line_2": "10 Downing Street",
        "latitude": 51.5035398826274
      },
      {
        "dependant_locality": "",
        "postcode_type": "S",
        "po_box": "",
        "post_town": "LONDON",
        "delivery_point_suffix": "1B",
        "double_dependant_locality": "",
        "su_organisation_indicator": " ",
        "longitude": -0.122624730080001,
        "department_name": "",
        "district": "Camden",
        "building_name": "Downing Court",
        "dependant_thoroughfare": "",
        "northings": 182178,
        "postcode_outward": "WC1N",
        "postcode_inward": "1LX",
        "sub_building_name": "Flat 10",
        "eastings": 530342,
        "postcode": "WC1N 1LX",
        "udprn": 26245117,
        "line_3": "Grenville Street",
        "organisation_name": "",
        "ward": "Bloomsbury",
        "county": "",
        "line_1": "Flat 10",
        "building_number": " ",
        "thoroughfare": "Grenville Street",
        "line_2": "Downing Court",
        "latitude": 51.5234851731108
      }
    ]
  },
  "code": 2000,
  "message": "Success"
}

var addressSearchNoResults = {
  "result": {
    "total": 0,
    "limit": 10,
    "page": 0,
    "hits": []
  },
  "code": 2000,
  "message": "Success"
};

fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/postcodes/ID11QD', function(data) {
	return testPostcodeResult;
});

fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/postcodes/ID11QE', function(data) {
	return postcodeNotFound;
});

fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/postcodes/ID1KFA', function(data) {
	return postcodeNotFound;
});

fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/keys/iddqd', function(data) {
	return keyCheckPass;
});

fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/keys/idd', function(data) {
	return keyCheckMissing;
});

fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/keys/idkfa', function(data) {
	return keyCheckFail;
});

fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/addresses', function(data) {
	if (data.query === "ID1 1QD") {
		return addressSearchTest;
	} else if (data.query === "ID1 KFA") {
		return addressSearchNoResults;
	} else if (data.query === "10 Downing Street London") {
		return addressSearchTestDowningStreet;
	} else {
		return addressSearchNoResults;
	}
});
  
})(jQuery);

