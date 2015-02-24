/**
 * ApiController
 *
 * @description :: Server-side logic for managing apis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');
var async = require('async');

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
    var depFoursquare = {};

    Flight.findOne({
      airline:req.body.airline,
      flight:req.body.flight,
      year:req.body.year.toString(),
      month:req.body.month.toString(),
      day:req.body.day.toString()
    })

    .exec(function(err, found){

      if (found) {

        console.log('Flight Found in DB')

        flightStats = JSON.parse(found.body).flightStatuses[0];

        deplat = flightStats.departureAirport.latitude;
        deplon = flightStats.departureAirport.longitude;
        arrlat = flightStats.arrivalAirport.latitude;
        arrlon = flightStats.arrivalAirport.longitude;

        continueAll();

        //console.log(found.body);
      } else {

        console.log('Calling Flight Stats API')

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

      async.parallel({

        // get departure forecast
        depForecast: function(callback){
          request(('https://api.forecast.io/forecast/'+process.env.FORECAST_KEY+'/'+deplat+','+deplon), function (error, response, body) {
            if (!error && response.statusCode == 200) {
              depForecast = JSON.parse(body);
              callback(null, depForecast);
            }
          });
        },
        arrForecast: function(callback){
          // get arrival forecast
          request(('https://api.forecast.io/forecast/'+process.env.FORECAST_KEY+'/'+arrlat+','+arrlon), function (error, response, body) {
            if (!error && response.statusCode == 200) {
              arrForecast = JSON.parse(body);
              callback(null, arrForecast);
            }
          })
        },
        exchange: function(callback){
          // get exchange rate
          request(('http://openexchangerates.org/api/latest.json?app_id='+process.env.OPEN_EXCHANGE_RATES_KEY), function (error, response, body) {
            if (!error && response.statusCode == 200) {
              exchange = JSON.parse(body);
              callback(null, exchange);
            }
          });
        },
        depFoursquare: function(callback){
          // get foursquare venues
          // https://api.foursquare.com/v2/venues/explore?client_id=KL4M5L1JVEKQY5OFTGUEB43WQYOI2L3TIBEYL23BVHX2QQQW&client_secret=RWLMX1HFXWSU3JIIFEDFPXQXHJI2ZITAA1P2QEXGSPEN1LOT&ll=40.7,-74&query=sushi&v=20140806&m=foursquare
          request(('https://api.foursquare.com/v2/venues/explore?client_id='+process.env.FOURSQUARE_KEY+'&client_secret='+process.env.FOURSQUARE_SECRET+'&ll='+deplat+','+deplon+'&section=food&v=20140806&m=foursquare&limit=6&openNow=1&radius=250'), function(error, response, body){
            if (!error && response.statusCode == 200) {
              depFoursquare = JSON.parse(body);
              callback(null, depFoursquare);
            }
          });
        },
        arrFoursquare: function(callback){
          // get foursquare venues
          // https://api.foursquare.com/v2/venues/explore?client_id=KL4M5L1JVEKQY5OFTGUEB43WQYOI2L3TIBEYL23BVHX2QQQW&client_secret=RWLMX1HFXWSU3JIIFEDFPXQXHJI2ZITAA1P2QEXGSPEN1LOT&ll=40.7,-74&query=sushi&v=20140806&m=foursquare
          request(('https://api.foursquare.com/v2/venues/explore?client_id='+process.env.FOURSQUARE_KEY+'&client_secret='+process.env.FOURSQUARE_SECRET+'&ll='+arrlat+','+arrlon+'&section=food&v=20140806&m=foursquare&limit=6&openNow=1&radius-250'), function(error, response, body){
            if (!error && response.statusCode == 200) {
              arrFoursquare = JSON.parse(body);
              callback(null, arrFoursquare);
            }
          });
        }

      },function(err, results){

        res.send({
          flightInfo: flightStats,
          forecast: {dep:results.depForecast,arr:results.arrForecast},
          deplat: deplat,
          deplon: deplon,
          arrlat: arrlat,
          arrlon: arrlon,
          exchange: results.exchange,
          foursquare: {dep:results.depFoursquare,arr:results.arrFoursquare}
        });

      });

    }

  } // getAll


};

