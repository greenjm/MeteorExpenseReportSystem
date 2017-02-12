# MeteorExpenseReportSystem
Expense report system that utilizes Meteor.js

## Running
From terminal, access working directory for project.

run /MeteorExpenseReportSystem$ meteor npm install

  This will install/update all the packages that the project uses and depends on.
  
run /MeteorExpenseReportSystem$ meteor

  This will have the project running on localhost:3000

Access localhost through Google Chrome or Mozilla Firefox

On the login page you will enter an email and password that have been seeded by the project.

  (To view what accounts seeded and their passwords go to fixtures.js which has the path:
  
  MeteorExpenseReportSystem/imports/startup/server/fixture.js)
  
  Example user email for login: Admin: havensid+admin@rose-hulman.edu / nonAdmin: havensid@rose-hulman.edu
  
  For all test users that are seeded, Password: 12345678
  
##Implemented Features
Not all features have been implemented yet. Here is a simple list of what has been completed:

Login is functional for both admins and regular employees. Logging in with bad credentials shows an error.

Admin users are taken to a landing page with a list of projects and a list of employees.

Admins can click on the magnifying glass to view the details of a specific project.

Admins can click on the "New" button on the users table to create a new user.

Admins can click on the "New" button on the Projects table to create a new project.

Admins can click on the hamburger menu at the top right.

Admins can log out from the hamburger menu.

##Unimplemented features
These features have buttons or look like they should work, but the code doesn't exist yet.

Employee users do not have a landing page yet, only a success message for logging in.

Admins cannot edit users yet, despite the pencil icon on the table.

The "Profile" option in the hamburger menu doesn't do anything yet.

## Deployment
Deployment for this project is being handled by hosting a docker image on our own VM.
Currently, deployment is a manual process, with the goal to automate it in the near future.
The most recent deployed version can be reached at the url 137.112.40.146:8080 in any browser.