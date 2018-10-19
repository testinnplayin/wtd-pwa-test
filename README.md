# wtd-pwa-test
<a name="toc"></a>
----

# Table of Contents

I. [Introduction](#intro)

II. [Architecture](#architecture)

&nbsp;&nbsp;&nbsp;&nbsp;A. [File Structure](#f-struct)

----

<a name="intro"></a>
# I. Introduction

This is a test project to check out some Progressive Web App (PWA) techniques. A combination of [Google Code Labs](https://developers.google.com/web/fundamentals/codelabs/your-first-pwapp/) and the [Mozilla Developers Documents](https://developer.mozilla.org/en-US/docs/Web/Apps/Progressive) were used as a base for creating this test.

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
|    | app.js
| index.js
| package.json
```
