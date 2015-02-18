/**
 * ApiController
 *
 * @description :: Server-side logic for managing apis
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request');

module.exports = {

  getAll: function(req,res){
    var flightStats = {"request":{"flightId":{"requested":"350089626","interpreted":350089626},"extendedOptions":{"requested":"useInlinedReferences","interpreted":"useInlinedReferences"},"url":"http://fhv2svc01.dev.pdx.office:8080/flex/flightstatus/rest/v2/json/flight/status/350089626"},"appendix":{},"flightStatus":{"flightId":350089626,"carrier":{"fs":"AS","iata":"AS","icao":"ASA","name":"Alaska Airlines","phoneNumber":"1-800-252-7522","active":true},"flightNumber":"752","departureAirport":{"fs":"PDX","iata":"PDX","icao":"KPDX","faa":"PDX","name":"Portland International Airport","street1":"7000 NE Airport Way","city":"Portland","cityCode":"PDX","stateCode":"OR","postalCode":"97218","countryCode":"US","countryName":"United States","regionName":"North America","timeZoneRegionName":"America/Los_Angeles","weatherZone":"ORZ006","localTime":"2014-02-03T10:10:28.643","utcOffsetHours":-8.0,"latitude":45.588995,"longitude":-122.592901,"elevationFeet":30,"classification":1,"active":true,"delayIndexUrl":"https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/PDX?codeType=fs","weatherUrl":"https://api.flightstats.com/flex/weather/rest/v1/json/all/PDX?codeType=fs"},"arrivalAirport":{"fs":"ATL","iata":"ATL","icao":"KATL","faa":"ATL","name":"Hartsfield-Jackson Atlanta International Airport","street1":"6000 N Terminal Parkway","street2":"","city":"Atlanta","cityCode":"ATL","stateCode":"GA","postalCode":"30320","countryCode":"US","countryName":"United States","regionName":"North America","timeZoneRegionName":"America/New_York","weatherZone":"GAZ044","localTime":"2014-02-03T13:10:28.643","utcOffsetHours":-5.0,"latitude":33.640067,"longitude":-84.44403,"elevationFeet":1026,"classification":1,"active":true,"delayIndexUrl":"https://api.flightstats.com/flex/delayindex/rest/v1/json/airports/ATL?codeType=fs","weatherUrl":"https://api.flightstats.com/flex/weather/rest/v1/json/all/ATL?codeType=fs"},"departureDate":{"dateLocal":"2014-02-03T09:55:00.000","dateUtc":"2014-02-03T17:55:00.000Z"},"arrivalDate":{"dateLocal":"2014-02-03T17:48:00.000","dateUtc":"2014-02-03T22:48:00.000Z"},"status":"A","operationalTimes":{"flightPlanPlannedDeparture":{"dateLocal":"2014-02-03T09:55:00.000","dateUtc":"2014-02-03T17:55:00.000Z"},"estimatedRunwayDeparture":{"dateLocal":"2014-02-03T09:55:00.000","dateUtc":"2014-02-03T17:55:00.000Z"},"estimatedGateArrival":{"dateLocal":"2014-02-03T17:48:00.000","dateUtc":"2014-02-03T22:48:00.000Z"},"flightPlanPlannedArrival":{"dateLocal":"2014-02-03T16:58:07.000","dateUtc":"2014-02-03T21:58:07.000Z"},"estimatedRunwayArrival":{"dateLocal":"2014-02-03T16:58:29.000","dateUtc":"2014-02-03T21:58:29.000Z"}},"flightDurations":{"scheduledAirMinutes":243},"flightEquipment":{"actualEquipment":{"iata":"B739","name":"??","turboProp":false,"jet":false,"widebody":false,"regional":false}}}}

    var deplat = flightStats.flightStatus.departureAirport.latitude;
    var deplon = flightStats.flightStatus.departureAirport.longitude;
    var arrlat = flightStats.flightStatus.arrivalAirport.latitude;
    var arrlon = flightStats.flightStatus.arrivalAirport.longitude;


    var depForecast = {};
    var arrForecast = {};
    var exchange = {};

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
                  flightInfo: flightStats.flightStatus,
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

};
