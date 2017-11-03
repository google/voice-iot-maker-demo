/**
 * particle-blink-demo.ino - turn a light on and off via webhook.
 * 
 * Based heavily on the Particle Web-Connected LED example. See more here:
 * https://docs.particle.io/guide/getting-started/build/photon/
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

// declare the pin variable
int ledPin = D7;

void setup()
{

   // set the pin as an output
   pinMode(ledPin, OUTPUT);

   // declare a Particle.function so that we can turn the LED on and off from the cloud.
   Particle.function("led",ledToggle);

   // set the pin to off at start
   digitalWrite(ledPin, LOW);

}

void loop()
{
   // do nothing
}


int ledToggle(String command) {
    // listen for "on" or "off", and act accordingly
    // always return an integer for success/failure
    if (command=="on") {
        // if "on", turn the light on
        digitalWrite(ledPin,HIGH);
        return 1;
    }
    else if (command=="off") {
        // if "off", turn the light off
        digitalWrite(ledPin,LOW);
        return 0;
    }
    else {
        // if not a recognized request, return -1
        return -1;
    }
}
