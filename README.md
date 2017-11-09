# Google Actions + Particle Photon (via Dialogflow)

This maker-friendly tutorial is a great starting point for developers, students, and tinkerers of all types who want to integrate the [Google Home](https://madeby.google.com/home/) with their IoT prototyping projects. You can use this app to control an LED by voice, thanks to the magic of [Google Assistant](https://assistant.google.com/) and [Dialogflow](https://dialogflow.com/), and an internet-connected [Particle Photon](https://www.particle.io/).

*Disclaimer*: This is not an official Google product.

## What's included

This example ties together multiple technology platforms, so there are a few separate components included in this repo:

- `dialogflow-agent` - an [agent](https://dialogflow.com/docs/agents) for Dialogflow
- `dialogflow-webhook` - a web app to parse and react to the Dialogflow agent's webhook
- `particle-photon` - a Photon app to handle web requests, and to turn the light on and off

We've included two separate web app implementations. Choose (and build on) the one that best suits your preferences:

- `1-firebase-functions` - a [microservices](https://cloud.google.com/appengine/docs/standard/python/microservices-on-app-engine)-oriented implementation, built for deployment to [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/) — a serverless, on-demand platform
- `2-app-engine` - a server-based implementation, designed to run on [Google App Engine](https://cloud.google.com/appengine/) (or your server of choice)

This should be enough to get you started and on to building great things!

## What you'll need

We’ll build our web app with Node.js, and will rely on some libraries to make life easier:

- The [Actions on Google Node.js Client Library](https://developers.google.com/actions/tools/nodejs-client-library)
- The [Particle API JS SDK](https://docs.particle.io/reference/javascript/)

On the hardware side, you will need:

- a [Google Home](https://madeby.google.com/home/) (or another device running Google Assistant)
- a [Particle Photon](https://docs.particle.io/datasheets/photon-datasheet/) (or a similar web-connected microcontroller, like the [Redbear Duo](https://redbear.cc/product/wifi-ble/redbear-duo.html))

It's handy to have a breadboard, some hookup wire, and a bright LED, and the examples will show those in action. However, the Photon has an addressable LED built in, so you can use just the Photon itself to test all the code presented here if you prefer.

You'll also need accounts with:

- [Dialogflow](https://dialogflow.com/) (for understanding user voice queries)
- [Google Cloud](https://cloud.google.com/) (for hosting the webhook webapp/service)
- [Particle Cloud](https://build.particle.io/build/) (for deploying your Photon code and communicating with the Particle API)

If you're just starting out, or if you're already comfortable with a microservices approach, you can use the `1-firebase-functions` example — it's easy to configure and requires no other infrastructure setup. If you'd prefer to run it on a full server environment, or if you plan to build out a larger application from this, use the `2-app-engine` example (which can also run on any other server of your choosing).

If you've got all those (or similar services/devices) good to go, then we're ready to start!


## Getting started

Assuming you have all the required devices and accounts as noted above, the first thing you'll want to do is to set up apps on the corresponding services so you can get your devices talking to each other.

### Local setup

First, you'll need to clone this repo, and `cd` into the newly-created directory.

    git clone git@github.com:google/voice-iot-maker-demo.git
    cd git@github.com:google/voice-iot-maker-demo.git

You should see three directories (alongside some additional files):

- `dialogflow-agent` - the contents of the action to deploy on Dialogflow
- `dialogflow-webhook` - a web application to parse the Google Actions/Dialogflow webhook (with server-based and cloud function options)
- `particle-photon` - sample code to flash onto the Particle Photon

Once you‘ve taken a look, we’ll move on!

### Dialogflow

Using the Dialogflow account referenced above, you‘ll want to create a [Dialogflow agent](https://console.dialogflow.com/api-client/). We'll be setting up a [webhook](https://dialogflow.com/docs/fulfillment#webhook-example) to handle our triggers and send web requests to the Particle API.

1. Create a new agent (or [click here](https://console.dialogflow.com/api-client/#/newAgent) to begin). You can name it whatever you like
1. Select *Create a new Google project* as well
1. In the Settings section (click on the gear icon next to your project name) and go to *Export and Import*
1. Select *Import from zip* and upload the zip provided (`./dialogflow-agent/voice-iot-maker-demo.zip`)

You've now imported the basic app shell — take a look at the new `ledControl` intent (viewable from the *Intents* tab). You can have a look there now if you're curious, or continue on to fill out the app's details.

1. Head over to the Integrations tab, and click *Google Assistant*.
1. Scroll down to the bottom, and click *Update Draft*
1. Go back to the *General* tab (in Settings), and scroll down to the *Google Project* details.
1. Click on the *Google Cloud* link and check out the project that's been created for you. Feel free to customize this however you like.
1. Click on the *Actions on Google* link, and go to *2 - App information*
1. Click *Add*, and fill in the details of your project there
    1. Add some sample invocations, as well as a pronunciation of your Assistant app's name
    1. Fill out the other required fields (description, picture, contact email, etc.)
1. Scroll down to the bottom, and click *Test Draft*

You can now test out the conversational side of the app in one of two ways:

- Talk to the Google Actions simulator: [https://developers.google.com/actions/tools/simulator](https://developers.google.com/actions/tools/simulator)
- Test queries (by the GUI or cURL) via the *try it now* interface in the Dialogflow GUI

You can also try talking to your application on any Assistant-enabled device that you‘re signed into.

However, if you’re following along step-by-step, it won't turn any lights on yet — we still have to set up the web service and the Photon app. Onward then!

### Google Cloud

Depending on which hosting environment you want to use, `cd` into either `./dialogflow-webhook/1-firebase-functions` or `./dialogflow-webhook/2-app-engine`, and continue the setup instructions in that directory's `README.md` file.

**IMPORTANT:** Regardless of what hosting/deployment method you choose, make sure you return to the Dialogflow panel and go into the *Fulfillment* tab to update the *URL* field. Also, check that the *DOMAINS* field is set to *"Enable webhook for all domains"*. Without doing these things, Dialogflow won't be able to talk to your new webhook.

### Particle

Make sure the Photon is correctly set up and connected. (If it’s not configured yet, follow the steps in the [Particle docs](https://docs.particle.io/guide/getting-started/start/photon/.)

You can upload your code to your photon via the [Particle web editor](https://build.particle.io/build/), the [Particle Desktop IDE](https://www.particle.io/products/development-tools/particle-desktop-ide) (based on Atom), or the [Particle command-line tools](https://docs.particle.io/guide/tools-and-features/cli/photon/#installing).

We'll be using the CLI for this example, which you can install thusly:

    sudo npm i particle-cli -g

To deploy via the command line, first make sure you’re logged in:

    particle login

You can find out the ID of your device by running:

    particle list

Then upload the code using that ID:

    particle flash [YOUR-DEVICE-ID] particle-photon/particle-blink-demo.ino

The Photon should blink rapidly while the upload is in process, and when it's done (and calmly pulsing cyan), you're ready to go.

**Note:** Make sure you [generate a Particle access token](https://docs.particle.io/reference/api/#generate-an-access-token), and add that token (along with your Photon's device id) to your `config.js` file.

You can make sure it all works by running the following from your terminal:

    curl https://api.particle.io/v1/devices/[YOUR-DEVICE-ID]/led -d access_token=[YOUR-ACCESS-TOKEN] -d led=on

If everything is configured properly, you should see something like the following:

````json
{
    "id": "[YOUR-DEVICE-ID]",
    "last_app": "",
    "connected": true,
    "return_value": 1
}
````

You should see the Photon's light come on (along with an LED on the breadboard, if you've wired one up)! Doing the same with `led=off` will return a `0` instead of a `1`, and will (you guessed it) turn the light off.

**Note:** If you ever see a `"return_value":-1`, that's an error message — something has gone wrong somewhere.

## Putting it all together

Once you’ve uploaded all the code and each service is configured, it’s time to give it all a try! You can confirm that everything went to plan by going to either your Assistant-enabled device or the [Google Actions simulator](https://developers.google.com/actions/tools/simulator), asking to talk to your app (*"talk to [APP-NAME]"*), and typing *"turn the light on"*. If all goes well, your LED should turn on!

## Further reading

This application is just a taste of what's possible — how far you take this framework is up to you!  Here are a few resources to help you continue on your journey:

- [Actions on Google: Invocation and Discovery](https://developers.google.com/actions/discovery/)
- [Actions on Google: Dialogflow](https://developers.google.com/actions/dialogflow/)
- [Sample Google Actions](https://developers.google.com/actions/samples/)
- [Particle/Google Cloud Platform integration](https://docs.particle.io/tutorials/integrations/google-cloud-platform/)

## Acknowledgements

This demo was created by the Google Proto Studio team, including:

- [Mike Dory](https://github.com/mikedory)
- Vikram Tank
- Amanda McCroskery

This has been a collaboration with the [Google AIY Projects](https://aiyprojects.withgoogle.com/) team. Extra high fives to:

- Billy Rutledge
- James McLurkin
- Jess Holbrook
- Jordan Barber
- Cindy Teruya
- [David Stalnaker](https://github.com/davidstalnaker)

Special thanks to [Sabah Kosoy](https://github.com/sabahkosoy), [Jeff Nusz](https://github.com/customlogic), [Michael Cavalea](https://github.com/callmecavs), and [Jeff Gray](https://github.com/j3ffgray).
