(function($) {
  
  var fake = $.ajax.fake;
  
  fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/postcodes/ID11QD', function(data) {
    return {
      "result": [
        {
          postcode: "ID1 1QD",
          postcode_inward: "1QD",
          postcode_outward: "ID1",
          post_town: "LONDON",
          dependant_locality: "",
          double_dependant_locality: "",
          thoroughfare: "Barons Court Road",
          dependant_thoroughfare: "",
          building_number: "2",
          building_name: "",
          sub_building_name: "",
          po_box: "",
          department_name: "",
          organisation_name: "",
          udprn: 25962203,
          postcode_type: "S",
          su_organisation_indicator: "",
          delivery_point_suffix: "1G",
          line_1: "2 Barons Court Road",
          line_2: "",
          line_3: "",
          county: "",
          district: "Hammersmith and Fulham",
          ward: "North End",
          longitude: -0.20864436276637,
          latitude: 51.489948839056,
          eastings: 524466,
          northings: 178299
        },
        {
          postcode: "ID1 1QD",
          postcode_inward: "1QD",
          postcode_outward: "ID1",
          post_town: "LONDON",
          dependant_locality: "",
          double_dependant_locality: "",
          thoroughfare: "Barons Court Road",
          dependant_thoroughfare: "",
          building_number: "2",
          building_name: "Basement Flat",
          sub_building_name: "",
          po_box: "",
          department_name: "",
          organisation_name: "",
          udprn: 52618355,
          postcode_type: "S",
          su_organisation_indicator: "",
          delivery_point_suffix: "3A",
          line_1: "Basement Flat",
          line_2: "2 Barons Court Road",
          line_3: "",
          county: "",
          district: "Hammersmith and Fulham",
          ward: "North End",
          longitude: -0.20864436276637,
          latitude: 51.489948839056,
          eastings: 524466,
          northings: 178299
        },
        {
          postcode: "ID1 1QD",
          postcode_inward: "1QD",
          postcode_outward: "ID1",
          post_town: "LONDON",
          dependant_locality: "",
          double_dependant_locality: "",
          thoroughfare: "Barons Court Road",
          dependant_thoroughfare: "",
          building_number: "4",
          building_name: "",
          sub_building_name: "",
          po_box: "",
          department_name: "",
          organisation_name: "",
          udprn: 25962215,
          postcode_type: "S",
          su_organisation_indicator: "",
          delivery_point_suffix: "1W",
          line_1: "4 Barons Court Road",
          line_2: "",
          line_3: "",
          county: "",
          district: "Hammersmith and Fulham",
          ward: "North End",
          longitude: -0.20864436276637,
          latitude: 51.489948839056,
          eastings: 524466,
          northings: 178299
        },
        {
          postcode: "ID1 1QD",
          postcode_inward: "1QD",
          postcode_outward: "ID1",
          post_town: "LONDON",
          dependant_locality: "",
          double_dependant_locality: "",
          thoroughfare: "Barons Court Road",
          dependant_thoroughfare: "",
          building_number: "4",
          building_name: "",
          sub_building_name: "Basement",
          po_box: "",
          department_name: "",
          organisation_name: "",
          udprn: 25962189,
          postcode_type: "S",
          su_organisation_indicator: "",
          delivery_point_suffix: "2P",
          line_1: "Basement",
          line_2: "4 Barons Court Road",
          line_3: "",
          county: "",
          district: "Hammersmith and Fulham",
          ward: "North End",
          longitude: -0.20864436276637,
          latitude: 51.489948839056,
          eastings: 524466,
          northings: 178299
        },
        {
          postcode: "ID1 1QD",
          postcode_inward: "1QD",
          postcode_outward: "ID1",
          post_town: "LONDON",
          dependant_locality: "",
          double_dependant_locality: "",
          thoroughfare: "Barons Court Road",
          dependant_thoroughfare: "",
          building_number: "6",
          building_name: "",
          sub_building_name: "",
          po_box: "",
          department_name: "",
          organisation_name: "",
          udprn: 25962218,
          postcode_type: "S",
          su_organisation_indicator: "",
          delivery_point_suffix: "1Y",
          line_1: "6 Barons Court Road",
          line_2: "",
          line_3: "",
          county: "",
          district: "Hammersmith and Fulham",
          ward: "North End",
          longitude: -0.20864436276637,
          latitude: 51.489948839056,
          eastings: 524466,
          northings: 178299
        },
        {
          postcode: "ID1 1QD",
          postcode_inward: "1QD",
          postcode_outward: "ID1",
          post_town: "LONDON",
          dependant_locality: "",
          double_dependant_locality: "",
          thoroughfare: "Barons Court Road",
          dependant_thoroughfare: "",
          building_number: "8",
          building_name: "",
          sub_building_name: "",
          po_box: "",
          department_name: "",
          organisation_name: "",
          udprn: 25962219,
          postcode_type: "S",
          su_organisation_indicator: "",
          delivery_point_suffix: "1Z",
          line_1: "8 Barons Court Road",
          line_2: "",
          line_3: "",
          county: "",
          district: "Hammersmith and Fulham",
          ward: "North End",
          longitude: -0.20864436276637,
          latitude: 51.489948839056,
          eastings: 524466,
          northings: 178299
        }
      ],
      code: 2000,
      message: "Success"
    };
  });
  
  fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/postcodes/ID11QE', function(data) {
    return {
      code: 4040,
      message: "Postcode Not Found"
    }
  });

  fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/keys/iddqd', function(data) {
    return {
      "result": {
        "available": true
      },
      "code":2000,
      "message":"Success"
    };
  });

  fake.registerWebservice('https://api.ideal-postcodes.co.uk/v1/keys/idkfa', function(data) {
    return {
      "result": {
        "available": false
      },
      "code":2000,
      "message":"Success"
    };
  });
  
})(jQuery);

