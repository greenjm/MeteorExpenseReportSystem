# Meteor Expense Report System
---

# Getting Started

## Installation

This program was built using the Meteor.js web framework. To run the program, you must first [install Meteor.js](https://www.meteor.com/install) on your machine. Meteor.js supports all major operating systems.

## Version

Current Meteor.js version: METEOR@1.4.3.2

## Run Locally

Before running the program, you should first make sure all packages are up to date. Open a terminal at the project's location and type `meteor npm install` to install all packages. To run the meteor program on localhost, run `meteor`. The website can be viewed using any web browser at localhost:3000.

---

# Development

## Submitting Issues

If you find a bug while using the program or would like to request a feature, please submit it as a Github issue. Ensure the title is descriptive enough to describe the issue/feature. If you are submitting a bug, include detailed steps to reproduce the bug and, if applicable, a screenshot showcasing the bug in action.

## Code Style

All code writting for this project follows the Meteor.js [style guide](https://guide.meteor.com/code-style.html) and Google's JavaScript [style guide](https://google.github.io/styleguide/javascriptguide.xml). An ESLint plugin is used to ensure code consistency throughout the project. Further ESLint reference can be found [here](http://eslint.org/).

## File Hierarchy

In this section, we will look at the various folders within the project's file structure. For each one, we will explain what the folder is for, what files currently exist in the folder, and when you would want to update or add a file within that folder.

### client/

The client folder is the client entry point for Meteor.js. The main.js file imports all of the startup code for the client. main.html loads fonts and main.css, our custom stylesheet. It contains one placeholder tag in the body, which is used by React.js for rendering. It is unlikely for a developer to need to update or add files in this folder, except for main.css if you are adding custom CSS.

### imports/api/

This folder contains all of the database collections, publications, and API methods used throughout the project. Each collection, along with its respective publications and methods, is divided into its own subfolder named after the collection (i.e. imports/api/projects and imports/api/notifications). Each subfolder contains a .js file named after the collection (imports/api/projects/projects.js) that is responsible for creating the Mongo collection. Each subfolder had a methods.js file. This file will call Meteor.methods({ }) and declare any API methods that are relevant to that particular collection. To avoid duplicate names, all methods follow a naming system of '[collectionName].[methodName]', such as 'notifications.create' and 'projects.create'. Lastly, in order to publish data, these subfolders must contain a server folder with a publications.js file (imports/api/projects/server/publications.js). This file declares all publications by calling Meteor.publish().

The only time you will add new files to imports/api is if you are adding a new collection to MongoDB. Before that collection can be used throughout the project, each of the files in a collection's folder must be imported in server/main.js. Any changes to an existing collection should be done using the files already in that collection's folder.

### imports/startup/

This folder contains all of the files that must be loaded on startup for both the client (imports/startup/client/) and server (imports/startup/server/). The server startup only contains one startup file, fixtures.js. This file is responsible for seeding a new MongoDB when the project is first launched. This can be turned off by either removing the import from server/main.js or by removing the calls to the seeding functions within fixtures.js. The client startup contains a file called index.js that is used as a single entry point for importing client startup code. The routes.jsx file sets up the React Router, and theme.jsx overrides the default Material-UI theme. If you add new files here, you must ensure that they are imported properly to the client or server. Routes can be added, removed, or updated from routes.jsx. If you would like to make changes to the theme, this [reference](http://www.material-ui.com/#/customization/themes) will help explain how to make those changes.

### imports/ui/

This folder contains all files used for client-side rendering. Every page involves two files. The fist is a a page file found in imports/ui/pages/ (i.e. adminDashboard.js). The page file receives any data it needs from the database via the container file, and is responsible for rendering the page. The page file also contains helpers such as event handlers to add page functionality. The second is a container file found in imports/ui/components/ (i.e. adminDashboardContainer.js). The container file imports the page file and uses the react-meteor-data package to create a reactive container for the page. The container is responsible for loading any data the page will need to use, using Meteor.subscribe(), and sending it as a JSON object. Note that all routes should link to the container, not the page itself.

### public/

The public folder contains images that will be loaded throughout the site. Avoid using URLs as a source for images, as it can increase load times, and is not a guarantee that the image will continue to exist.

### server/

This folder contains one file, main.js. This is the entry point into all server code for Meteor.js. At the top of the file, all startup files should be imported. Below that are three sections of imports, Methods, Collections, and Publications. These correspond to the methods.js, [collectionName].js, and server/publications.js files found in imports/api/. All of these files must be imported by the server to be accessible throughout the site.

## Packages

Packages and dependencies used for this project can be found in the '/MeteorExpenseReportSystem/package.json' and '/MeteorExpenseReportSystem/.meteor/packages' files. In general, it is not necessary to know everything about these packages. However, there are a few that come up often during development:

- [react-meteor-data](https://atmospherejs.com/meteor/react-meteor-data)
- [CollectionFS](https://github.com/CollectionFS/Meteor-CollectionFS)
- [Material-UI](http://www.material-ui.com/#/)

---

# Deployment

Deployment is handled through [Docker](https://www.docker.com/). Deployment settings come from the Dockerfile in the project's root folder. To build the docker image, enter `docker build /path/to/MeteorExpenseReportSystem` into a terminal. The image can be run using the `docker run` command. For more information, use the official Docker [documentation](https://docs.docker.com/reference).
