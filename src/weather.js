/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var yw = require('weather-yahoo');

exports.getWeather = function(location, callback) {
  var ans = {};
  yw.getSimpleWeather(location).then(function(res){
      callback({weather: res.weather});
  }).catch(function(err){
      console.log(err);
      callback({err: err});
  });
  
};
