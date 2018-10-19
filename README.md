# wtd-pwa-test
<a name="toc"></a>
----

# Table of Contents

I. [Introduction](#intro)

II. [Architecture](#architecture)

&nbsp;&nbsp;&nbsp;&nbsp;A. [File Structure](#f-struct)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. [Details on Organization of Files](#f-struct-dets)

&nbsp;&nbsp;&nbsp;&nbsp;B. [Functional Architecture and Behavior of the App](#func-arch)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. [The Service Worker](#sw)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2. [Socket Events](#sockets)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3. [HTTPS Mode](#https)

III . [Installation on Local Machine](#installation)

&nbsp;&nbsp;&nbsp;&nbsp;A. [Requirements](#requirements)

&nbsp;&nbsp;&nbsp;&nbsp;B. [Installing and Set Up](#setup)

----

<a name="intro"></a>
# I. Introduction

This is a test project to check out some Progressive Web App (PWA) techniques. A combination of [Google Code Labs](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/) and the [Mozilla Developers Documents](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive) were used as a base for creating this test.

In this test we have an application that allows us to in theory create Thingamabobs. Thingamabobs have an awesome_field field that a user can store text input in (Note we did not actually code that part in so this is built on Thingamabobs that were created in a separate test project). When a Thingamabob is created, a Dohicky is also created that makes a reference to a Thingamabob. The Dohicky also has the property of being able to be activated. When it is, the Dohicky triggers the creation of a Whatchamagigger. Whatchamagiggers are special because once created, they keep on being created once every minute and the user is notified of the Whatchamagigger creation.

The goal of this seemingly strange app is to test certain elements we want to have in a real PWA we want to develope so it is more a proof of concept than anything else.

[Top](#toc)

<a name="architecture"></a>
# II. Architecture

The architecture is partly described by the file structure but also the functionality that we want to have.

<a name="f-struct"></a>
## A. File Structure

The file structure is as follows:

```
project
|__certs
|__events
|  | dohicky-events.js
|__node_modules
|__public
|  |__images
|  |__scripts
|     |__constants
|        |  lists.js
|     |__dashboard
|        |  table-data.js
|     |__dohickies
|        |  dohickies.js
|     |__helpers
|        |  events.js
|        |  renderers.js
|     |__lists
|        |  lists.js
|     |__styles
|        |  index.css
|        |  lists.css
|        |  main.css
|        |  normalize.css
|     |__views
|        |  list.html
|   | api-res.js
|   | index.html
|   | index.js
|   | manifest.json
|   | sw.js
|   |__routes
|      |  dashboard-router.js
|      |  dohicky-router.js
|      |  thingamabob-router.js
|      |  whatchamagigger-router.js
|   |__src
|     |__handlers
|       |  error-handlers.js
|       |  success-handlers.js
|     |__models
|       |  dohicky.js
|       |  thingamabobs.js
|       |  whatchamagiggers.js
|     |__whatchamagiggers
|       |  what-generator.js
| index.js
| package.json
```

[Top](#toc)

<a name="f-struct-dets"></a>
### 1. Details on Organization of Files

The back-end and front-ends are both coded in this project. We will discuss the back-end first.

The back-end's point of entry is index.js at the root of the project. This contains the server code used to connect to the database and set up the web server. The technology stack for the back is Node.js, Express.js, Socket.io and MongoDB using the Mongoose driver.

The src/ folder contains the models for the MongoDB documents. Express routes are contained in the /routes folder. Socket events are contained in the events/ folder.

Also on the back-end, the src/ folder contains a handlers/ folder for both success states and error states. The whatchamagiggers/ folder contains the code for triggering the Whatchamagigger creation loop (see intro above).

The front-end stack is ES6 JavaScript and is located in the public/ folder. All style and script files have the same name as the HTML file they belong to. CSS files are located in the styles/ folder and JS files are mainly in the scripts/ folder. Some exceptions are the service worker (sw.js), the index.js file and the api-res.js file (which contains information on the back-end urls).

The point of entry of the front-end is index.html. There is only one other view and that's lists.html, which contains the skeleton for any view that has a list in it. It's reused for /dohickies and /thingamabobs (and /whatchamagiggers though that has not been coded).

The other js-related directories and files contain modularized code or constants to aid in maintaining and keeping repetition to a minimum.

Other front-end resources, such as icons, are also stored and served from the public/ folder. The manifest.json file, for creating a believable fake native app on a phone, is at the root of this folder.

[Top](#toc)

<a name="func-arch"></a>
## B. Functional Architecture and Behavior of the App

This PWA is a Multi-Page Application that has the server sending HTML/CSS/JS files to the client. Since this was a test project, there is no build or bundler or anything sophisticated. Everything is sent directly from the public/ folder.

The back-end, as previously mentioned, is on Node.js with Express.js and Mongoose. The database used is MongoDB, which stores the three collections Thingamabobs, Dohickies and Whatchamagiggers.

The front-end is spartanly coded with ES6 JavaScript. To avoid having to call the server to resend the entire HTML page when there is a change, the global state pattern was used for updating only the elements that change. Front-end modules are used so that code is not repeated.

The app is divided into four views, one of which has not been coded. The landing page is a dashboard containing two widgets both with the number of Thingamabobs and Dohickies that exist in their collections. When the user clicks on a widget, a modal pops up with more details organized in a tabular fashion.

The user can also navigate to the other views, which are all lists. When arriving, for example, on /thingamabobs, the user sees a list and an add button. On clicking on an element in the list, a modal appears with more details about the Thingamabob. Clicking on the add button opens a form-based modal, which has not been fully implemented. On the /dohickies list view, clicking on a dohicky opens a modal not only with more information on the Dohicky but also a play button. When the user clicks on the play button, the Dohicky is activated and a Whatchamagigger creation loop is triggered.

Each time a new Whatchamagigger is created (once a minute), the user receives a push notification about the fact.

There is also an offline component, only put in place for the dashboard view. Namely the idea is that the user can still visit the dashboard and other pages but also the dashboard widgets still function annd the user can still see a count in the widgets themselves. As such, a cache-first-update-later strategy was used.

[Top](#toc)

<a name="sw"></a>
### 1. The Service Worker

A service worker was implemented and tested mainly on a recent version of Chrome and Chrome Mobile (on Android). We only had time to put into place the dashboard to its fullest. We only used the caches API for our test. The entire shell of the app was cached so that the user can visit any view in the app and still see what is expected even if he loses internet access. Since this is a simple test, we did not do any cache management or using any other form of storage in conjunction with it. 

What is important though is that some back-end resources are also set up to be cached, mainly the counts of Thingamabobs and Dohickies. If the user opens a table, that table data is also stored in the cache.

The service worker is also semi-set up for dealing with push notifications though the current test system bypasses it.

The service worker is set up to only register and install once from inside index.js otherwise it installs everytime the user visits the index.html view. Its scope is set to work on all of the public portion of the app and thus was placed at the root of the public/ folder.

Please note that it is supposed to work in conjunction with the manifest.json, which contains a theme, background color, titles and icons for the 'native' app on cell phones but so far only the icons and 'executable' seem to work properly.

[Top](#toc)

<a name="sockets"></a>
### 2. Socket Events

So far only there are two socket events set up: Dohicky activation and Whatchamagigger creation. The latter is hooked up to a push notification system.

[Top](#toc)

<a name="https"></a>
### 3. HTTPS Mode

This is a very important thing to keep in mind. Even though localhost tests are supposedly exempt from having to be put into HTTPS mode, we could not get any installation or push notification tests working on even a USB-connected Android phone. Google Dev Tools saw the phone just fine but the phone never installed the service worker and without the service worker only the default functionality was put into place (no alerts or prompts were coded to replace push notifications if the Notification API is not supported). 

HTTPS mode added as a last step in order to be able to install the app on a phone and test the push notifications. In the current version, the certs/ folder contains the private and public keys for getting the server's HTTPS to work. The user has to install the public key on their computer and then add it to the list of certifications the browser uses. Once this is done, the user can visit the app, install it on their phone and execute it.

[Top](#toc)

<a name="installation"></a>
# III. Installation on Local Machine

<a name="requirements"></a>
## A. Requirements

To try out this app, first we're assuming that the tester has the following installed on their computers:
- NPM/Node.js (version 8+ of Node is being used)
- MongoDB
- Chrome (preferentially), any browser based on recent versions of Chromium or Firefox
- Git
- Development-friendly text editor such as Sublime, Atom, Visual Studio Code, etc.

We're also assuming that the tester is knowledgeable in the use of NPM, MongoDB and Git. They should also know how to generate a private and public key or a basic understanding of SSL/TLS in order to set up the HTTPS part.

[Top](#toc)

<a name="setup"></a>
## B. Installing and Set Up

Git clone this project or fork it to the local machine. Then do:

```npm install```

Check what the public TCP/IP of the local machine is and be sure to update the url's in the following files:
- public/sw.js (dashboardURLs)
- public/api-res.js (bAddress)
- public/scripts/lists/lists.js (const stocket = io(etc))

Note that that public TCP/IP is what should be used to connect to the running app on the phone. Also note that what was not cloned in this project is a config.js file that contains the database URL and the server port. Be sure to put those in a separate file called config.js and then update the root/index.js server file.

In order to set up the HTTPS, please following this doc:

[https://nodejs.org/api/tls.html#tls_tls_ssl_concepts](https://nodejs.org/api/tls.html#tls_tls_ssl_concepts)

The public key generated from these steps must be installed and added to the certifications on whatever browser will be used on the local machine but also on any phone. This can be done via USB cable. The tester will know it's set up properly when they see a green padlock icon in the left-hand corner of the url bar of their browser.

Be sure that MongoDB is running before trying to start the server.

To run the server, type either:

```node ./index.js```

or

```npm run start```

Once connection to the database is confirmed, there should also be a message saying that the server is listening.

On the local machine, visit https://localhost:{port} where {port} is whatever port the tester has chosen to put his server on. If not, visit the page at the public TCP/IP address mentioned above on the phone, assuming the phone is on the same internet box/router. This has not been set up for using a phone on a cellular network.

[Top](Toc)
