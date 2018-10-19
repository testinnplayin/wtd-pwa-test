# wtd-pwa-test
<a name="toc"></a>
----

# Table of Contents

I. [Introduction](#intro)

II. [Architecture](#architecture)

&nbsp;&nbsp;&nbsp;&nbsp;A. [File Structure](#f-struct)

&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1. [Details on Organization of Files](#f-struct-dets)

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

