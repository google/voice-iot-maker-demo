/**
 * index.js - the main entrypoint for the Dialogflow webhook app.
 * This example relies on Firebase for hosting and serving.
 *
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

/**
 * Library imports and settings
 */

// set debug mode for Actions on Google
process.env.DEBUG = 'actions-on-google:*';

// import the vendor libraries
const { DialogflowApp } = require('actions-on-google');
const functions = require('firebase-functions');
const Particle = require('particle-api-js');

// import our local settings and define constants
const {
  particleDeviceID,
  particleAccessToken
} = require('./config.js');

/**
 * Constant definitions
 */

// define the name of the Dialogflow action
const NAME_ACTION = 'ledControl';

/**
 * Handles the initial Assistant webhook response. Accepts the
 * newly-initialized `assistant` object, and handles sending the
 * formatted response back to the Assistant.
 *
 * @function
 * @param {object} assistant
 * @returns nothing
 */
function responseHandler (app) {
  // grab the `ledState` value from the Assistant request
  const ledState = app.getArgument('ledState');

  // parse the user's request text and respond accordingly
  handleUserRequest(ledState)
    // let the assistant respond
    .then(response => app.tell(response))
    // set the error message
    .catch(err => console.log(err));
}

/**
 * Handles the user request text. Takes in a text string, validates the request
 * format and content, and if all is well, makes the request to the Particle API.
 *
 * @function
 * @param {string} ledState The requested LED state ("on" or "off")
 * @returns a promise with the results of the call
 */
function handleUserRequest (ledState) {
  // wrap all the logic within a promise to ensure proper order of calls
  return new Promise((resolve, reject) => {
    // check for proper request formatting before trying to send to Particle
    if (!ledState) {
      // tell the user we don't know how to proceed if there's no ledState parameter
      return resolve("I don't understand");
    }
    if (ledState !== 'on' && ledState !== 'off') {
      // tell the user that their request was invalid
      return resolve(`I don't know how to turn the light ${ledState}`);
    }

    // make the call to the Particle API, and return the new user response
    makeParticleRequest(ledState)
      .then(() => resolve(`Light set to ${ledState}`))
      .catch(err => reject(err));
  });
}

/**
 * Makes the request to the Particle API, via the Particle JS library.
 *
 * @function
 * @param {string} ledState
 * @returns a promise with the results from the Particle API
 */
function makeParticleRequest (ledState) {
  // return a promise with the Particle responses
  return new Particle()
    .callFunction({
      // call the remote function "led" on the specified device with the requested parameters
      deviceId: particleDeviceID,
      name: 'led',
      argument: ledState,
      auth: particleAccessToken
    });
}

// define your action
exports.ledAction = functions.https.onRequest((request, response) => {
  // grab the ledState value from the Dialogflow webhook
  const app = new DialogflowApp({request, response});

  // define the action map of responses
  const actionMap = new Map();
  actionMap.set(NAME_ACTION, responseHandler);

  // ask Assistant to respond accordingly
  app.handleRequest(actionMap);
});
