/**
 * ApiController
 *
 * @description :: Server-side logic for managing apis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

module.exports = {

  getAll: function(req,res){

    console.log(req.body)

    var result = {};
    var flightStats = {};
    var deplat = '';
    var deplon = '';
    var arrlat = '';
    var arrlon = '';
    var depForecast = {};
    var arrForecast = {};
    var exchange = {};

    Flight.findOne({
      airline:req.body.airline,
      flight:req.body.flight,
      year:req.body.year.toString(),
      month:req.body.month.toString(),
      day:req.body.day.toString()
    })

    .exec(function(err, found){

      if (found) {

        flightStats = JSON.parse(found.body).flightStatuses[0];

        deplat = flightStats.departureAirport.latitude;
        deplon = flightStats.departureAirport.longitude;
        arrlat = flightStats.arrivalAirport.latitude;
        arrlon = flightStats.arrivalAirport.longitude;

        continueAll();

        console.log(found.body);
      } else {

        // get flight info
        request(('https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/'+req.body.airline+'/'+req.body.flight+'/dep/'+req.body.year+'/'+req.body.month+'/'+req.body.day+'?appId='+process.env.FLIGHT_STATS_ID+'&appKey='+process.env.FLIGHT_STATS_KEY+'&utc=false&extendedOptions=useInlinedReferences'), function (error, response, body) {
          if (!error && response.statusCode == 200) {

            result = JSON.parse(body);

            Flight.create({
              flightId: result.flightStatuses[0].flightId,
              airline: result.request.airline.requestedCode,
              flight: result.request.flight.requested,
              year: result.request.date.year,
              month: result.request.date.month,
              day: result.request.date.day,
              body: body
            }).exec(function(err,created){
              if (created) {
                console.log('Flight create with id: '+created.flightId);
              }
            })

            flightStats = result.flightStatuses[0];

            deplat = flightStats.departureAirport.latitude;
            deplon = flightStats.departureAirport.longitude;
            arrlat = flightStats.arrivalAirport.latitude;
            arrlon = flightStats.arrivalAirport.longitude;

            continueAll();

          }


        });

      }
    })


    var continueAll = function() {
      // get departure forecast
      request(('https://api.forecast.io/forecast/'+process.env.FORECAST_KEY+'/'+deplat+','+deplon), function (error, response, body) {
        if (!error && response.statusCode == 200) {
          depForecast = JSON.parse(body);

          // get arrival forecast
          request(('https://api.forecast.io/forecast/'+process.env.FORECAST_KEY+'/'+arrlat+','+arrlon), function (error, response, body) {
            if (!error && response.statusCode == 200) {
              arrForecast = JSON.parse(body);

              // get exchange rate
              request(('http://openexchangerates.org/api/latest.json?app_id='+process.env.OPEN_EXCHANGE_RATES_KEY), function (error, response, body) {
                if (!error && response.statusCode == 200) {
                  exchange = body;

                  res.send({
                    flightInfo: flightStats,
                    forecast: {dep:depForecast,arr:arrForecast},
                    deplat: deplat,
                    deplon: deplon,
                    arrlat: arrlat,
                    arrlon: arrlon,
                    exchange: exchange
                  });

                }
              });

            }
          });

        }
      });
    }



  } // getAll

};

