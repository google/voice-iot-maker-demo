# Dialogflow/Particle webhook example (Cloud Functions for Firebase)

This is the example code for the Dialogflow/Particle webhook application, designed to be deployed to [Cloud Functions for Firebase](https://firebase.google.com/docs/functions/).

## Local settings

This application assumes that you‘re keeping your Particle access token and Photon’s device ID in a file called `config.js`. However, you‘ll notice that one isn’t included — because you'll need to fill out your own. (This keeps the sensitive keys out of source control — always a good practice.)

To start, copy the sample settings file into a new file (in the same directory):

    cp ./config.sample.js ./config.js

You can grab the `deviceID` and `accessToken` values from the Particle Cloud Console.

## Setup instructions

Install the required NPM libraries that this application relies on (from the `functions` directory):

    npm install

**Note**: Included in this bundle is an alias for running a linter on your JS files. It'll even auto-fix the non-compliant lines! Access it using:

    npm run lint

## Deploying

In order to test how Firebase will run and serve your code, you'll want to install the command-line tools. The full details are available on the [Firebase CLI Reference](https://firebase.google.com/docs/cli/) page, and you'll want to follow those steps.

1. Once your accounts are all set and handled, you'll want to [set up and initialize Firebase SDK for Cloud Functions](https://firebase.google.com/docs/functions/get-started#set_up_and_initialize_functions_sdk). You can do that by running the following:

        npm install -g firebase-tools

1. To tie your local machine to your Google Cloud account, run:

        firebase login

1. Next, you'll want to set up your project locally:

        firebase init functions

    Be sure to pick the project that you created in the Actions on Google console. (If you haven't created an app yet, you can go to the [Firebase console](https://console.firebase.google.com), and start a new project there.)

    **Important!** Be sure that you don't replace the `package.json` or `index.js` files during this setup, or else you'll need to re-download them before continuing. However, you do want to answer `Y` when asked about installing dependencies through npm.

1. Now, you'll want to head to the [Google Cloud Platform console](http://cloud.google.com/console), click on *Storage* on the left side, and make sure that billing is enabled.

1. Go back to the [Firebase Console](https://console.firebase.google.com), and look for *Spark* in the bottom-left corner of the page.
    1. Click *UPGRADE*, and then select the *Blaze* plan.
    1. Click *PURCHASE*, and after the confirmation, you can exit out of that dialog.

1. You can now test your code locally by running:

        firebase serve --only functions

    If all is working as expected, you should see a URL listed at the bottom of the terminal output (something like `ledAction: http://localhost:5000/[YOUR-APP]/us-central1/ledAction`).

    You can test that the service is running by going to the app's URL or cURLing it:

        curl [http://localhost:5000/[YOUR-APP]/us-central1/ledAction]

    You should see something like the following (which is expected):

        Action Error: no matching intent handler for: null

1. If everything is working properly locally, you're ready to deploy your code live!

        firebase deploy --only functions

    Again, you'll see a URL listed at the bottom of the terminal output — this tells you where your new cloud function lives. Grab that URL, and use it as your fulfillment url (see the main tutorial).

Boom! You have a running service!

**Tip**: Here’s a convenience method for testing, which you can use from here on out:

    npm run start

And similarly, for deploying:

    npm run deploy

Both need to be run from inside the `functions` directory.

## Acknowledgements

The following libraries/open-source projects were used in the development of this example:

- [Node.js](http://nodejs.org/)
- [Actions on Google Client Library](https://github.com/actions-on-google/actions-on-google-nodejs)
- [Firebase tools](https://github.com/firebase/firebase-tools)
- [Particle Cloud API JS library](https://github.com/spark/particle-api-js)