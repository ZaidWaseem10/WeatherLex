/*jslint node: true */
/*jslint esversion: 6 */
'use strict';

// Helpers to build responses which match the structure of the necessary dialog actions
function elicitSlot(sessionAttributes, intentName, slots, slotToElicit, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ElicitSlot',
            intentName,
            slots,
            slotToElicit,
            message,
            responseCard,
        },
    };
}

function confirmIntent(sessionAttributes, intentName, slots, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'ConfirmIntent',
            intentName,
            slots,
            message,
            responseCard,
        },
    };
}

function close(sessionAttributes, fulfillmentState, message, responseCard) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Close',
            fulfillmentState,
            message,
            responseCard,
        },
    };
}

function delegate(sessionAttributes, slots) {
    return {
        sessionAttributes,
        dialogAction: {
            type: 'Delegate',
            slots,
        },
    };
}

// Build a responseCard with a title, subtitle, and an optional set of options which should be displayed as buttons.
function buildResponseCard(title, subTitle, options) {
    let buttons = null;
    if (options !== null) {
        buttons = [];
        for (let i = 0; i < Math.min(5, options.length); i++) {
            buttons.push(options[i]);
        }
    }
    return {
        contentType: 'application/vnd.amazonaws.card.generic',
        version: 1,
        genericAttachments: [{
            title,
            subTitle,
            buttons,
        }],
    };
}

function buildValidationResult(isValid, violatedSlot, messageContent) {
    return {
        isValid,
        violatedSlot,
        message: { contentType: 'PlainText', content: messageContent },
    };
}


/**
 * Called when the user specifies an intent for this skill.
 */
exports.dispatch = function(intentRequest, weatherClient, callback) {
  console.log(`dispatch userId=${intentRequest.userId}, intent=${intentRequest.currentIntent.name}`);

  const name = intentRequest.currentIntent.name;

  if(name == 'WeatherLex') {
     const location = intentRequest.currentIntent.slots.Location;

     weatherClient.getWeather(location, (ret) => {
      /* returns
       { temperature: { value: '44', units: 'F' },
        wind: { value: '14', units: 'mph' },
        windChill: { value: '39', units: 'F' },
        condition: 'Scattered Showers' }      *
       */

      var message = { contentType: 'PlainText', content: '' };
      var outcome = 'Failed';
      
      if (ret.err === undefined) {
        outcome = 'Fulfilled';
        if (ret.weather !== undefined) {
          message.content = "The current weather in " + location + " is " + ret.weather.condition + ", and the temperature is " + ret.weather.temperature.value + ret.weather.temperature.units;
        }else {
          message.content = `Sorry I can\'t get the weather for ${location}`;
        }
      }else {
        console.log("error: " + ret.err);
      }
      
      callback(close(
        null,
        outcome,
        message,
        null));
    });     

    return;
  }

  throw new Error(`Intent with name ${name} not supported`);
};
