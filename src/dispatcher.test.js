/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

var dispatcher = require('./dispatcher');
var weather = require('./weather');

var intentStub = {
  currentIntent: {
    name: 'WeatherLex',
    slots: {
      Location: 'London'
    }
  }
};

describe('dispatch', () => {

  test('calls the weather API with unknown location', done => {
    var mockWeather = {
      getWeather: function(user, callback) {
        callback({ });
      }
    };

    dispatcher.dispatch(intentStub, mockWeather,(outcome) => {
      expect(outcome.dialogAction.fulfillmentState).toEqual('Fulfilled');
      expect(outcome.dialogAction.message).toBeDefined();
      expect(outcome.dialogAction.message.content).toEqual('Sorry I can\'t get the weather for London');
      done();
    });
    
  });
  
  test('calls the weather API with known location', done => {
    var mockWeather = {
      getWeather: function(user, callback) {
        callback({ weather: { temperature: { value: '44', units: 'F' },
        wind: { value: '14', units: 'mph' },
        windChill: { value: '39', units: 'F' },
        condition: 'Scattered Showers' }});
      }
    };

    dispatcher.dispatch(intentStub, mockWeather, (outcome) => {
      expect(outcome.dialogAction.fulfillmentState).toEqual('Fulfilled');
      expect(outcome.dialogAction.message).toBeDefined();
      expect(outcome.dialogAction.message.content).
        toBe('The current weather in London is Scattered Showers, and the temperature is 44F');
      done();
    });
    
  });
  
  test('returns error when error from weather location', done => {
    var mockWeather = {
      getWeather: function(user, callback) {
        callback({err: 'Something went wrong'});
      }
    };

    dispatcher.dispatch(intentStub, mockWeather, (outcome) => {
      expect(outcome.dialogAction.fulfillmentState).toEqual('Failed');
      done();
    });
    
  });
  
  test('returns data from live weather  API', done => {
    dispatcher.dispatch(intentStub, weather, (outcome) => {
      expect(outcome.dialogAction.fulfillmentState).toEqual('Fulfilled');
      done();
    });
  });
});
