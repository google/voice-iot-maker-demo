# Dialogflow/Particle webhook example (Google App Engine)

This is the example code for the Dialogflow/Particle webhook application, designed to be deployed to [Google App Engine](https://cloud.google.com/appengine/).

## Local settings

This application assumes that you're keeping your Particle access token and Photon's device ID in a file called `config.js`. However, you'll notice that there isn't one included — because you'll need to fill our your own! (And, it keeps the sensitive keys out of source control — always a good practice.)

To start, copy the sample settings file into a new file (in the same directory):

    cp ./config.sample.js ./config.js

You can grab the `deviceID` and `accessToken` values from the Particle Cloud Console.

## Setup instructions

Install the required NPM libraries that this application relies on:

    npm install

You can validate that everything worked by starting up the application locally:

    npm start

And cURLing the local application:

    curl http://localhost:3000

You should see it reply back with `It works!` — and if you see that, well, you know it works! =)

**Note**: Included in this bundle is an alias for running a linter on your JS files. It'll even auto-fix the non-compliant lines. Access it using:

    npm run lint

## Testing

You can run this locally as a web server, in order to test any changes:

    npm start

In order to integrate it with the full Dialogflow environment, you can also use a local proxy service like [ngrok](https://ngrok.com/) to expose a tunnel from your machine, and then plug the service URL into the Dialogflow panel.

**Highly recommended for rapid development and prototyping!

## Deploying

*__Note:__ This demo assumes that you'll be using Google Cloud App Engine to host and serve your code. If you've already got a hosting environment set up there (or elsewhere), feel free to skip this section.*

In order to provide a web endpoint for our Dialogflow webhook, we’ll set up and run a Node app on App Engine. If you're curious about the details of this, check out the `app.yaml` file here.

To get set up locally, and create a new App Engine instance, follow the steps laid out in these [Google App Engine deployment instructions](https://developers.google.com/actions/tools/fulfillment-hosting#deploying_to_google_app_engine).

1. Once you create your account and download the tools and SDK, everything configure locally using:

        gcloud init

1. To then set the cloud project locally:

        gcloud config set project [YOUR-APP-NAME]

1. To deploy your code live:

        gcloud app deploy

1. You can test that the service is running by going to the app's URL or cURLing it:

        curl https://[YOUR-APP-NAME].appspot.com

    You should see the friendly `it works!` again!

    **Note**: Here’s convenience method for deploying, which you can use from here on out:

        npm run deploy

## Acknowledgements

The following libraries/open-source projects were used in the development of this example:

- [Node.js](http://nodejs.org/)
- [Express](https://expressjs.com/)
- [Nodemon](https://github.com/remy/nodemon)
- [Actions on Google Client Library](https://github.com/actions-on-google/actions-on-google-nodejs)
- [Google Cloud SDK](https://cloud.google.com/sdk/docs/)
- [Particle Cloud API JS library](https://github.com/spark/particle-api-js)
