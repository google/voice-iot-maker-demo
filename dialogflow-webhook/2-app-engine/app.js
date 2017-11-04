/**
 * app.js - the main entrypoint for the Dialogflow webhook app.
 * This example relies on Google App Engine for hosting,
 * and uses Express.js for handling and serving requests.
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
const Particle = require('particle-api-js');
const express = require('express');
const bodyParser = require('body-parser');

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
 * Express.js configuration
 */

// set up Express
const app = express();
const port = process.env.PORT || 3000;

// add support for encodied bodies (and JSON-encoded bodies)
app.use(bodyParser.json({type: 'application/json'}));

/**
 * Handles the initial Assistant webhook response. Accepts the
 * newly-initialized `assistant`object, and handles sending the
 * formatted response back to the Assistant.
 *
 * @function
 * @param {object} assistant
 * @returns nothing
 */
function responseHandler (assistant) {
  // grab the `ledState` value from the Assistant request
  const ledState = assistant.getArgument('ledState');

  // parse the user's request text and respond accordingly
  handleUserRequest(ledState)
    // let the assistant respond
    .then(response => assistant.tell(response))
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

/**
 * Express.js handlers and server
*/

// listen for GET requests
app.get('/', (req, res) => {
  // reply back with a friendly message
  res.send('It works!');
});

// listen for POST requests
app.post('/', (req, res) => {
  // grab the ledState value from the Dialogflow webhook
  const assistant = new DialogflowApp({
    request: req,
    response: res
  });

  // define the action map of responses
  const actionMap = new Map();
  actionMap.set(NAME_ACTION, responseHandler);

  // ask Assistant to respond accordingly
  assistant.handleRequest(actionMap);
});

// fire up Express on the specified port
if (module === require.main) {
  const server = app.listen(port, () => {
    // grab the address and port from the environment
    const {
      address,
      port
    } = server.address();

    // set the host as localhost if running locally
    const host = address === '::'
      ? 'localhost'
      : address;

    // log out the server address
    console.log(`Starting server at http://${host}:${port}`);
  });
}

module.exports = app;
