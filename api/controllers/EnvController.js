/**
 * EnvController
 *
 * @description :: Server-side logic for managing envs
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  key: function(req,res) {
    var keys = {
      flightStatId: process.env.FLIGHT_STATS_ID,
      flightStatKey: process.env.FLIGHT_STATS_KEY,
      mapbox: process.env.MAPBOX_ACCESS_TOKEN,
      googleMaps: process.env.GOOGLE_MAPS_KEY,
      forecast: process.env.FORECAST_KEY,
      exchange: process.env.OPEN_EXCHANGE_RATES_KEY
    }
    res.send(keys);
  }

};

