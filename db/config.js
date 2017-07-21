// var app = require('../server/server.js');
var express = require('express');
var path = require('path');

var knex = require('knex')({
  client: 'sqlite3',
  connection: {
      filename: path.join(__dirname, '/planendar.sql')
  },
  useNullAsDefault: true
})

var db = require('bookshelf')(knex);

db.knex.schema.hasTable('users').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('users', function(users) {
      users.increments('id').primary();
      users.string('name', 254);
      users.string('email', 254);
      users.string('password', 254);
      users.string('photo', 1000).defaultTo('https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg');
    }).then((table) => {
      console.log("Created table ", table);
    });
  }
});

db.knex.schema.hasTable('appointments').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('appointments', function(appointments) {
      appointments.increments('id').primary();
      appointments.integer('user_id');
      appointments.foreign('user_id').references('users.id');
      appointments.string('title', 140);
      appointments.string('description', 300);
      appointments.date('start_date');
      appointments.string('start_date_time');
      appointments.date('end_date');
      appointments.string('end_date_time');
      appointments.string('location');
    }).then((table) => {
      console.log("Created table ", table);
    });
  }
});

db.knex.schema.hasTable('reminders').then(function(exists) {
  if(!exists) {
    db.knex.schema.createTable('reminders', function(reminders) {
      reminders.increments('id').primary();
      reminders.integer('appointment_id');
      reminders.foreign('appointment_id').references('appointments.id');
      reminders.string('description', 300);
      reminders.integer('minutes');
    }).then((table) => {
      console.log("Created table ", table);
    });
  }
});


module.exports = db;