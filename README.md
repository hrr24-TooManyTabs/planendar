# Planendar


[![Build Status](https://travis-ci.org/hrr24-TooManyTabs/planendar.svg?branch=master)](https://travis-ci.org/hrr24-TooManyTabs/planendar)

Planendar is a calendar application for scheduling personal appointments and events. With Planendar, users can create appointments, set notifications, share appointments with other users and check the weather.

Planendar comes as an improvement upon some of the more popular calendar applications developed for the web and mobile devices and allows users all of the features that currently do not exist in one single application.

## Team

  - __Scrum Master__: Alex Jungroth
  - __Product Owner__: Andrew Foresi
  - __Development Team Members__: Placid Rodrigues, Kevin MacFarlane


## Usage

To run the application on the web visit http://ec2-54-146-104-39.compute-1.amazonaws.com

To run the application on your local machine, clone this repo to your machine. Then run the following three commands from project root:
```
npm install
npm run bundle
npm run start-dev
```
Then open the app in browser at http://localhost:8080

After you have the application running, create a user profile with a valid email address.

Once you have created a user profile you now have access to all of the features included in Planendar. By using the input fields at the top of the screen you can create and share appointments by entering the fields that are necessary to your appointment.

You can also share, edit and delete appointments even after they have been added to your calendar. Simply click on the appointment that you would like to delete, edit or share and use the input fields at the top of the screen accordingly.
  - To delete an appointment click the 'Delete' button
  - To update an appointment, modify any of the necessary fields at the top of the screen the click 'Update'
  - To share an appointment click the 'Share' button and enter the email address of a valid Planendar user

## Tech Stack

  - Frontend: React.js,
  - Backend: Express.js, Node.js,
  - Database: Sqlite3,
  - Continuous Integration: Travis CI,
  - Deployment: Amazon Web Services EC2

## Important Files

#### /lib/request-handler.js
This file handles most back end interactions between the client and database. Look here for creating, reading, updating, and deleting appointments and reminders. Users can be created and their profile information can read and updated. Also check this file for:
  - login
  - sign-up
  - sessions
  - reading weather data
  - confirming appointments

#### /public/components/App.jsx
App is the top level component for the application. It's children are Navbar and Calendar. Most ajax calls to the server are made in App. Currently the state for Calendar and CreateAppointment is managed in App. Part of a refactor we want to do is to move the state for CreateAppointment down into CreateAppointment.

#### /public/components/Calendar.jsx
Calendar renders the calendar from react-big-calendar to the dom. Appointments are rendered here as events. The month, week, day, and agenda views are all from react-big-calendar. We would eventually like to include the work view as soon as it is ported from bower to npm.

#### /public/components/CreateAppointment.jsx
Create Appointment is the collection of form input fields inside of Navbar. All of the form inputs are controlled stateful form input fields, which means they are updated to reflect state as the user types. These input fields are used for both creating an appointment and updating an appointment.

#### /views/layout.ejs
This file is where the .ejs files files are loaded. It also contains the bootstrap and css styling for the application.

## Testing

#### Testing is broken down into three files
  - /test/frontend/frontend-unit-test.js
  - /test/integration/server-integration-test.js
  - /test/unit/server-test.js

server-integration-test.js and server-test.js handle all the tests for the backend

frontend-unit-test.js handles all the tests for the front end

When changing the structure of components, adding or deleting components, or updating the props that are passed from component to component MAKE SURE TO REFLECT THAT CHANGE IN THE TESTS!

*All tests are run by Travis CI. Successfully updating and adding tests is key to a successful pull request and project.*

## APIs

#### APIXU
We are using this API to get weather data. To get an API key, go to their website and make an account. It's that easy.
It would be a good addition to credit them in the app by putting their logo or name in the weather search bar and in the weather pop ups.

## Installing Dependencies

From within the root directory, run:
```
npm install
```

